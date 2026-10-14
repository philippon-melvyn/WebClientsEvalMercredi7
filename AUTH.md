# Connexion avec Better Auth

Le tableau de bord `/` est protégé. `/login` permet de créer un compte ou de se
connecter avec un email et un mot de passe (8 caractères minimum). Le bouton
Déconnexion ferme la session. Les autres routes API répondent 401 sans session.

## Installation locale

1. `bun install`
2. Copier `.env.example` vers `.env` si ce fichier n'existe pas.
3. Générer un secret avec `bun -e "console.log(Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64'))"`
   et le mettre dans `BETTER_AUTH_SECRET` dans `.env`.
4. `bun run db:init` si la table clients n'existe pas encore.
5. `bun run db:auth` pour créer ou mettre à jour les tables Better Auth.
6. `bun run --bun dev` puis ouvrir `http://localhost:4321/login`.

Les tables `user`, `session`, `account` et `verification` sont stockées dans la
même base que les clients : `SQLITE_DB_PATH`, par défaut `./data/clients.db`.
La migration conserve les données existantes. `bun run db:seed` remplace les
clients par les données de démonstration ; ce n'est pas une migration d'authentification.

## VPS

Dans le `.env` du VPS, définir un secret aléatoire propre au serveur et
`BETTER_AUTH_URL=https://clients.votre-domaine.fr` avec l'URL publique réelle.
Ne pas versionner `.env`. Le service doit démarrer depuis le dossier du projet
avec Bun (`bun ./dist/server/entry.mjs`) pour charger `.env` et utiliser SQLite.
Le workflow lance `bun run db:auth` avant le build et le redémarrage du service.
Pour un déploiement manuel : `bun run db:auth`, `bun run --bun build`, puis
redémarrer le service. Conserver la base SQLite entre les déploiements.

L'inscription est ouverte : tout compte créé peut consulter le tableau de bord.

## Connexion Google

1. Dans https://console.cloud.google.com/, créer un projet et configurer Google
   Auth Platform / l'écran de consentement OAuth : audience External. En mode
   Testing, ajouter votre adresse dans les utilisateurs de test.
2. Créer un client OAuth de type Web application avec ces valeurs exactes :
   - Origine JavaScript : `http://localhost:4321`
   - URI de redirection : `http://localhost:4321/api/auth/callback/google`
3. Ajouter le Client ID et le Client secret dans le `.env` local :

   ```env
   GOOGLE_CLIENT_ID=votre-client-id
   GOOGLE_CLIENT_SECRET=votre-client-secret
   ```

4. Redémarrer `bun run dev`. Le bouton « Continuer avec Google » apparaît sur
   `/login` et ramène au tableau de bord `/` après la connexion. Il fonctionne
   sans remplir les champs email et mot de passe du formulaire.

Les deux variables doivent être renseignées pour activer Google. Les secrets
sont lus uniquement côté serveur avec `process.env`, y compris après le build.
Ne pas les transmettre dans le chat, ni les ajouter au dépôt Git.

Sur le VPS, ajouter les identifiants dans son `.env`, utiliser l'URL HTTPS réelle
pour `BETTER_AUTH_URL`, et enregistrer dans Google l'origine publique ainsi que
`https://clients.votre-domaine.fr/api/auth/callback/google`. L'URI doit correspondre
exactement, sinon Google renvoie `redirect_uri_mismatch`.

## Connexion GitHub (optionnelle)

Dans https://github.com/settings/developers, créer une OAuth App :
- Homepage URL : `http://localhost:4321`
- Authorization callback URL : `http://localhost:4321/api/auth/callback/github`

Mettre `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` dans `.env`, puis redémarrer
le serveur. Le bouton « Continuer avec GitHub » apparaît quand les deux valeurs
sont présentes. Pour la production, créer une application OAuth distincte avec
l'URL publique et son callback HTTPS, et utiliser ses identifiants sur le VPS.

## Comparer les comptes dans DataGrip

### Si Google renvoie `account_not_linked`

Cet email correspond déjà à un compte local. La version installée de Better Auth
exige par défaut un email local vérifié pour une liaison automatique. Le projet
n'envoie pas de mails de vérification, donc une inscription par mot de passe
peut rencontrer ce blocage.

Se connecter avec le mot de passe existant, puis cliquer sur **Associer Google**
dans la section **Modes de connexion** du tableau de bord. Choisir le compte
Google utilisant la même adresse email. Après le retour au tableau de bord,
se déconnecter et tester **Continuer avec Google**. GitHub suit le même parcours.
Les boutons d'association disparaissent une fois le fournisseur lié.

Cette liaison explicite vérifie la session locale et l'identité OAuth. La
protection contre la liaison automatique d'un compte local non vérifié reste
active ; aucun utilisateur n'est marqué comme vérifié manuellement.

Après une inscription par mot de passe et une connexion Google, exécuter :

```sql
SELECT u.id, u.name, u.email, u.emailVerified,
       a.providerId, a.accountId,
       CASE WHEN a.password IS NULL THEN 'non' ELSE 'oui' END AS mot_de_passe_local
FROM user AS u
JOIN account AS a ON a.userId = u.id
ORDER BY u.email, a.providerId;
```

L'inscription par mot de passe utilise `providerId = 'credential'` et un mot de
passe local haché. Google utilise `providerId = 'google'`, GitHub `'github'`.
Le site ne reçoit jamais le mot de passe Google ou GitHub. Une même ligne `user`
peut avoir plusieurs comptes liés selon les règles de liaison de Better Auth.
Il n'est pas nécessaire d'ajouter de nouvelles tables pour ces fournisseurs.

La route `/api/generateColors` n'existe pas dans ce projet ; aucune limite
d'appels spécifique à cette route n'a donc été ajoutée.

Documentation :
- https://better-auth.com/docs/integrations/astro
- https://better-auth.com/docs/authentication/google
- https://better-auth.com/docs/authentication/github
