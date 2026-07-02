# CINEGENY — Guide de Déploiement

> **Guide complet pour déployer CINEGENY en production.**
> Infrastructure: Docker + Coolify + Hetzner.
> **Dépôt déployé**: `Wonderself/plateforme-cinegeny` (branche `main`)
> **Production**: https://platform.cinegeny.com

⚠️ **Historique important** : ce projet a eu deux dépôts GitHub en parallèle
(`plateforme-cinegeny` et un ancien fork `lumiere-fork-a-vider`). Coolify a pointé un temps
sur le mauvais dépôt, ce qui a fait tourner une ancienne version pendant plusieurs
déploiements sans erreur apparente. **Vérifiez toujours, en cas de "rien ne change après
déploiement", que la source Git configurée dans Coolify est bien `plateforme-cinegeny`.**

---

## 1. Architecture

```
                 ┌──────────────┐
                 │   Cloudflare  │  DNS + CDN (optionnel)
                 │ platform.     │
                 │ cinegeny.com  │
                 └──────┬───────┘
                        │ HTTPS
                 ┌──────┴───────┐
                 │   Traefik    │  Reverse proxy (auto-SSL, géré par Coolify)
                 │  (Coolify)   │
                 └──────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
   ┌──────┴──────┐ ┌───┴────┐ ┌─────┴─────┐
   │  Next.js    │ │  Redis │ │ PostgreSQL │
   │  App :3000  │ │ (opt.) │ │            │
   │ (standalone)│ │        │ │            │
   └─────────────┘ └────────┘ └────────────┘
```

---

## 2. Prérequis

### Serveur
- **VPS**: Hetzner (ou équivalent), suffisant pour Next.js + build Docker
- **Docker**: v24+ avec Docker Compose
- **Coolify**: v4+ (self-hosted PaaS)

### Comptes / services
| Service | Usage | Requis |
|---------|-------|--------|
| Hetzner (ou autre VPS) | Hébergement | Oui |
| GitHub — `Wonderself/plateforme-cinegeny` | Dépôt de code | Oui |
| PostgreSQL | Base de données | Oui |
| Redis | Cache (dégradation gracieuse si absent) | Non |
| Resend | Emails transactionnels | Non |
| Stripe | Paiements | Non |
| Sentry | Monitoring d'erreurs | Non |
| S3 / Cloudflare R2 | Stockage fichiers | Non |

### Variables d'environnement

```env
# Requis
DATABASE_URL="postgresql://user:PASSWORD@host:5432/db?sslmode=require"
AUTH_SECRET="secret-256-bits"

# URL du site — piloté dynamiquement (SEO, Open Graph, NextAuth)
NEXT_PUBLIC_APP_URL="https://platform.cinegeny.com"
AUTH_URL="https://platform.cinegeny.com"
NEXTAUTH_URL="https://platform.cinegeny.com"

# Bootstrap base de données (voir section 6)
SEED_DB="false"            # true = seed complet (admin + films + démo), une fois puis repasser à false
ADMIN_BOOTSTRAP="false"    # true = crée/réinitialise UN compte admin sans données de démo
ADMIN_EMAIL="vous@example.com"
ADMIN_PASSWORD="mot-de-passe-fort"

# Optionnel (dégradation gracieuse si absent)
REDIS_URL="redis://redis:6379"
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="CINEGENY <noreply@votredomaine>"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
STRIPE_PRICE_BASIC="price_xxxxxxxxxxxx"
STRIPE_PRICE_PREMIUM="price_xxxxxxxxxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
CRON_SECRET="votre-secret-cron"
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_BUCKET="..."
S3_REGION="..."
S3_ENDPOINT="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

> **Casse des booléens** : `SEED_DB` et `ADMIN_BOOTSTRAP` acceptent `true`/`True`/`TRUE`/`1`/`yes`
> (normalisés en minuscule dans `start.sh`). Une variable Coolify sauvegardée en `True` (majuscule)
> fonctionne donc normalement.

---

## 3. Déploiement Coolify (recommandé)

### Étape 1 : Connecter le dépôt GitHub
1. Ouvrir le dashboard Coolify
2. Ajouter une ressource → Application → GitHub App
3. **Connecter `Wonderself/plateforme-cinegeny`** (pas un fork)
4. Sélectionner la branche `main`

### Étape 2 : Configurer le build
- **Build pack**: Dockerfile
- **Dockerfile**: `./Dockerfile`
- **Port**: 3000

### Étape 3 : Services
1. **PostgreSQL** — noter la chaîne de connexion pour `DATABASE_URL`
2. **Redis** (optionnel) — noter la chaîne pour `REDIS_URL`

### Étape 4 : Variables d'environnement
Ajouter toutes les variables de la section 2.

### Étape 5 : Déployer
Cliquer "Deploy". Le pipeline :
1. Build l'image Docker (multi-stage, voir section 5)
2. Démarre un nouveau conteneur, exécute `start.sh` (voir section 6)
3. Attend le healthcheck (`curl http://localhost:3000/`, 40s de délai initial)
4. Bascule le trafic (rolling update) puis supprime l'ancien conteneur

