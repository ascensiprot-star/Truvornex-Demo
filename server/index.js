import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;
const isProd = process.env.NODE_ENV === 'production';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const PgSession = connectPgSimple(session);

app.use(express.json());

app.use(session({
    store: new PgSession({ pool, tableName: 'session', createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProd,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));

async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'provider', 'admin')),
                avatar_url TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('Database ready');
    } catch (err) {
        console.error('DB init error:', err.message);
    }
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(':');
    const hashBuf = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(hashBuf, Buffer.from(hash, 'hex'));
}

function requireAuth(req, res, next) {
    if (!req.session?.user) return res.status(401).json({ error: 'Not authenticated' });
    next();
}

app.get('/api/auth/user', (req, res) => {
    if (req.session?.user) return res.json({ user: req.session.user });
    return res.json({ user: null });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        const user = rows[0];
        if (!user || !verifyPassword(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const sessionUser = { id: user.id, email: user.email, full_name: user.full_name, role: user.role, avatar_url: user.avatar_url };
        req.session.user = sessionUser;
        res.json({ user: sessionUser });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    try {
        const hash = hashPassword(password);
        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, role, avatar_url',
            [email.toLowerCase(), hash, fullName || null]
        );
        res.json({ user: rows[0] });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'An account with this email already exists' });
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});

app.post('/api/ai/chat', async (req, res) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: 'AI service not configured. Please add DEEPSEEK_API_KEY to secrets.' });
    }
    const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000 } = req.body;
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                    ...messages,
                ],
                stream: false,
                temperature,
                max_tokens: maxTokens,
            }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: err.error?.message || `AI API error ${response.status}` });
        }
        const data = await response.json();
        res.json({ content: data.choices?.[0]?.message?.content || '' });
    } catch (err) {
        console.error('AI proxy error:', err);
        res.status(500).json({ error: 'Failed to reach AI service' });
    }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* ── Neighborhood / Community API routes ─────────────────────── */

