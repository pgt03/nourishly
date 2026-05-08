const router = require('express').Router();
const { getDb } = require('../db/database');

// GET /api/users/:userId — public profile
router.get('/:userId', (req, res, next) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, username, avatar_url, bio, created_at FROM users WHERE id=?').get(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const count = db.prepare('SELECT COUNT(*) as total FROM recipes WHERE user_id=?').get(req.params.userId);
    res.json({ ...user, recipe_count: count.total });
  } catch (err) { next(err); }
});

module.exports = router;
