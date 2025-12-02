# Job Aggregator - ESN Île-de-France

Application d'agrégation d'offres d'emploi pour Analyste d'Exploitation.

## Prérequis
- **Node.js** (v18 ou supérieur) doit être installé sur votre machine. [Télécharger Node.js](https://nodejs.org/)

## Installation

1. Ouvrez un terminal dans ce dossier.
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration de la Base de Données

1. Initialisez la base de données SQLite :
   ```bash
   npm run db:push
   ```

## Utilisation

### 1. Récupérer les offres (Scraping)
Lancez le script pour peupler la base de données avec des offres (données fictives pour l'instant) :
```bash
npm run scrape
```

### 2. Lancer l'application
Démarrez le serveur de développement :
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure
- `app/` : Code source de l'application (Pages, Layout).
- `lib/scraper.ts` : Logique de récupération des offres.
- `prisma/schema.prisma` : Schéma de la base de données.
