# AstroJS SSR + SQLite + Leaflet + Google OAuth

Application d'exemple en **AstroJS SSR** avec :

- Astro en `output: "server"`
- adaptateur `@astrojs/node` en mode standalone
- carte Leaflet
- clients chargés côté serveur depuis SQLite
- Bun comme gestionnaire de paquets et lanceur des scripts

# A faire :
- Télécharger le projet WebClients
- Créez la BDD sqlite : ./data/clients.db (0.5pt)
- Ajoutez la table clients avec les champs : (1pt)
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    address TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
- Ajoutez 4 enregistrements à la table clients (1pt)
- Testez le code localement 
- Préparer un fichier .gitignore typique d'astro auquel ajouter ce qu'il faut (variable BDD) 
- Versionnez le code dans GitHub en faisant  (2pts) 
- Recharger le code sur Votre VPS depuis GitHub (1pts)
- Transférez la BDD locale vers le VPS (1pts)
- Préparer le fichier .env coté VPS (0.5pt)
- Certifiez le site clients.<votredomaine>.<tld> (2pts)
- Configurez Apache pour l'accès à l'application avec servername : clients.<votredomaine>.<tld> et numéro de port : 3344  (2pts)
- Générez la version build du code sur le VPS (0.5pts)
- Installer l'application en tant que service sur le VPS (4pts)
- Lancer l'application (0.5pts)
- Tester l'application 
- Concevoir une action GitHub CI/CD pour le déploiement automatique de l'application (4pts)