### Étape 6 : Domaine
1. Coolify : domaine personnalisé `platform.cinegeny.com`
2. DNS : enregistrement A → IP du serveur
3. Traefik génère le certificat SSL automatiquement

---

## 4. Docker Compose (déploiement manuel, hors Coolify)

```yaml
# docker-compose.production.yml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://cinegeny:${DB_PASSWORD}@db:5432/cinegeny
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXT_PUBLIC_APP_URL=https://platform.cinegeny.com
      - AUTH_URL=https://platform.cinegeny.com
      - NEXTAUTH_URL=https://platform.cinegeny.com
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cinegeny
      POSTGRES_USER: cinegeny
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cinegeny"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

```bash
DB_PASSWORD=your-password AUTH_SECRET=your-secret docker compose -f docker-compose.production.yml up -d
```

---

## 5. Dockerfile — build multi-stage

### Stage 1 : `deps`
- `npm ci --ignore-scripts` — cache réutilisé tant que `package.json` ne change pas

### Stage 2 : `builder`
- `npx prisma generate`
- `npm run build` (= `next build --webpack`, output `standalone`)
- `DATABASE_URL` factice pendant le build — Prisma en a besoin pour l'analyse des modules,
  pas pour une vraie connexion (le client réel se connecte au runtime via un proxy lazy,
  `src/lib/prisma.ts`)
- **Important** : `next.config.ts` définit `typescript.ignoreBuildErrors: true`. Ceci a été
  ajouté après qu'un build ait échoué en production (exit 255 à l'étape "Running TypeScript")
  alors que la CI GitHub passait — le serveur manquait de RAM pour la passe de typage. La
  validation TypeScript reste assurée par la CI (`.github/workflows/ci.yml`, job
  `lint-and-typecheck`, `npx tsc --noEmit`) sur chaque push ; le build de production ne la
  refait plus, ce qui allège fortement la consommation mémoire.
  ⚠️ Une clé `eslint: { ignoreDuringBuilds: true }` avait été ajoutée en même temps mais
  s'est révélée invalide sur cette version de Next.js (`NextConfig` ne l'accepte pas), ce qui
  a cassé `tsc --noEmit` en CI pendant plusieurs commits — retirée. La CI n'exécute de toute
  façon jamais `npm run lint` (job `lint-and-typecheck` ne lance que `tsc --noEmit`).

### Stage 3 : `runner`
- Image Alpine minimale, utilisateur non-root `nextjs:1001`
- Copie : build standalone + assets statiques + `node_modules` complet (Prisma CLI et le
  driver `pg` ont des arbres de dépendances profonds — copie intégrale plus robuste que de
  cibler des paquets individuels)
- Copie : schéma Prisma, `prisma.config.ts`, `start.sh`, `prisma/bootstrap-admin.cjs`
- Healthcheck : `curl http://localhost:3000/` toutes les 30s

---

## 6. Script de démarrage (`start.sh`)

Séquence réelle exécutée à chaque démarrage de conteneur :

