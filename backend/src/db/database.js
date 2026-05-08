const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../nourishly.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA journal_mode=WAL');
    db.exec('PRAGMA foreign_keys=ON');
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    // Execute each statement individually (node:sqlite exec doesn't support multi-statement in one call)
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
