const router = require('express').Router();
const { getDb } = require('../db/database');
const { authRequired } = require('../middleware/auth');

// POST /api/likes/:recipeId — like
router.post('/:recipeId', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const recipe = db.prepare('SELECT id FROM recipes WHERE id=?').get(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    try {
      db.prepare('INSERT INTO recipe_likes (user_id, recipe_id) VALUES (?,?)').run(req.user.id, req.params.recipeId);
      db.prepare('UPDATE recipes SET like_count = like_count + 1 WHERE id=?').run(req.params.recipeId);
    } catch (e) {
      if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Already liked' });
      throw e;
    }
    const updated = db.prepare('SELECT like_count FROM recipes WHERE id=?').get(req.params.recipeId);
    res.json({ liked: true, like_count: updated.like_count });
  } catch (err) { next(err); }
});

// DELETE /api/likes/:recipeId — unlike
router.delete('/:recipeId', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const info = db.prepare('DELETE FROM recipe_likes WHERE user_id=? AND recipe_id=?').run(req.user.id, req.params.recipeId);
    if (info.changes > 0) {
      db.prepare('UPDATE recipes SET like_count = MAX(0, like_count - 1) WHERE id=?').run(req.params.recipeId);
    }
    const updated = db.prepare('SELECT like_count FROM recipes WHERE id=?').get(req.params.recipeId);
    res.json({ liked: false, like_count: updated?.like_count ?? 0 });
  } catch (err) { next(err); }
});

// GET /api/likes/:recipeId/status
router.get('/:recipeId/status', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT 1 FROM recipe_likes WHERE user_id=? AND recipe_id=?').get(req.user.id, req.params.recipeId);
    res.json({ liked: Boolean(row) });
  } catch (err) { next(err); }
});

module.exports = router;
