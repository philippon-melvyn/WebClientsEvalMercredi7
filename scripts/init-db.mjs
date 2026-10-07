import Database from "bun:sqlite"
import { mkdirSync } from "node:fs";

mkdirSync("./data", { recursive: true });

const db = new Database("./data/clients.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
  );
`);

console.log("Base SQLite initialisée : data/clients.db");
db.close();