const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../nourishly.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
    for (const stmt of statements) {
      try { db.exec(stmt + ';'); } catch (e) {
        if (!e.message.includes('already exists')) throw e;
      }
    }

    // Column migrations — safe to run on every startup
    const migrations = [
      'ALTER TABLE users ADD COLUMN google_id TEXT',
    ];
    for (const m of migrations) {
      try { db.exec(m); } catch (e) {
        if (!e.message.includes('duplicate column') && !e.message.includes('already exists')) throw e;
      }
    }
  }
  return db;
}

module.exports = { getDb };
