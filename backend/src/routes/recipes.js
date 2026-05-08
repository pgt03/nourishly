const router = require('express').Router();
const { getDb } = require('../db/database');
const { authRequired, authOptional } = require('../middleware/auth');
const { uploadRecipePhoto } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

function parseRecipe(row) {
  if (!row) return null;
  return {
    ...row,
    ingredients: JSON.parse(row.ingredients || '[]'),
    steps: JSON.parse(row.steps || '[]'),
    tags: JSON.parse(row.tags || '[]'),
    is_budget: Boolean(row.is_budget),
    is_kid_friendly: Boolean(row.is_kid_friendly),
    is_fifteen_min: Boolean(row.is_fifteen_min)
  };
}

// GET /api/recipes — public feed with search and filters
router.get('/', authOptional, (req, res, next) => {
  try {
    const db = getDb();
    const { search, tag, difficulty, quick, budget, kid_friendly, cuisine, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = [];
    let params = [];

    if (search) {
      where.push(`(r.title LIKE ? OR r.ingredients LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }
    if (tag) { where.push(`r.tags LIKE ?`); params.push(`%${tag}%`); }
    if (difficulty) { where.push(`r.difficulty = ?`); params.push(difficulty); }
    if (quick === '1') { where.push(`r.is_fifteen_min = 1`); }
    if (budget === '1') { where.push(`r.is_budget = 1`); }
    if (kid_friendly === '1') { where.push(`r.is_kid_friendly = 1`); }
    if (cuisine) { where.push(`r.cuisine_type LIKE ?`); params.push(`%${cuisine}%`); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const totalRow = db.prepare(`SELECT COUNT(*) as total FROM recipes r ${whereClause}`).get(...params);
    const rows = db.prepare(`
      SELECT r.*, u.username, u.avatar_url
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const userId = req.user?.id;
    const recipes = rows.map(row => {
      const r = parseRecipe(row);
      if (userId) {
        r.is_saved = Boolean(db.prepare('SELECT 1 FROM saved_recipes WHERE user_id=? AND recipe_id=?').get(userId, r.id));
        r.is_liked = Boolean(db.prepare('SELECT 1 FROM recipe_likes WHERE user_id=? AND recipe_id=?').get(userId, r.id));
      } else {
        r.is_saved = false;
        r.is_liked = false;
      }
      return r;
    });

    res.json({ recipes, total: totalRow.total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
});

// GET /api/recipes/user/:userId — recipes by a user
router.get('/user/:userId', authOptional, (req, res, next) => {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT r.*, u.username, u.avatar_url
      FROM recipes r JOIN users u ON r.user_id=u.id
      WHERE r.user_id=?
      ORDER BY r.created_at DESC
    `).all(req.params.userId);
    const userId = req.user?.id;
    const recipes = rows.map(row => {
      const r = parseRecipe(row);
      r.is_saved = userId ? Boolean(db.prepare('SELECT 1 FROM saved_recipes WHERE user_id=? AND recipe_id=?').get(userId, r.id)) : false;
      r.is_liked = userId ? Boolean(db.prepare('SELECT 1 FROM recipe_likes WHERE user_id=? AND recipe_id=?').get(userId, r.id)) : false;
      return r;
    });
    res.json({ recipes });
  } catch (err) { next(err); }
});

// GET /api/recipes/:id
router.get('/:id', authOptional, (req, res, next) => {
  try {
    const db = getDb();
    const row = db.prepare(`
      SELECT r.*, u.username, u.avatar_url
      FROM recipes r JOIN users u ON r.user_id=u.id
      WHERE r.id=?
    `).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Recipe not found' });
    const r = parseRecipe(row);
    const userId = req.user?.id;
    r.is_saved = userId ? Boolean(db.prepare('SELECT 1 FROM saved_recipes WHERE user_id=? AND recipe_id=?').get(userId, r.id)) : false;
    r.is_liked = userId ? Boolean(db.prepare('SELECT 1 FROM recipe_likes WHERE user_id=? AND recipe_id=?').get(userId, r.id)) : false;
    res.json(r);
  } catch (err) { next(err); }
});

// POST /api/recipes — create recipe
router.post('/', authRequired, (req, res, next) => {
  uploadRecipePhoto(req, res, (err) => {
    if (err) return next(err);
    try {
      const db = getDb();
      const {
        title, description, ingredients, steps, tags,
        cuisine_type, cook_time, prep_time, servings, difficulty,
        is_budget, is_kid_friendly, is_fifteen_min
      } = req.body;

      if (!title) return res.status(400).json({ error: 'Title is required' });
      if (!ingredients) return res.status(400).json({ error: 'Ingredients are required' });
      if (!steps) return res.status(400).json({ error: 'Steps are required' });

      const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const parsedIngredients = typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients);
      const parsedSteps = typeof steps === 'string' ? steps : JSON.stringify(steps);
      const parsedTags = tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : '[]';

      const info = db.prepare(`
        INSERT INTO recipes
          (user_id, title, description, photo_url, ingredients, steps, tags,
           cuisine_type, cook_time, prep_time, servings, difficulty,
           is_budget, is_kid_friendly, is_fifteen_min)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        req.user.id, title, description || null, photoUrl,
        parsedIngredients, parsedSteps, parsedTags,
        cuisine_type || null, cook_time ? parseInt(cook_time) : null,
        prep_time ? parseInt(prep_time) : null,
        servings ? parseInt(servings) : null, difficulty || null,
        is_budget === 'true' || is_budget === true ? 1 : 0,
        is_kid_friendly === 'true' || is_kid_friendly === true ? 1 : 0,
        is_fifteen_min === 'true' || is_fifteen_min === true ? 1 : 0
      );

      const row = db.prepare(`
        SELECT r.*, u.username, u.avatar_url FROM recipes r JOIN users u ON r.user_id=u.id WHERE r.id=?
      `).get(info.lastInsertRowid);
      const recipe = parseRecipe(row);

      // Fire n8n webhook (non-blocking)
      const webhookBase = process.env.N8N_WEBHOOK_BASE;
      if (webhookBase) {
        fetch(`${webhookBase}/recipe-posted`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId: recipe.id, title: recipe.title, userId: req.user.id, username: recipe.username })
        }).catch(() => {});
      }

      res.status(201).json(recipe);
    } catch (e) { next(e); }
  });
});

