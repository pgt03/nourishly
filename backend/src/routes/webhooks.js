const router = require('express').Router();
const { getDb } = require('../db/database');

// These endpoints are called BY n8n workflows when n8n needs data,
// or triggered by the backend to kick off n8n flows.

// POST /api/webhooks/user-signup (called from auth.js, forwarded to n8n)
router.post('/user-signup', (req, res) => {
  // n8n calls this to confirm receipt and fetch user info
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = getDb();
  const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id=?').get(userId);
  res.json({ user: user || null });
});

// POST /api/webhooks/recipe-posted (called from recipes.js, forwarded to n8n)
router.post('/recipe-posted', (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ error: 'recipeId required' });
  const db = getDb();
  const recipe = db.prepare(`
    SELECT r.id, r.title, r.description, r.cuisine_type, r.cook_time, r.difficulty,
           u.username, u.email
    FROM recipes r JOIN users u ON r.user_id=u.id
    WHERE r.id=?
  `).get(recipeId);
  res.json({ recipe: recipe || null });
});

// POST /api/webhooks/recipe-saved (for n8n popularity tracking)
router.post('/recipe-saved', (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ error: 'recipeId required' });
  const db = getDb();
  const stats = db.prepare('SELECT id, title, save_count, like_count FROM recipes WHERE id=?').get(recipeId);
  res.json({ stats: stats || null });
});

// GET /api/webhooks/top-recipes — used by n8n daily digest workflow
router.get('/top-recipes', (req, res) => {
  try {
    const db = getDb();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recipes = db.prepare(`
      SELECT r.id, r.title, r.description, r.photo_url, r.save_count, r.like_count,
             u.username
      FROM recipes r JOIN users u ON r.user_id=u.id
      WHERE r.created_at >= ?
      ORDER BY r.save_count DESC, r.like_count DESC
      LIMIT 5
    `).all(since);
    res.json({ recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/webhooks/all-users — used by n8n digest for recipient list
router.get('/all-users', (req, res) => {
  try {
    const db = getDb();
    const users = db.prepare('SELECT id, username, email FROM users ORDER BY created_at DESC').all();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
