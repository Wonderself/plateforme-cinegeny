// ─────────────────────────────────────────────────────────────────────────────
// CINEGENY — SOURCE DE VÉRITÉ DU WORDING PUBLIC (PHASE 15, session 15.1)
//
// Ce fichier centralise TOUT le vocabulaire public de la plateforme : pitch,
// baseline, statuts du parcours d'un film, noms des compétitions, mécanique de
// vote, monnaie unique et architecture de navigation. Toute surface publique
// (pages, composants, e-mails) doit puiser son wording ICI plutôt que de le
// réécrire, afin d'éviter les synonymes et l'anglais résiduel.
//
// Règles verrouillées : voir ROADMAP.md §15.0 (décisions) et §15.0bis (prompt
// maître). En cas de doute, ces sections priment sur tout le reste.
//
// ✅ VALIDÉ PAR LE FONDATEUR (2026-07-02) :
//   1. Piste A = « Bandes-annonces en compétition », Piste B = « Films en
//      compétition » (recommandations retenues — voir VOTE_TRACKS).
//   2. « Comment ça marche » = Variante 1, calée sur la baseline (HOW_IT_WORKS).
//   Les variantes sont conservées ci-dessous à titre d'historique.
// ─────────────────────────────────────────────────────────────────────────────

/* ── Identité ─────────────────────────────────────────────────────────────── */

export const BRAND = {
  name: 'CINEGENY',

  /** Pitch officiel (décision 15.0 #1) — description longue, une phrase. */
  pitch:
    'CINEGENY est le studio de cinéma IA où le public décide : un parcours ' +
    'complet, de la création au streaming, en passant par le vote et le ' +
    'financement.',

  /** Version courte, prête pour un hero ou une meta description. */
  pitchShort: 'Le studio de cinéma IA où c’est vous qui décidez du prochain film.',

  /** Baseline officielle — à afficher partout, telle quelle (décision 15.0). */
  baseline: 'Regardez. Votez. Le film se fait.',

  /** Accroche de lancement (décision 15.0 #13). */
  launchLine:
    'Le premier studio de cinéma où VOUS décidez du prochain film IA. ' +
    '5 000 votes, et le film se fait.',
} as const

/* ── Vocabulaire fixe (prompt maître, règle 6) ────────────────────────────── */
// Termes canoniques : ne jamais créer de synonyme. Les termes bannis ne doivent
// apparaître sur AUCUNE surface publique.

export const VOCAB = {
  allowed: [
    'voter',
    'En vote',
    'En production',
    'À regarder',
    'co-producteur',
    'Points CINEGENY',
    'Finale CINEGENY',
  ],
  /** Interdits côté public (jargon qui brouille le message). */
  banned: ['staking', 'tokenisation', 'gouvernance', 'DAO', 'micro-tâche', 'lumens', 'tokens', 'crédits IA'],
} as const

/* ── Parcours d'un film : les 3 statuts (axe de navigation unique, 15.0 #6) ── */

export type FilmStatusKey = 'en-vote' | 'en-production' | 'a-regarder'

export interface FilmStatus {
  key: FilmStatusKey
  /** Libellé canonique — jamais traduit ni décliné. */
  label: string
  /** Une phrase, grand public, pour expliquer l'étape. */
  description: string
  /** Statut suivant dans le parcours (null pour le dernier). */
  next: FilmStatusKey | null
}

export const FILM_STATUSES: Record<FilmStatusKey, FilmStatus> = {
  'en-vote': {
    key: 'en-vote',
    label: 'En vote',
    description:
      'Le film est en compétition. La communauté vote — 1 vote gratuit par personne.',
    next: 'en-production',
  },
  'en-production': {
    key: 'en-production',
    label: 'En production',
    description:
      'Le film a réuni 5 000 votes : il passe en production et vous suivez sa fabrication.',
    next: 'a-regarder',
  },
  'a-regarder': {
    key: 'a-regarder',
    label: 'À regarder',
    description: 'Le film est terminé et disponible en streaming sur CINEGENY.',
    next: null,
  },
}

/** Ordre d'affichage du parcours (onglets catalogue, timeline fiche film). */
export const FILM_STATUS_ORDER: FilmStatusKey[] = ['en-vote', 'en-production', 'a-regarder']

/* ── Mécanique de vote (décision 15.0 #5) ─────────────────────────────────── */

export const VOTE = {
  /** Seuil qui déclenche le passage à l'étape suivante. */
  threshold: 5000,
  /** Votes gratuits par personne et par film. */
  freeVotesPerFilm: 1,
  /** Explication grand public de la règle de vote. */
  rule:
    '1 vote gratuit par film. Vous pouvez voter sans compte : une inscription ' +
    'rapide confirme et valide votre vote.',
} as const

/* ── Les deux compétitions (pistes) — NOMS À VALIDER PAR LE FONDATEUR ──────── */

export interface VoteTrack {
  key: 'A' | 'B'
  /** Nom officiel retenu (recommandation). Voir `nameVariants` pour les options. */
  name: string
  /** Variantes proposées au fondateur (la 1re est la recommandation). */
  nameVariants: string[]
  /** Ce que déclenchent 5 000 votes — une phrase. */
  outcome: string
  /** Pitch court de la piste. */
  tagline: string
}