// PUT /api/recipes/:id
router.put('/:id', authRequired, (req, res, next) => {
  uploadRecipePhoto(req, res, (err) => {
    if (err) return next(err);
    try {
      const db = getDb();
      const recipe = db.prepare('SELECT * FROM recipes WHERE id=?').get(req.params.id);
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
      if (recipe.user_id !== req.user.id) return res.status(403).json({ error: 'Not your recipe' });

      const {
        title, description, ingredients, steps, tags,
        cuisine_type, cook_time, prep_time, servings, difficulty,
        is_budget, is_kid_friendly, is_fifteen_min
      } = req.body;

      let photoUrl = recipe.photo_url;
      if (req.file) {
        if (photoUrl && photoUrl.startsWith('/uploads/')) {
          const oldPath = path.join(__dirname, '../../', photoUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        photoUrl = `/uploads/${req.file.filename}`;
      }

      db.prepare(`
        UPDATE recipes SET
          title=?, description=?, photo_url=?, ingredients=?, steps=?, tags=?,
          cuisine_type=?, cook_time=?, prep_time=?, servings=?, difficulty=?,
          is_budget=?, is_kid_friendly=?, is_fifteen_min=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=?
      `).run(
        title || recipe.title,
        description !== undefined ? description : recipe.description,
        photoUrl,
        ingredients ? (typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients)) : recipe.ingredients,
        steps ? (typeof steps === 'string' ? steps : JSON.stringify(steps)) : recipe.steps,
        tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : recipe.tags,
        cuisine_type !== undefined ? cuisine_type : recipe.cuisine_type,
        cook_time ? parseInt(cook_time) : recipe.cook_time,
        prep_time ? parseInt(prep_time) : recipe.prep_time,
        servings ? parseInt(servings) : recipe.servings,
        difficulty !== undefined ? difficulty : recipe.difficulty,
        is_budget !== undefined ? (is_budget === 'true' || is_budget === true ? 1 : 0) : recipe.is_budget,
        is_kid_friendly !== undefined ? (is_kid_friendly === 'true' || is_kid_friendly === true ? 1 : 0) : recipe.is_kid_friendly,
        is_fifteen_min !== undefined ? (is_fifteen_min === 'true' || is_fifteen_min === true ? 1 : 0) : recipe.is_fifteen_min,
        req.params.id
      );

      const row = db.prepare(`SELECT r.*, u.username, u.avatar_url FROM recipes r JOIN users u ON r.user_id=u.id WHERE r.id=?`).get(req.params.id);
      res.json(parseRecipe(row));
    } catch (e) { next(e); }
  });
});

// DELETE /api/recipes/:id
router.delete('/:id', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const recipe = db.prepare('SELECT * FROM recipes WHERE id=?').get(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.user_id !== req.user.id) return res.status(403).json({ error: 'Not your recipe' });
    if (recipe.photo_url && recipe.photo_url.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../../', recipe.photo_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    db.prepare('DELETE FROM recipes WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
