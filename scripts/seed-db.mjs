import Database from "bun:sqlite";

const db = new Database("./data/clients.db");

db.exec(`
  DELETE FROM clients;

  INSERT INTO clients (name, email, address, latitude, longitude) VALUES
    ('Client Besançon', 'besancon@example.com', 'Besançon', 47.237829, 6.024053),
    ('Client Montbéliard', 'montbeliard@example.com', 'Montbéliard', 47.510238, 6.798819),
    ('Client Belfort', 'belfort@example.com', 'Belfort', 47.639674, 6.863849),
    ('Client Dijon', 'dijon@example.com', 'Dijon', 47.322047, 5.041480),
    ('Client Lyon', 'lyon@example.com', 'Lyon', 45.764043, 4.835659);
`);

console.log("Données de démonstration insérées.");
db.close();