app.get('/api/emergency-requests', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM emergency_requests WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 10',
            [req.session.user.id]
        );
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/emergency-requests', requireAuth, async (req, res) => {
    const { category, urgency, description, lat, lng, zone_id } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO emergency_requests (customer_id, zone_id, category, urgency, description, lat, lng) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [req.session.user.id, zone_id || null, category, urgency || 'immediate', description, lat || null, lng || null]
        );
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/emergency-requests/:id', requireAuth, async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query(
            'UPDATE emergency_requests SET status=$1, updated_at=NOW() WHERE id=$2 AND customer_id=$3',
            [status, req.params.id, req.session.user.id]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/group-buys', async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM group_buys WHERE status IN ('open','locked') ORDER BY created_at DESC LIMIT 30"
        );
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/group-buy-participants/my', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT group_buy_id FROM group_buy_participants WHERE user_id = $1',
            [req.session.user.id]
        );
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/group-buys', requireAuth, async (req, res) => {
    const { zone_id, service_category, description, target_participants, discount_percent, expires_at } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO group_buys (zone_id, service_category, description, initiator_id, target_participants, discount_percent, expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [zone_id || null, service_category, description || null, req.session.user.id, target_participants || 5, discount_percent || 10, expires_at || null]
        );
        await pool.query('INSERT INTO group_buy_participants (group_buy_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [rows[0].id, req.session.user.id]);
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/group-buys/:id/join', requireAuth, async (req, res) => {
    try {
        await pool.query('INSERT INTO group_buy_participants (group_buy_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.params.id, req.session.user.id]);
        const { rows } = await pool.query('SELECT current_participants FROM group_buys WHERE id=$1', [req.params.id]);
        const newCount = (rows[0]?.current_participants || 0) + 1;
        await pool.query('UPDATE group_buys SET current_participants=$1, updated_at=NOW() WHERE id=$2', [newCount, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-swaps', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM skill_swaps WHERE status='open' ORDER BY created_at DESC LIMIT 30");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skill-swaps/my', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM skill_swaps WHERE offerer_id=$1 ORDER BY created_at DESC LIMIT 20', [req.session.user.id]);
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/time-credits/balance', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT COALESCE(SUM(amount),0) AS balance FROM time_credits_ledger WHERE user_id=$1', [req.session.user.id]);
        res.json({ balance: parseInt(rows[0]?.balance || 0) });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/skill-swaps', requireAuth, async (req, res) => {
    const { zone_id, offering, seeking, time_credits_offered } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO skill_swaps (zone_id, offerer_id, offering, seeking, time_credits_offered) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [zone_id || null, req.session.user.id, offering, seeking, time_credits_offered || 1]
        );
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/skill-swaps/:id/match', requireAuth, async (req, res) => {
    try {
        await pool.query(
            "UPDATE skill_swaps SET status='matched', matched_with_user_id=$1, updated_at=NOW() WHERE id=$2",
            [req.session.user.id, req.params.id]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/disputes', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM disputes WHERE raised_by=$1 OR against_id=$1 OR status IN ('open','voting') ORDER BY created_at DESC",
            [req.session.user.id]
        );
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/jury-assignments/my', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT dispute_id, vote FROM jury_assignments WHERE juror_user_id=$1', [req.session.user.id]);
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/jury-assignments', requireAuth, async (req, res) => {
    const { dispute_id, vote } = req.body;
    try {
        await pool.query(
            'INSERT INTO jury_assignments (dispute_id, juror_user_id, vote, voted_at) VALUES ($1,$2,$3,NOW()) ON CONFLICT (dispute_id, juror_user_id) DO UPDATE SET vote=$3, voted_at=NOW()',
            [dispute_id, req.session.user.id, vote]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/events', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM events ORDER BY date ASC LIMIT 60");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', requireAuth, async (req, res) => {
    const { title, description, category, venue_name, venue_type, address, date, start_time, end_time, organizer_name, ticket_price, is_free, total_tickets, bundle_services, cover_image_url } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO events (title, description, category, venue_name, venue_type, address, date, start_time, end_time, organizer_name, organizer_id, ticket_price, is_free, total_tickets, bundle_services, cover_image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
            [title, description || null, category || 'other', venue_name || null, venue_type || null, address || null, date || null, start_time || null, end_time || null, organizer_name || null, req.session.user.id, ticket_price || 0, is_free !== false, total_tickets || 100, JSON.stringify(bundle_services || []), cover_image_url || null]
        );
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/event-tickets/my', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM event_tickets WHERE buyer_email=$1 ORDER BY created_at DESC", [req.session.user.email]);
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/event-tickets', requireAuth, async (req, res) => {
    const { event_id, event_title, quantity, unit_price } = req.body;
    const total = (quantity || 1) * (unit_price || 0);
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    try {
        const { rows } = await pool.query(
            'INSERT INTO event_tickets (event_id, event_title, buyer_email, buyer_name, quantity, unit_price, total_amount, ticket_code) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [event_id, event_title || null, req.session.user.email, req.session.user.full_name || null, quantity || 1, unit_price || 0, total, code]
        );
        await pool.query('UPDATE events SET tickets_sold = COALESCE(tickets_sold,0) + $1 WHERE id=$2', [quantity || 1, event_id]);
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/community-posts', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM community_posts ORDER BY created_date DESC LIMIT 50");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/community-posts', requireAuth, async (req, res) => {
    const { type, title, body, image_url } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO community_posts (type, title, body, author_name, author_email, author_id, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [type || 'post', title || null, body, req.session.user.full_name || req.session.user.email, req.session.user.email, req.session.user.id, image_url || null]
        );
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/community-posts/:id/vote', requireAuth, async (req, res) => {
    const { delta } = req.body;
    try {
        await pool.query('UPDATE community_posts SET upvotes = GREATEST(0, COALESCE(upvotes,0) + $1) WHERE id=$2', [delta || 1, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/post-comments/:postId', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM post_comments WHERE post_id=$1 ORDER BY created_at ASC', [req.params.postId]);
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/post-comments', requireAuth, async (req, res) => {
    const { post_id, body } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO post_comments (post_id, author_email, author_name, body) VALUES ($1,$2,$3,$4) RETURNING *',
            [post_id, req.session.user.email, req.session.user.full_name || req.session.user.email, body]
        );
        await pool.query('UPDATE community_posts SET reply_count = COALESCE(reply_count,0) + 1 WHERE id=$1', [post_id]);
        res.json({ data: rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/neighborhood-polls', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM neighborhood_polls ORDER BY created_at DESC LIMIT 20");
        res.json({ data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/neighborhood-polls/:id/vote', requireAuth, async (req, res) => {
    const { options } = req.body;
    try {
        await pool.query('UPDATE neighborhood_polls SET options=$1 WHERE id=$2', [JSON.stringify(options), req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

if (isProd) {
    const distPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    initDb().then(() => {
        app.listen(PORT, '0.0.0.0', () => console.log(`Truvornex running on port ${PORT}`));
    });
} else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
    initDb().then(() => {
        app.listen(PORT, '0.0.0.0', () => console.log(`Truvornex dev server running on port ${PORT}`));
    });
}
