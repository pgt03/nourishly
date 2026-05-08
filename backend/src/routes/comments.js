const router = require('express').Router();
const { getDb } = require('../db/database');
const { authRequired, authOptional } = require('../middleware/auth');

// GET /api/comments/recipe/:recipeId
router.get('/recipe/:recipeId', authOptional, (req, res, next) => {
  try {
    const db = getDb();
    const comments = db.prepare(`
      SELECT c.*, u.username, u.avatar_url
      FROM comments c JOIN users u ON c.user_id=u.id
      WHERE c.recipe_id=?
      ORDER BY c.created_at ASC
    `).all(req.params.recipeId);
    res.json({ comments });
  } catch (err) { next(err); }
});

// POST /api/comments/recipe/:recipeId
router.post('/recipe/:recipeId', authRequired, (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Comment cannot be empty' });
    const db = getDb();
    const recipe = db.prepare('SELECT id FROM recipes WHERE id=?').get(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    const info = db.prepare('INSERT INTO comments (user_id, recipe_id, content) VALUES (?,?,?)').run(req.user.id, req.params.recipeId, content.trim());
    db.prepare('UPDATE recipes SET comment_count = comment_count + 1 WHERE id=?').run(req.params.recipeId);
    const comment = db.prepare(`
      SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id=u.id WHERE c.id=?
    `).get(info.lastInsertRowid);
    res.status(201).json(comment);
  } catch (err) { next(err); }
});

// DELETE /api/comments/:commentId
router.delete('/:commentId', authRequired, (req, res, next) => {
  try {
    const db = getDb();
    const comment = db.prepare('SELECT * FROM comments WHERE id=?').get(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user_id !== req.user.id) return res.status(403).json({ error: 'Not your comment' });
    db.prepare('DELETE FROM comments WHERE id=?').run(req.params.commentId);
    db.prepare('UPDATE recipes SET comment_count = MAX(0, comment_count - 1) WHERE id=?').run(comment.recipe_id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