export const VOTE_TRACKS: Record<'A' | 'B', VoteTrack> = {
  A: {
    key: 'A',
    name: 'Bandes-annonces en compétition',
    nameVariants: ['Bandes-annonces en compétition', 'Le prochain film', 'Films à lancer'],
    outcome: 'À 5 000 votes, le film part en production.',
    tagline: 'Des films au stade bande-annonce. Votre vote les fait exister.',
  },
  B: {
    key: 'B',
    name: 'Films en compétition',
    nameVariants: ['Films en compétition', 'En lice pour la Finale', 'Films en Finale'],
    outcome: 'À 5 000 votes, le film entre en Finale CINEGENY.',
    tagline: 'Des films déjà réalisés. Votez pour les envoyer en Finale.',
  },
}

/* ── Finale CINEGENY (décision 15.0 #5, piste B) ──────────────────────────── */

export const FINALE = {
  name: 'Finale CINEGENY',
  description:
    'Chaque année, les films de la compétition qui atteignent 5 000 votes ' +
    'entrent en Finale. En fin d’année, la communauté qui a voté remporte des ' +
    'prix — dont des voyages.',
} as const

/* ── Monnaie unique (décision 15.0 #7) ────────────────────────────────────── */

export const POINTS = {
  name: 'Points CINEGENY',
  description:
    'La seule monnaie de CINEGENY : gagnez des Points en votant, en participant ' +
    'et en parrainant. Ils ouvrent droit aux récompenses et au concours.',
} as const

/* ── « Comment ça marche » — 3 étapes max, FORMULE À VALIDER ───────────────── */

export interface HowItWorksStep {
  title: string
  description: string
}

/**
 * Recommandation retenue (Variante 1) : elle décalque la baseline
 * « Regardez. Votez. Le film se fait. » — la plus cohérente et mémorisable.
 */
export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    title: 'Regardez',
    description: 'Parcourez les films et les bandes-annonces en compétition.',
  },
  {
    title: 'Votez',
    description: '1 vote gratuit par film. C’est vous qui décidez.',
  },
  {
    title: 'Le film se fait',
    description:
      'À 5 000 votes, le film part en production. Vous l’avez rendu possible.',
  },
]

/**
 * Les 3 variantes soumises au fondateur pour validation (règle 15.1).
 * `HOW_IT_WORKS` ci-dessus = variantes[0].
 */
export const HOW_IT_WORKS_VARIANTS: { id: string; label: string; steps: HowItWorksStep[] }[] = [
  {
    id: 'baseline',
    label: 'Variante 1 — calée sur la baseline (recommandée)',
    steps: HOW_IT_WORKS,
  },
  {
    id: 'benefice',
    label: 'Variante 2 — orientée bénéfice / « vous »',
    steps: [
      { title: 'Choisissez votre film', description: 'Découvrez les films en compétition et soutenez vos préférés.' },
      { title: 'Faites-le gagner', description: 'Chaque vote compte : à 5 000 votes, le film est lancé.' },
      { title: 'Vivez la suite', description: 'Suivez sa production, puis regardez-le en streaming.' },
    ],
  },
  {
    id: 'simple',
    label: 'Variante 3 — la plus simple / novice',
    steps: [
      { title: 'Découvrez', description: 'Des films créés avec l’IA, imaginés pour vous.' },
      { title: 'Votez gratuitement', description: 'Votre voix décide quel film se fait.' },
      { title: 'Regardez-le naître', description: 'De la production au streaming, vous y étiez dès le début.' },
    ],
  },
]

/* ── Architecture de navigation (header / footer, 15.1) ───────────────────── */
// 4 entrées principales alignées sur les piliers (Vote → Production → Streaming
// + Co-production), Academy mise en avant à part comme accroche.
//
// Les icônes restent côté composant (couche présentation) ; ce fichier ne
// contient que le wording et les destinations.

export interface NavEntry {
  href: string
  label: string
  /** Sous-titre / verbe d'action (ex. « Voter »). */
  tagline?: string
}

/** Les 4 entrées principales, dans l'ordre. */
export const PRIMARY_NAV: NavEntry[] = [
  { href: '/films', label: 'Films', tagline: 'Voter' },
  { href: '/streaming', label: 'Regarder' },
  { href: '/create', label: 'Participer' },
  { href: '/invest', label: 'Co-produire' },
]

/** Academy — accroche mise en avant, séparée des 4 piliers. */
export const ACADEMY_NAV: NavEntry = {
  href: '/academy',
  label: 'Academy',
  tagline: 'Apprendre le cinéma IA',
}

/** Colonnes du footer — miroir de l'IA principale (sans icône). */
export const FOOTER_COLUMNS: { title: string; links: NavEntry[] }[] = [
  {
    title: 'Films',
    links: [
      { href: '/films', label: 'Films en compétition' },
      { href: '/finale', label: 'Finale CINEGENY' },
      { href: '/leaderboard', label: 'Classement' },
    ],
  },
  {
    title: 'Regarder',
    links: [
      { href: '/streaming', label: 'Streaming' },
      { href: '/tv', label: 'Séries & TV' },
    ],
  },
  {
    title: 'Participer',
    links: [
      { href: '/atelier', label: 'L’Atelier — bande-annonce' },
      { href: '/create', label: 'Démarrer un film' },
      { href: '/work', label: 'Missions' },
      { href: '/academy', label: 'Academy' },
    ],
  },
  {
    title: 'Co-produire',
    links: [
      { href: '/invest', label: 'Devenir co-producteur' },
      { href: '/investors', label: 'Espace investisseurs' },
    ],
  },
  {
    title: 'CINEGENY',
    links: [
      { href: '/comment-ca-marche', label: 'Comment ça marche' },
      { href: '/about', label: 'À propos' },
      { href: '/roadmap', label: 'Roadmap' },
    ],
  },
]
