# 📊 AUDIT — plateforme-cinegeny (CINEGENY)
Dernière mise à jour : 12 juillet 2026 — Modèle utilisé : claude-fable-5

## 🚦 OÙ ON EN EST
- État global : 🟡 à améliorer (rien de cassé, mais du gras et des vulnérabilités)
- Score santé : 6,5/10
- Le produit est riche, bien documenté et activement développé. Mais : 37 vulnérabilités npm
  (15 high), quasi aucun test sur les zones d'argent (Stripe, crédits, wallet), et beaucoup
  de code dormant qui alourdit tout. La fusion avec la vision KULTY (`wonderself/bande-annonce`)
  est la priorité n°1 du fondateur — **l'accès au repo KULTY est encore bloqué** (voir §KULTY).

## ⛔ BLOCAGE EN COURS — ACCÈS KULTY
- KULTY = repo GitHub **`wonderself/bande-annonce`** (confirmé par le fondateur, 12/07/2026).
- Cette session est verrouillée sur `wonderself/plateforme-cinegeny` seul. L'outil `add_repo`
  échoue systématiquement (« MCP tool call requires approval » — le prompt d'approbation
  n'atteint jamais le fondateur : bug du canal d'autorisation de la session).
- **Solution pour la prochaine session** : créer la session depuis claude.ai/code en
  sélectionnant **les deux repos** (`plateforme-cinegeny` + `bande-annonce`) dès le départ.
