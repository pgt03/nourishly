const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/database');
const { authRequired } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) return res.status(400).json({ error: 'email, username and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (username.length < 2) return res.status(400).json({ error: 'Username must be at least 2 characters' });

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email=? OR username=?').get(email.toLowerCase(), username);
    if (existing) return res.status(409).json({ error: 'Email or username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (email, username, password) VALUES (?,?,?)').run(email.toLowerCase(), username, hash);
    const user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE id=?').get(info.lastInsertRowid);

    // Fire n8n webhook (non-blocking)
    const webhookBase = process.env.N8N_WEBHOOK_BASE;
    if (webhookBase) {
      fetch(`${webhookBase}/user-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, username: user.username, email: user.email })
      }).catch(() => {});
    }

    res.status(201).json({ token: signToken(user), user });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email=?').get(email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE id=?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/auth/me — update profile
router.put('/me', authRequired, (req, res, next) => {
  try {
    const { username, bio } = req.body;
    const db = getDb();
    if (username) {
      const taken = db.prepare('SELECT id FROM users WHERE username=? AND id!=?').get(username, req.user.id);
      if (taken) return res.status(409).json({ error: 'Username already taken' });
      db.prepare('UPDATE users SET username=? WHERE id=?').run(username, req.user.id);
    }
    if (bio !== undefined) db.prepare('UPDATE users SET bio=? WHERE id=?').run(bio, req.user.id);
    const user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE id=?').get(req.user.id);
    res.json(user);
  } catch (err) { next(err); }
});

// POST /api/auth/me/avatar
router.post('/me/avatar', authRequired, (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    try {
      const db = getDb();
      const oldUser = db.prepare('SELECT avatar_url FROM users WHERE id=?').get(req.user.id);
      if (oldUser.avatar_url && oldUser.avatar_url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../', oldUser.avatar_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      db.prepare('UPDATE users SET avatar_url=? WHERE id=?').run(avatarUrl, req.user.id);
      const user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE id=?').get(req.user.id);
      res.json(user);
    } catch (e) { next(e); }
  });
});

// POST /api/auth/google — verify Google ID token, create/login user
router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'Google credential required' });

    // Verify token with Google
    const tokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error_description) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && tokenData.aud !== clientId) {
      return res.status(401).json({ error: 'Token audience mismatch' });
    }

    const { sub: googleId, email, name, picture } = tokenData;
    if (!email) return res.status(400).json({ error: 'Could not retrieve email from Google' });

    const db = getDb();

    // Find existing user by google_id or email
    let user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE google_id=?').get(googleId);
    if (!user) user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE email=?').get(email.toLowerCase());

    if (user) {
      // Link google_id if not already linked
      db.prepare('UPDATE users SET google_id=? WHERE id=?').run(googleId, user.id);
    } else {
      // New user — derive username from name or email
      let base = (name || email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || 'user';
      let username = base;
      let suffix = 1;
      while (db.prepare('SELECT id FROM users WHERE username=?').get(username)) {
        username = `${base}${suffix++}`;
      }
      const info = db.prepare(
        'INSERT INTO users (email, username, password, google_id, avatar_url) VALUES (?,?,?,?,?)'
      ).run(email.toLowerCase(), username, '', googleId, picture || null);
      user = db.prepare('SELECT id, email, username, avatar_url, bio, created_at FROM users WHERE id=?').get(info.lastInsertRowid);

      // Welcome webhook (non-blocking)
      const webhookBase = process.env.N8N_WEBHOOK_BASE;
      if (webhookBase) {
        fetch(`${webhookBase}/user-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, username: user.username, email: user.email })
        }).catch(() => {});
      }
    }

    res.json({ token: signToken(user), user });
  } catch (err) { next(err); }
});

module.exports = router;
