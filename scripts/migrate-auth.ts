import { getMigrations } from "better-auth/db/migration";
import { auth } from "../src/lib/auth";
import database from "../src/lib/db.js";

try {
  await auth.$context;
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  console.log("Tables Better Auth à jour dans la base SQLite des clients.");
} finally {
  database.close();
}
