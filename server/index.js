import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;
const isProd = process.env.NODE_ENV === 'production';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
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

app.get('/api/auth/user', (req, res) => {
    if (req.session?.user) {
        return res.json({ user: req.session.user });
    }
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
