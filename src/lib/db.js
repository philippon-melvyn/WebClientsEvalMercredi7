import { Database } from "bun:sqlite";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";  
const dbPath = resolve(
  process.env.SQLITE_DB_PATH || "./data/clients.db"
);
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath, { create: true });

export function getClients() {
  return db.query(`
    SELECT
      id,
      name,
      email,
      address,
      latitude,
      longitude
    FROM clients
    ORDER BY name
  `).all();
}

export default db;
