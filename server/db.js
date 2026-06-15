import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export async function initNewTables() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(`
            ALTER TABLE users
                ADD COLUMN IF NOT EXISTS phone TEXT,
                ADD COLUMN IF NOT EXISTS city TEXT,
                ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'PK',
                ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS zone_id UUID
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS wallets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                balance NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
                currency TEXT NOT NULL DEFAULT 'PKR',
                is_frozen BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, currency)
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS wallet_transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                wallet_id UUID NOT NULL REFERENCES wallets(id),
                user_id UUID NOT NULL REFERENCES users(id),
                type TEXT NOT NULL CHECK (type IN ('credit','debit','hold','release','fee','refund','payout')),
                amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
                balance_before NUMERIC(12,2) NOT NULL,
                balance_after NUMERIC(12,2) NOT NULL,
                reference_type TEXT,
                reference_id UUID,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','reversed')),
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_wallet_txn_user ON wallet_transactions(user_id, created_at DESC)
        `);

        await client.query(`
            CREATE OR REPLACE FUNCTION wallet_mutate(
                p_user_id UUID,
                p_type TEXT,
                p_amount NUMERIC,
                p_ref_type TEXT DEFAULT NULL,
                p_ref_id UUID DEFAULT NULL,
                p_description TEXT DEFAULT NULL
            ) RETURNS wallet_transactions AS $$
            DECLARE
                v_wallet wallets;
                v_new_balance NUMERIC;
                v_txn wallet_transactions;
            BEGIN
                SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;
                IF NOT FOUND THEN
                    RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
                END IF;
                IF v_wallet.is_frozen THEN
                    RAISE EXCEPTION 'Wallet is frozen';
                END IF;
                IF p_type IN ('debit','hold','fee') THEN
                    IF v_wallet.balance < p_amount THEN
                        RAISE EXCEPTION 'Insufficient balance';
                    END IF;
                    v_new_balance := v_wallet.balance - p_amount;
                ELSE
                    v_new_balance := v_wallet.balance + p_amount;
                END IF;
                UPDATE wallets SET balance = v_new_balance, updated_at = NOW() WHERE id = v_wallet.id;
                INSERT INTO wallet_transactions(wallet_id, user_id, type, amount, balance_before, balance_after, reference_type, reference_id, description)
                VALUES (v_wallet.id, p_user_id, p_type, p_amount, v_wallet.balance, v_new_balance, p_ref_type, p_ref_id, p_description)
                RETURNING * INTO v_txn;
                RETURN v_txn;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS bnpl_agreements (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id),
                booking_id UUID,
                total_amount NUMERIC(12,2) NOT NULL,
                installments INT NOT NULL DEFAULT 3,
                installment_amount NUMERIC(12,2) NOT NULL,
                paid_installments INT NOT NULL DEFAULT 0,
                next_due_date DATE NOT NULL,
                status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','defaulted','cancelled')),
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS provider_trust_scores (
                provider_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                score NUMERIC(5,2) NOT NULL DEFAULT 0,
                tier TEXT NOT NULL DEFAULT 'new' CHECK (tier IN ('champion','trusted','verified','rising','new')),
                completion_rate NUMERIC(5,2),
                avg_rating NUMERIC(3,2),
                total_completed INT DEFAULT 0,
                dispute_free_streak INT DEFAULT 0,
                response_time_hours NUMERIC(6,2),
                vouches_count INT DEFAULT 0,
                last_computed_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS loyalty_ledger (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id),
                coins BIGINT NOT NULL,
                reason TEXT NOT NULL,
                reference_type TEXT,
                reference_id UUID,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_user ON loyalty_ledger(user_id, created_at DESC)
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                actor_id UUID REFERENCES users(id),
                action TEXT NOT NULL,
                entity TEXT NOT NULL,
                entity_id UUID,
                payload JSONB,
                ip_address TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id, created_at DESC)
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                data JSONB,
                read BOOLEAN DEFAULT FALSE,
                sent_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC)
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS provider_vouches (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                provider_id UUID NOT NULL REFERENCES users(id),
                voucher_id UUID NOT NULL REFERENCES users(id),
                zone_id UUID,
                message TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(provider_id, voucher_id)
            )
        `);

        await client.query('COMMIT');

        await pool.query(`
            CREATE OR REPLACE FUNCTION recompute_trust_score(p_provider_id UUID) RETURNS VOID AS $$
            DECLARE
                v_completed INT := 0;
                v_total INT := 0;
                v_avg_rating NUMERIC := 0;
                v_vouches INT := 0;
                v_score NUMERIC;
                v_tier TEXT;
                v_completion_rate NUMERIC := 0;
                v_has_avatar BOOLEAN := FALSE;
            BEGIN
                SELECT
                    COUNT(*) FILTER (WHERE status = 'completed'),
                    COUNT(*)
                INTO v_completed, v_total
                FROM bookings WHERE provider_id = p_provider_id::TEXT;

                IF v_total > 0 THEN
                    v_completion_rate := v_completed::NUMERIC / v_total::NUMERIC;
                END IF;

                SELECT COALESCE(AVG(rating), 0) INTO v_avg_rating
                FROM reviews WHERE provider_id = p_provider_id::TEXT;

                SELECT COUNT(*) INTO v_vouches
                FROM provider_vouches WHERE provider_id = p_provider_id;

                SELECT avatar_url IS NOT NULL INTO v_has_avatar
                FROM users WHERE id = p_provider_id;

                v_score := LEAST(100,
                    (v_completion_rate * 40) +
                    ((v_avg_rating / 5.0) * 25) +
                    (LEAST(v_completed, 100) / 100.0 * 15) +
                    (CASE WHEN v_has_avatar THEN 10 ELSE 0 END) +
                    (LEAST(v_vouches, 5) * 2)
                );

                v_tier := CASE
                    WHEN v_score >= 90 THEN 'champion'
                    WHEN v_score >= 78 THEN 'trusted'
                    WHEN v_score >= 62 THEN 'verified'
                    WHEN v_score >= 45 THEN 'rising'
                    ELSE 'new'
                END;

                INSERT INTO provider_trust_scores(provider_id, score, tier, completion_rate, avg_rating, total_completed)
                VALUES (p_provider_id, v_score, v_tier, v_completion_rate, v_avg_rating, v_completed)
                ON CONFLICT (provider_id) DO UPDATE SET
                    score = EXCLUDED.score,
                    tier = EXCLUDED.tier,
                    completion_rate = EXCLUDED.completion_rate,
                    avg_rating = EXCLUDED.avg_rating,
                    total_completed = EXCLUDED.total_completed,
                    last_computed_at = NOW();
            END;
            $$ LANGUAGE plpgsql;
        `);

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function writeAuditLog({ actorId, action, entity, entityId, payload, ipAddress }) {
    try {
        await pool.query(
            `INSERT INTO audit_log(actor_id, action, entity, entity_id, payload, ip_address)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [actorId || null, action, entity, entityId || null, payload ? JSON.stringify(payload) : null, ipAddress || null]
        );
    } catch (_) {}
}

export async function createNotification({ userId, type, title, body, data }) {
    try {
        const { rows } = await pool.query(
            `INSERT INTO notifications(user_id, type, title, body, data, sent_at)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [userId, type, title, body, data ? JSON.stringify(data) : null]
        );
        return rows[0];
    } catch (_) { return null; }
}

export async function ensureWallet(userId) {
    await pool.query(
        `INSERT INTO wallets(user_id) VALUES ($1) ON CONFLICT (user_id, currency) DO NOTHING`,
        [userId]
    );
}