- Directive du fondateur (à appliquer dès l'accès obtenu) :
  1. Lire **l'intégralité** de KULTY, surtout sa roadmap.
  2. KULTY veut devenir un **système de vote + plateforme de streaming** → CINEGENY est
     cette partie vote + streaming. Intégrer tous les changements de la roadmap KULTY
     dans la roadmap CINEGENY.
  3. Créer les **sessions supplémentaires** sur le modèle du tableau ci-dessous.
  4. Garder le contenu et le design réutilisables, adapter le reste, lister les ajouts.
  5. Proposer des modifications et poser des questions au fondateur avant d'implémenter.

## 🗓️ TABLEAU DES SESSIONS
> Provisoire : les sessions K1–Kn (fusion KULTY) seront insérées après lecture de KULTY.
> Les sessions R1–R4 reprennent le reliquat du ROADMAP.md existant (§15.0ter).

| # | Session | Objectif (1 ligne) | Modèle conseillé | Coût tokens | Durée est. | Statut |
|---|---------|--------------------|------------------|-------------|------------|--------|
| 0 | **K0 — Lecture KULTY + fusion des roadmaps** | Lire tout `bande-annonce`, croiser avec ce plan, finaliser AUDIT.md (sessions K1–Kn) | Sonnet (Opus si archi divergente) | 🟡 | ~45 min | 🔴 Bloquée (accès repo) |
| 1 | **S1 — Sécurité dépendances** | Corriger les 37 vulnérabilités npm (next-intl open redirect, Hono, picomatch…) | Sonnet | 🟢 | ~30 min | ⬜ À faire |
| 2 | **S2 — Dégraissage code mort** | Supprimer `components/netflix/*` non importés + doublons + modules dormants validés par le fondateur | Sonnet | 🟡 | ~45 min | ⬜ À faire |
| 3 | **S3 — Tests zones d'argent** | Tests Vitest sur Stripe (webhook, crédits), wallet, points | Sonnet | 🟡 | ~45 min | ⬜ À faire |
| 4 | **R1 — ROADMAP 15.10** | Finir la passe français (5 fichiers : act, work, create/setups, create/music, create/casting) | Haiku | 🟢 | ~20 min | ⬜ À faire |
| 5 | **R2 — ROADMAP 15.5** | Nettoyer `fundingPct` fictif (film-row, /watch) + trancher l'axe catalogue | Sonnet | 🟢 | ~30 min | ⬜ À faire |
| 6 | **R3 — ROADMAP 15.11** | QA de lancement : parcours complet, SEO/OG, perf, analytics | Sonnet | 🟡 | ~60 min | ⬜ À faire |
| 7+ | **K1…Kn — Fusion KULTY** | À définir en session K0 (vote + streaming selon roadmap KULTY) | à définir | à définir | à définir | 🔴 Attend K0 |

Légende coût : 🟢 léger · 🟡 moyen · 🔴 lourd (à faire en début de fenêtre de quota)

Ordre recommandé (priorité fondateur : « d'abord KULTY, puis les sessions ») :
**K0 → (K1…Kn intercalées selon urgence) → S1 → S2 → S3 → R1 → R2 → R3.**
Si K0 reste bloquée : commencer par S1 (indépendante et urgente — failles high).

## 💡 PROPOSITIONS À VALIDER (avant implémentation)
- **P1 — Mise à jour sécurité immédiate** : `npm audit` remonte 37 vulnérabilités dont
  15 high (open redirect next-intl, accès fichiers arbitraire Hono). Bénéfice : fermer des
  portes connues avant tout lancement public. → ❓ En attente
- **P2 — Purge du code mort** : les 6 composants `src/components/netflix/*` et
  `src/components/home/landing-sections.tsx` ne semblent importés nulle part ; le catalogue
  archivé (~100 films) et plusieurs modules (blockchain, bot Telegram, autopilot) dorment.
  Bénéfice : builds plus rapides, moins de surface d'attaque, sessions Claude moins chères.
  ⚠️ À croiser avec KULTY avant suppression (du contenu pourrait resservir). → ❓ En attente
- **P3 — Tests sur l'argent** : aucun test sur Stripe/crédits/wallet alors que 9 fichiers de
  tests existent ailleurs. Bénéfice : dormir tranquille sur les paiements. → ❓ En attente
- **P4 — Fusion roadmap KULTY** : intégrer la vision vote + streaming de KULTY comme axe
  produit principal, en créant les sessions K1–Kn. Bénéfice : un seul cap produit au lieu de
  deux repos qui divergent. → ✅ Validé sur le principe (détail après K0)
- **P5 — Geler les modules non-cœur** : tokenization/blockchain/agents IA derrière des
  feature flags désactivés par défaut (le modèle `FeatureFlag` existe déjà) plutôt que de les
  maintenir ouverts. Bénéfice : focus vote + streaming sans rien perdre. → ❓ En attente

## 📝 DÉTAIL DES SESSIONS

### Session K0 — Lecture KULTY + fusion des roadmaps 🔴 BLOQUÉE
- Ce qu'on fait : lire tout le repo `wonderself/bande-annonce` (code, docs, roadmap).
  Identifier : ce qui existe déjà côté CINEGENY, ce qui manque, ce qui se contredit.
  Réécrire ce fichier AUDIT.md : sessions K1–Kn détaillées, propositions mises à jour.
  Poser au fondateur les questions d'arbitrage (design à garder ? contenus à migrer ?).
- Fichiers touchés : `AUDIT.md` uniquement (lecture seule ailleurs).
- Critère de réussite : AUDIT.md contient le plan de fusion complet validé par le fondateur.
- Prérequis : session créée avec les DEUX repos.
- Prompt de lancement : « Lis AUDIT.md (§KULTY) de plateforme-cinegeny, puis lis tout le
  repo bande-annonce. Exécute la session K0 : fusionne les roadmaps et mets à jour AUDIT.md.
  N'implémente rien. Pose tes questions d'arbitrage avant d'écrire. »

### Session S1 — Sécurité dépendances
- Ce qu'on fait : `npm audit` → mise à jour ciblée des paquets vulnérables (next-intl,
  Hono via dépendances, picomatch…). On vérifie que build + tests passent.
- Fichiers touchés : `package.json`, `package-lock.json`.
- Critère de réussite : `npm audit --omit=dev` = 0 high ; CI verte.
- Prompt de lancement : « Lis AUDIT.md session S1. Corrige les vulnérabilités npm high et
  moderate par mises à jour ciblées. Ne monte pas de version majeure sans me demander.
  Vérifie build + tests, commite. »

### Session S2 — Dégraissage code mort
- Ce qu'on fait : confirmer par recherche d'imports que `components/netflix/*` et autres
  fichiers suspects sont orphelins, puis les supprimer. Lister les modules dormants
  (blockchain, telegram-bot, autopilot) et proposer flag ou suppression (décision fondateur).
- Fichiers touchés : `src/components/netflix/*`, `src/components/home/landing-sections.tsx`,
  liste à compléter en début de session.
- Critère de réussite : build + tsc verts, aucune page ne change visuellement.
- ⚠️ Ne pas lancer avant K0 (du design KULTY pourrait réutiliser ces composants).
- Prompt de lancement : « Lis AUDIT.md session S2. Vérifie les orphelins listés, supprime
  ce qui est confirmé mort, propose le sort des modules dormants. Build + tsc verts. »

### Session S3 — Tests zones d'argent
- Ce qu'on fait : tests Vitest sur `src/app/actions/stripe.ts`, `credits.ts`,
  `src/lib/wallet.service.ts`, le webhook Stripe (`src/app/api/stripe/*`).
- Critère de réussite : les chemins heureux + cas d'erreur principaux couverts, CI verte.
- Prompt de lancement : « Lis AUDIT.md session S3. Écris les tests Vitest des flux
  paiement/crédits/wallet, en mockant Stripe et Prisma comme dans les tests existants. »

### Sessions R1–R3 — Reliquat ROADMAP.md
- Déjà cadrées dans `ROADMAP.md` §15.0ter (15.10 → Haiku, 15.5 → Sonnet, 15.11 → Sonnet).
  Les prompts et critères y figurent ; ce tableau ne fait que les re-prioriser après la fusion.

## 📌 RÉSULTATS D'ANALYSE (référence — éviter de relire ces fichiers)
- Stack : Next.js 16.1.6 (App Router, build webpack) + React 19.2.3 + Prisma 7.4.1
  (111 modèles) + PostgreSQL + Redis (dégradation gracieuse) + NextAuth 5 beta + next-intl
  (FR/EN) + Stripe + Resend + S3 Hetzner + Sentry. Déploiement Docker/Coolify.
- Volumétrie : 551 fichiers dans `src/`, 203 pages, 46 routes API, 48 fichiers d'actions
  serveur, 9 fichiers de tests (`src/__tests__/lib/`).
- Sécurité : routes admin correctement gardées (session + rôle ADMIN → 401 sinon),
  rate limiting présent (`src/lib/rate-limit.ts`), votes anonymes hashés (sha256 IP).
  `typescript.ignoreBuildErrors: true` dans `next.config.ts` (assumé, compensé par
  `tsc --noEmit` en CI — voir README).
- CI : `.github/workflows/ci.yml` = typecheck + tests + build sur chaque push. Solide.
- Vulnérabilités : 37 (2 low, 20 moderate, 15 high) au 12/07/2026 — voir session S1.
- Code mort probable : `src/components/netflix/{landing-sections,splash-screen,
  hero-manifesto,top-ten-row,hero-banner,creator-bar,screenwriter-cta,film-row}.tsx` et
  `src/components/home/landing-sections.tsx` — aucun import trouvé (à reconfirmer en S2).
- Modules dormants : `src/lib/blockchain.ts` (env vars jamais définies dans .env.example),
  `src/lib/telegram-bot.ts`, autopilot, agents IA, tokenization — fonctionnels mais
  probablement pas branchés en prod.
- Middleware : `src/proxy.ts` (convention Next 16), pas de `middleware.ts`.
- Le lien existant avec KULTY : `.env.example` → `NEXT_PUBLIC_TRAILER_TOOL_URL` pointe vers
  le déploiement de `wonderself/bande-annonce` (« Mini Studio ») ; ROADMAP session 15.12
  prévoyait déjà « Trailer Studio v2 (refonte depuis le dépôt bande annonce) » en Opus.

## ✅ HISTORIQUE
- 12/07/2026 — Session d'audit initiale (Fable 5) : Phase 1 (analyse cinegeny) faite,
  Phase 2 (réponses fondateur) faite, AUDIT.md créé. Accès KULTY bloqué (bug approbation
  `add_repo`) → session K0 à lancer avec les deux repos sélectionnés à la création.
