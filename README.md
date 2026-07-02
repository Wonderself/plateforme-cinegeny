# CINEGENY — Studio de Cinéma Collaboratif propulsé par l'IA

> Production, financement et streaming de films créés collaborativement par une communauté de
> co-producteurs — micro-tâches, tokenisation, TV en direct, Academy, et plus.

**Production**: https://platform.cinegeny.com
**Dépôt**: https://github.com/Wonderself/plateforme-cinegeny

## Stack Technique

- **Frontend**: Next.js 16.1.6 (App Router) + React 19.2.3 + TypeScript + Tailwind CSS 4
- **Auth**: NextAuth 5 (beta) — JWT + Credentials (bcrypt) + Google OAuth
- **DB**: PostgreSQL + Prisma ORM 7.4.1 (108 modèles) via `@prisma/adapter-pg`
- **Cache**: Redis (ioredis, dégradation gracieuse si absent)
- **UI**: Radix UI + lucide-react + Framer Motion, thème noir & or (`#0A0908` / `#C9A227`)
- **i18n**: next-intl — FR (défaut) + EN

## Installation Rapide (dev local)

### 1. Prérequis
- Node.js 20+
- Docker Desktop (pour PostgreSQL + Redis)

### 2. Installer les dépendances
```bash
npm install
```

### 3. Variables d'environnement
```bash
cp .env.example .env.local
# Éditer .env.local — voir SECURITY.md pour la liste complète des variables
```

### 4. Démarrer la base de données
```bash
docker compose up -d
```

### 5. Appliquer le schéma Prisma
```bash
npm run db:push
```

### 6. Créer un compte admin

Deux options :

- **Seed complet** (admin + films + données de démo) :
  ```bash
  npm run db:seed
  ```
  Crée `admin@lumiere.film` / `Admin99999!!` parmi d'autres comptes de démo.

- **Admin seul, zéro donnée de démo** (recommandé en production) :
  ```bash
  ADMIN_EMAIL=vous@example.com ADMIN_PASSWORD=VotreMotDePasse node prisma/bootstrap-admin.cjs
  ```
  Voir `DEPLOYMENT.md` pour l'utiliser via la variable `ADMIN_BOOTSTRAP` au démarrage du conteneur.

### 7. Démarrer le serveur
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Commandes Utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production (next build --webpack)
npm run db:push      # Push schéma sans migration
npm run db:seed      # Seed complet (admin + 6 films officiels + démo)
npm run db:studio    # Ouvrir Prisma Studio
npm run db:reset     # Reset DB + re-seed
npx tsc --noEmit     # Vérification de types (aussi lancée en CI)
npx vitest run       # Tests unitaires
```

> Note build : `next.config.ts` désactive la vérification TypeScript pendant `next build`
> (`typescript.ignoreBuildErrors`) pour éviter un OOM sur le build Docker en production. La
> validation reste faite en CI (`tsc --noEmit`) sur chaque push — voir
> `.github/workflows/ci.yml`. (`eslint.ignoreDuringBuilds` a été retiré : ce n'est pas une
> propriété valide sur cette version de Next.js — elle cassait `tsc --noEmit` en CI.)

## Catalogue de Films

Le catalogue public (page d'accueil + `/films`) est piloté par **6 films officiels**, définis
dans `src/data/films.ts` :

1. Le portrait de Oscar Wilde
2. Les souffrances du jeune Goethe
3. Le voyage dans la Lune
4. Le dictionnaire de Voltaire
5. Le Dernier Convoi
6. The Artists

Un catalogue **archivé** (~100 films legacy, `src/data/archived-films.ts`) peut être
réactivé film par film depuis `/admin/films-catalog` — l'état des toggles est persisté en
base (modèle `CatalogActivation`), pas seulement côté navigateur. Voir `SLATE_DECK.md` pour
le détail des 6 films officiels.

## Pages Principales

| URL | Description |
|-----|-------------|
| `/` | Accueil (hero, catalogue par genre, CTA Academy) |
| `/films`, `/films/[slug]` | Catalogue et fiche film |
| `/academy` | CINEGENY Academy — gratuite pour les membres |
| `/streaming`, `/watch`, `/tv`, `/tv/live` | Streaming et TV |
| `/invest`, `/investors`, `/tokenization` | Co-production et tokenisation |
| `/community`, `/leaderboard`, `/actors` | Communauté |
| `/login`, `/register` | Authentification |
| `/dashboard`, `/profile`, `/tasks`, `/credits` | Espace membre |
| `/admin` | Panel admin (~65 sous-sections : films, users, paiements, tokenisation, IA, légal…) |

## Documentation

| Fichier | Contenu |
|---------|---------|
| `FEATURES.md` | Inventaire complet des fonctionnalités (mis à jour à chaque ajout) |
| `PROJECT_HISTORY.md` | Changelog détaillé par version |
| `SECURITY.md` | Pratiques de sécurité, variables d'env, procédure d'incident |
| `DEPLOYMENT.md` | Guide de déploiement (Docker + Coolify) |
| `ROADMAP.md` | Roadmap technique détaillée |
| `SLATE_DECK.md` | Détail des 6 films officiels + catalogue archivé |
| `FILM_PIPELINE.md` | Vision du workflow de création de film |
| `CONTRIBUTING.md` | Guide de contribution |

---

*CINEGENY Studio — 2026*
