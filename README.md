# ComparaCourse

Application de comparaison de prix et de gestion de courses permettant de faciliter les achats hebdomadaires.

## Fonctionnalités

- 🔍 **Comparaison de prix** : Trouvez les meilleurs prix pour vos produits préférés dans différents magasins
- 📍 **Géolocalisation** : Visualisez les magasins à proximité sur une carte interactive
- 📊 **Historique des prix** : Suivez l'évolution des prix dans le temps
- 🔔 **Alertes de prix** : Recevez des notifications lors des baisses de prix
- 📝 **Listes de courses** : Créez et gérez vos listes de courses
- ⭐ **Produits favoris** : Gardez une trace de vos produits fréquemment achetés

## Structure du projet

```
├── client/ - Frontend React
│   ├── src/
│   │   ├── components/ - Composants réutilisables
│   │   ├── context/ - Contextes React pour la gestion d'état
│   │   ├── hooks/ - Hooks personnalisés
│   │   ├── lib/ - Utilitaires et fonctions d'aide
│   │   ├── pages/ - Pages de l'application
│   │   └── App.tsx - Point d'entrée de l'application
├── server/ - Backend Express
│   ├── database-storage.ts - Implémentation de l'interface de stockage avec PostgreSQL
│   ├── db.ts - Configuration de la connexion à la base de données
│   ├── index.ts - Point d'entrée du serveur
│   ├── routes.ts - Définition des routes API
│   └── storage.ts - Interface de stockage et implémentation mémoire
├── shared/ - Code partagé entre frontend et backend
│   └── schema.ts - Schéma de base de données avec Drizzle ORM
└── scripts/ - Scripts utilitaires
    └── migrate.ts - Script de migration et d'initialisation de la base de données
```

## Technologies utilisées

- **Frontend** : React, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL avec Drizzle ORM
- **Authentification** : Passport.js
- **API** : RESTful API

## Modèle de données

- **Users** : Utilisateurs de l'application
- **Stores** : Magasins avec localisation
- **Products** : Produits avec catégories
- **Prices** : Prix des produits dans différents magasins
- **ShoppingLists** : Listes de courses des utilisateurs
- **ShoppingListItems** : Éléments des listes de courses
- **FavoriteProducts** : Produits favoris des utilisateurs
- **PriceAlerts** : Alertes de prix pour les utilisateurs

## Installation et démarrage

### Prérequis

- Node.js v18+
- PostgreSQL

### Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-utilisateur/comparacourse.git
cd comparacourse
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez votre base de données dans un fichier `.env` :
```
DATABASE_URL=postgres://utilisateur:mot_de_passe@localhost:5432/comparacourse
```

4. Migrez la base de données :
```bash
npm run db:push
```

5. Démarrez l'application en mode développement :
```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:5000](http://localhost:5000).

## Déploiement

L'application peut être déployée sur n'importe quelle plateforme supportant Node.js et PostgreSQL.

### Builds de production

```bash
npm run build
npm start
```

## Fonctionnalités futures

- Intégration des achats en ligne
- Click & collect
- Livraison à domicile
- Application mobile

## Licence

MIT