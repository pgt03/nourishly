const router = require('express').Router();
const { getDb } = require('../db/database');
const { authRequired } = require('../middleware/auth');

function parseRecipe(row) {
  if (!row) return null;
  return {
    ...row,
    ingredients: JSON.parse(row.ingredients || '[]'),
    steps: JSON.parse(row.steps || '[]'),
    tags: JSON.parse(row.tags || '[]'),
    is_budget: Boolean(row.is_budget),
    is_kid_friendly: Boolean(row.is_kid_friendly),
    is_fifteen_min: Boolean(row.is_fifteen_min),
    is_saved: true
  };
}

// GET /api/saves — my saved recipes
router.get('/', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT r.*, u.username, u.avatar_url, s.saved_at
      FROM saved_recipes s
      JOIN recipes r ON s.recipe_id = r.id
      JOIN users u ON r.user_id = u.id
      WHERE s.user_id = ?
      ORDER BY s.saved_at DESC
    `).all(req.user.id);
    res.json({ recipes: rows.map(parseRecipe) });
  } catch (err) { next(err); }
});

// POST /api/saves/:recipeId — save
router.post('/:recipeId', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const recipe = db.prepare('SELECT id FROM recipes WHERE id=?').get(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    try {
      db.prepare('INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?,?)').run(req.user.id, req.params.recipeId);
      db.prepare('UPDATE recipes SET save_count = save_count + 1 WHERE id=?').run(req.params.recipeId);
    } catch (e) {
      if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Already saved' });
      throw e;
    }
    const updated = db.prepare('SELECT save_count FROM recipes WHERE id=?').get(req.params.recipeId);
    res.json({ saved: true, save_count: updated.save_count });
  } catch (err) { next(err); }
});

// DELETE /api/saves/:recipeId — unsave
router.delete('/:recipeId', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const info = db.prepare('DELETE FROM saved_recipes WHERE user_id=? AND recipe_id=?').run(req.user.id, req.params.recipeId);
    if (info.changes > 0) {
      db.prepare('UPDATE recipes SET save_count = MAX(0, save_count - 1) WHERE id=?').run(req.params.recipeId);
    }
    const updated = db.prepare('SELECT save_count FROM recipes WHERE id=?').get(req.params.recipeId);
    res.json({ saved: false, save_count: updated?.save_count ?? 0 });
  } catch (err) { next(err); }
});

// GET /api/saves/:recipeId/status
router.get('/:recipeId/status', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT 1 FROM saved_recipes WHERE user_id=? AND recipe_id=?').get(req.user.id, req.params.recipeId);
    res.json({ saved: Boolean(row) });
  } catch (err) { next(err); }
});

module.exports = router;
