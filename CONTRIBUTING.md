# Contributing to CINEGENY

> **Bienvenue !** CINEGENY est un studio de cinéma collaboratif propulsé par l'IA.
> Ce guide explique comment contribuer au code de la plateforme.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Wonderself/plateforme-cinegeny.git
cd plateforme-cinegeny

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start PostgreSQL + Redis (Docker)
docker compose up -d

# 5. Initialize database
npx prisma db push
npx prisma db seed
# → crée admin@lumiere.film / Admin99999!! + 6 films officiels + données de démo

# 6. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
plateforme-cinegeny/
├── prisma/
│   ├── schema.prisma        # 108 modèles
│   ├── seed.ts               # Admin + 6 films officiels + catalogue archivé + démo
│   └── bootstrap-admin.cjs   # Création admin seule, sans données de démo (Node pur)
├── src/
│   ├── app/
│   │   ├── (public)/    # Pages publiques (films, academy, streaming, tv, invest, ...)
│   │   ├── (dashboard)/ # Pages protégées (dashboard, admin/~65 sous-sections, ...)
│   │   ├── (auth)/      # Login, register, reset password
│   │   ├── actions/     # Server actions
│   │   └── api/         # Routes API (auth, cron, stripe, upload, catalog, ...)
│   ├── components/
│   │   ├── netflix/     # Composants UI style Netflix
│   │   ├── ui/          # Primitives Radix UI (Button, Badge, ...)
│   │   ├── admin/       # Composants admin (catalog-manager, ...)
│   │   └── *.tsx        # Composants métier
│   ├── data/            # Données statiques : films.ts (6 officiels), archived-films.ts (~100)
│   ├── hooks/           # Hooks React
│   └── lib/             # Librairies utilitaires (auth, prisma, catalog-state, ...)
├── public/              # Assets statiques
├── start.sh             # Script de démarrage conteneur (voir DEPLOYMENT.md)
├── next.config.ts        # ignoreBuildErrors/ignoreDuringBuilds (voir DEPLOYMENT.md §5)
├── README.md             # Vue d'ensemble + installation
├── PROJECT_HISTORY.md    # Changelog complet (À METTRE À JOUR)
├── FEATURES.md           # Inventaire de fonctionnalités (À METTRE À JOUR)
├── SECURITY.md           # Pratiques de sécurité + incidents résolus
├── DEPLOYMENT.md         # Guide de déploiement (Docker + Coolify)
├── ROADMAP.md            # Roadmap technique détaillée
└── SLATE_DECK.md         # Détail des 6 films officiels + catalogue archivé
```

---

## Rules

### Golden Rules (Non-Negotiable)

1. **NEVER delete features** — Only add, improve, or optimize
2. **ALWAYS update docs** — `PROJECT_HISTORY.md` and `FEATURES.md` after every change
3. **ALWAYS test** — Run `npx tsc --noEmit` before committing (minimum)
4. **ALWAYS use `force-dynamic`** — On every page that uses Prisma
5. **Keep it fast and light** — Performance is a feature

### Code Style

- **TypeScript strict** — `noImplicitAny: true`, no `any` types
- **French UI text** — All user-facing strings in French
- **English code** — Variable names, comments, function names in English
- **Prisma enums** — Use `as never` when passing string variables as enum values
- **Server Actions** — Prefer server actions over API routes

### Design System

- **Theme**: Dark (#0A0A0A) + Gold (#D4AF37)
- **Fonts**: Playfair Display (headlines), Inter (body)
- **Components**: Radix UI primitives + custom Netflix-style components
- **Animations**: Framer Motion, keep subtle (300-500ms)
- **Responsive**: Mobile-first, 3 breakpoints (sm, md, lg)

---

## Workflow

### Branch Strategy
```
main ← Direct push (small fixes) or PR (features)
```

### Commit Convention
```
feat: description    — New feature
fix: description     — Bug fix
docs: description    — Documentation only
chore: description   — Maintenance (deps, config)
refactor: description — Code restructure (no behavior change)
```

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes
3. Run `npx tsc --noEmit` — zero errors
4. Update `PROJECT_HISTORY.md` with changes
5. Update `FEATURES.md` if new feature
6. Push and create PR
7. PR description must include: what, why, how to test

---

## Common Tasks

### Add a New Page
```bash
# Public page
src/app/(public)/my-page/page.tsx

# Dashboard page (protected)
src/app/(dashboard)/dashboard/my-page/page.tsx
```

Always add `export const dynamic = 'force-dynamic'` if using Prisma.

### Add a Server Action
```bash
src/app/actions/my-feature.ts
```

Pattern:
```typescript
'use server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function myAction(input: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Your logic here
  return { data: result }
}
```

### Add a New API Route
```bash
src/app/api/my-route/route.ts
```

Always add `export const dynamic = 'force-dynamic'`.

### Add a Component
```bash
# Feature component
src/components/my-component.tsx

# Netflix-style component
src/components/netflix/my-component.tsx
```

Use `'use client'` only when needed (interactivity, hooks).

---

## Known Pitfalls

| Pitfall | Solution |
|---------|----------|
| Prisma fails at build time | Use `force-dynamic` + lazy Proxy singleton |
| Redis errors in logs | Normal — graceful degradation |
| `middleware.ts` + `proxy.ts` conflict | Next.js 16 uses `proxy.ts` only |
| Enum type errors in seed.ts | Use `as never` cast |
| `useRef` needs initial value (React 19) | Use `useRef<Type>(undefined)` |
| S3 SDK not installed locally | Use `@ts-expect-error` for conditional imports |

---

## Getting Help

- **Issues**: https://github.com/Wonderself/plateforme-cinegeny/issues
- **Docs**: `README.md`, `PROJECT_HISTORY.md`, `FEATURES.md`, `FILM_PIPELINE.md`

---

## License

All rights reserved — CINEGENY Studio / Wonderself.
Contributions are welcome under the project's license terms.
