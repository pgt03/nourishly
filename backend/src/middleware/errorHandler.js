function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max 5MB for photos, 2MB for avatars.' });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;