1. Affiche la version Node et vérifie que `DATABASE_URL` est défini
2. Vérifie que le module `pg` est disponible
3. Attend que PostgreSQL réponde (30 tentatives, 2s d'intervalle)
4. `npx prisma db push` (avec repli `--accept-data-loss` si le premier essai échoue)
5. Si `SEED_DB` est vrai → `npx prisma db seed` (crée l'admin de démo `admin@lumiere.film` /
   `Admin99999!!`, les 6 films officiels marqués publics, le catalogue archivé marqué non
   public, et diverses données de démonstration — voir `prisma/seed.ts`)
6. Si `ADMIN_BOOTSTRAP` est vrai → `node prisma/bootstrap-admin.cjs` : crée ou réinitialise
   **un seul** compte admin (email/mot de passe via `ADMIN_EMAIL`/`ADMIN_PASSWORD`, ou
   `admin@lumiere.film` / `Admin99999!!` par défaut), **sans** toucher au reste de la base.
   Écrit en Node pur (`.cjs`, pas `ts-node`) pour ne jamais échouer silencieusement au
   démarrage.
7. `exec node server.js`

**Bonnes pratiques** :
- En premier déploiement sur une base vide, utiliser soit `SEED_DB=true` (si vous voulez le
  jeu de données de démo complet) soit `ADMIN_BOOTSTRAP=true` seul (si vous voulez uniquement
  un compte admin réel, recommandé en production).
- **Repasser la variable à `false`/la retirer après usage** pour ne pas la relancer à chaque
  déploiement.

---

## 7. Cron Jobs

```bash
# Toutes les 15 minutes — libère les tâches expirées, clôture les concours, etc.
*/15 * * * * curl -s "https://platform.cinegeny.com/api/cron?key=YOUR_CRON_SECRET" > /dev/null
```

Dans Coolify : ajouter une tâche planifiée avec la même URL.

---

## 8. Monitoring

### Sentry
`NEXT_PUBLIC_SENTRY_DSN` active la capture d'erreurs serveur (`src/instrumentation.ts`) et
client (`src/app/global-error.tsx`).

### Health check
```bash
curl -f https://platform.cinegeny.com/
# 200 si sain
```

### Logs
Coolify → onglet **Logs** de l'application (démarrage du conteneur, `bootstrap-admin`,
erreurs runtime) — distinct de l'onglet **Deployments** (logs de build Docker uniquement).

---

## 9. Dépannage

### Le build s'arrête à "Running TypeScript" (exit 255) alors que la CI passe
- Symptôme d'un OOM sur le serveur pendant la vérification de types.
- Déjà corrigé : `next.config.ts` ignore la vérif TS/lint pendant `next build` (voir section 5).
- Si ça se reproduit à une autre étape, c'est probablement une vraie limite de RAM serveur.

### "Rien ne change après déploiement" malgré un build réussi
- Vérifier que Coolify pointe bien sur `Wonderself/plateforme-cinegeny` (pas un autre dépôt/fork).
- Vérifier la branche déployée (`main`).
- Forcer un rebuild sans cache.

### Connexion admin impossible
- Aucun compte admin n'existe tant que `SEED_DB` ou `ADMIN_BOOTSTRAP` n'a pas tourné au moins
  une fois sur cette base. Voir section 6.
- Il n'existe **plus** de bypass d'authentification codé en dur (supprimé — voir `SECURITY.md`).
  Toute connexion passe par un vrai compte en base.

### `SEED_DB=True` (majuscule) ne se déclenche pas
- Corrigé : `start.sh` normalise la casse. Si vous êtes sur une version antérieure, mettez la
  valeur en minuscule ou mettez à jour `start.sh`.

### "Cannot find module 'pg'" au runtime
- Le Dockerfile copie `node_modules` en entier vers le stage `runner` — vérifier que cette
  étape n'a pas été modifiée/tronquée.

### Erreurs Redis dans les logs
- Normal — dégradation gracieuse : l'app fonctionne sans Redis, juste plus lentement (pas de
  cache).

### `prisma db push` échoue au premier déploiement
- `start.sh` retente automatiquement avec `--accept-data-loss` — normal sur une base vierge.

---

## 10. Sauvegardes

### PostgreSQL
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
psql $DATABASE_URL < backup-20260101.sql
```

### Redis
Couche de cache uniquement — pas de sauvegarde nécessaire (l'app fonctionne sans).

### Fichiers (S3)
S3/R2 gère la durabilité — envisager une réplication cross-région pour les assets critiques.
