# Guide d'installation de ComparaCourse

Ce guide vous aidera à installer et configurer l'application ComparaCourse sur votre environnement de développement ou de production.

## Prérequis

- Node.js (v18 ou plus récent)
- PostgreSQL (v14 ou plus récent)
- Git

## Étapes d'installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/comparacourse.git
cd comparacourse
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

Créez un fichier `.env` à la racine du projet avec les informations de connexion à votre base de données PostgreSQL :

```
DATABASE_URL=postgres://utilisateur:mot_de_passe@localhost:5432/comparacourse
```

#### Création manuelle de la base de données

Si vous préférez créer manuellement la base de données :

```bash
psql -U postgres
```

```sql
CREATE DATABASE comparacourse;
CREATE USER comparacourse_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE comparacourse TO comparacourse_user;
```

### 4. Migrer la base de données

```bash
npm run db:push
```

Cette commande va créer les tables nécessaires dans votre base de données.

### 5. Démarrer l'application en mode développement

```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:5000](http://localhost:5000).

## Structure de la base de données

L'application ComparaCourse utilise les tables suivantes :

- `users` : Informations des utilisateurs
- `stores` : Magasins et leur emplacement
- `products` : Produits disponibles
- `prices` : Prix des produits dans différents magasins
- `shopping_lists` : Listes de courses des utilisateurs
- `shopping_list_items` : Éléments des listes de courses
- `favorite_products` : Produits favoris des utilisateurs
- `price_alerts` : Alertes de changement de prix

## Configuration avancée

### Adapter l'environnement de production

Pour un déploiement en production, vous devrez ajuster les variables d'environnement appropriées :

```
NODE_ENV=production
DATABASE_URL=postgres://utilisateur:mot_de_passe@hote:5432/comparacourse
PORT=8080
```

### Construire l'application pour la production

```bash
npm run build
npm start
```

## Dépannage

### Erreurs de connexion à la base de données

- Vérifiez que PostgreSQL est bien en cours d'exécution
- Assurez-vous que les identifiants dans `DATABASE_URL` sont corrects
- Vérifiez que l'utilisateur a les droits suffisants sur la base de données

### Erreurs lors de la migration

Si vous rencontrez des erreurs lors de la migration, vous pouvez essayer de recréer manuellement les tables en exécutant le script SQL généré dans le dossier `migrations`.

## Ressources supplémentaires

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Documentation Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Documentation Node.js](https://nodejs.org/en/docs/)
- [Documentation React](https://reactjs.org/docs/getting-started.html)