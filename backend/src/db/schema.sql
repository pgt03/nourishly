PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER  PRIMARY KEY AUTOINCREMENT,
  email      TEXT     UNIQUE NOT NULL,
  username   TEXT     UNIQUE NOT NULL,
  password   TEXT     NOT NULL,
  avatar_url TEXT,
  bio        TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          TEXT    NOT NULL,
  description    TEXT,
  photo_url      TEXT,
  ingredients    TEXT    NOT NULL DEFAULT '[]',
  steps          TEXT    NOT NULL DEFAULT '[]',
  tags           TEXT             DEFAULT '[]',
  cuisine_type   TEXT,
  cook_time      INTEGER,
  prep_time      INTEGER,
  servings       INTEGER,
  difficulty     TEXT CHECK(difficulty IN ('Easy','Medium','Hard')),
  is_budget      INTEGER NOT NULL DEFAULT 0,
  is_kid_friendly INTEGER NOT NULL DEFAULT 0,
  is_fifteen_min  INTEGER NOT NULL DEFAULT 0,
  save_count     INTEGER NOT NULL DEFAULT 0,
  like_count     INTEGER NOT NULL DEFAULT 0,
  comment_count  INTEGER NOT NULL DEFAULT 0,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_recipes (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS recipe_likes (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  content   TEXT    NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recipes_created  ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_user     ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_title    ON recipes(title);
CREATE INDEX IF NOT EXISTS idx_saved_user       ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_recipe     ON recipe_likes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_comments_recipe  ON comments(recipe_id);
