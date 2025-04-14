# Contribuer à ComparaCourse

Merci de votre intérêt pour contribuer à ComparaCourse ! Ce document vous guide sur comment participer au projet.

## Processus de contribution

1. **Fork** le dépôt sur GitHub
2. **Clonez** votre fork sur votre machine locale
3. **Créez une branche** pour votre fonctionnalité ou correctif
4. **Développez** votre fonctionnalité ou correctif
5. **Testez** votre code
6. **Poussez** vos changements sur votre fork
7. Soumettez une **Pull Request** vers le dépôt principal

## Conventions de code

- Utilisez les conventions de nommage camelCase pour les variables et fonctions
- Documentez vos fonctions avec des commentaires JSDoc
- Écrivez des messages de commit clairs et descriptifs
- Suivez les principes de conception responsive pour le frontend

## Structure du projet

- `/client` : Code frontend (React + Tailwind CSS)
- `/server` : Code backend (Express + API routes)
- `/shared` : Code partagé entre frontend et backend (schéma de base de données)
- `/scripts` : Scripts utilitaires et de migration

## Configuration de l'environnement de développement

1. Clonez le dépôt : `git clone https://github.com/IvandeMurard/ComparaCourse.git`
2. Installez les dépendances : `npm install`
3. Configurez la base de données PostgreSQL
4. Lancez l'application : `npm run dev`

## Processus de revue

Toutes les Pull Requests seront examinées selon les critères suivants :
- Respect des conventions de code
- Fonctionnalité correctement implémentée et testée
- Pas de régressions dans les fonctionnalités existantes
- Documentation à jour