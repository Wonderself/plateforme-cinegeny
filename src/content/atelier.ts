// ─────────────────────────────────────────────────────────────────────────────
// CINEGENY — ATELIER BANDE-ANNONCE & FILMS (source de vérité)
//
// L'Atelier relie la plateforme de vote à l'outil de création de bandes-
// annonces (dépôt séparé `wonderself/bande-annonce`, app « Mini Studio » : storyboard,
// plans, moteurs vidéo IA). Deux dépôts, deux déploiements, une seule
// expérience : l'outil est ouvert depuis ici via `NEXT_PUBLIC_TRAILER_TOOL_URL`.
//
// Ce fichier centralise aussi la RÈGLE DE FORMAT des films soumis :
// 10 minutes minimum, 1 h 00 maximum. Toute surface (formulaire, validation
// serveur, pages) doit puiser ces bornes ICI et nulle part ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

/* ── Règle de format des films ────────────────────────────────────────────── */

export const FILM_DURATION = {
  /** Durée minimale d'un film soumis (minutes). */
  minMinutes: 10,
  /** Durée maximale d'un film soumis (minutes). */
  maxMinutes: 60,
  /** Libellé canonique, à afficher tel quel (espaces insécables dans « 1 h 00 »). */
  label: '10 minutes minimum — 1 h 00 maximum',
  /** Explication grand public de la règle. */
  rule:
    'Les films diffusés sur CINEGENY durent entre 10 minutes et 1 h 00. ' +
    'En dessous, c’est une bande-annonce ; au-dessus, le film ne peut pas ' +
    'entrer en compétition.',
} as const

export const FILM_DURATION_MIN_SECONDS = FILM_DURATION.minMinutes * 60
export const FILM_DURATION_MAX_SECONDS = FILM_DURATION.maxMinutes * 60

/** Vérifie qu'une durée (en secondes) respecte le format CINEGENY. */
export function isValidFilmDuration(seconds: number): boolean {
  return (
    Number.isFinite(seconds) &&
    seconds >= FILM_DURATION_MIN_SECONDS &&
    seconds <= FILM_DURATION_MAX_SECONDS
  )
}

/* ── L'outil de création (app bande-annonce, dépôt séparé) ────────────────── */

/**
 * URL publique de l'outil de création de bandes-annonces (déploiement de
 * `wonderself/bande-annonce`). Si absente, l'Atelier retombe sur le studio
 * interne `/mini-studio` : le parcours reste complet dans les deux cas.
 */
export const TRAILER_TOOL_URL = process.env.NEXT_PUBLIC_TRAILER_TOOL_URL || ''

/** L'outil externe est-il branché ? (déploiement du Mini Studio configuré) */
export const TRAILER_TOOL_IS_EXTERNAL = TRAILER_TOOL_URL.length > 0

/** Destination du bouton « Créer » de l'Atelier. */
export const TRAILER_TOOL_HREF = TRAILER_TOOL_IS_EXTERNAL
  ? TRAILER_TOOL_URL
  : '/mini-studio'

/* ── Wording de l'Atelier ─────────────────────────────────────────────────── */

export const ATELIER = {
  name: 'L’Atelier',
  href: '/atelier',
  title: 'Créez la bande-annonce. Le public lance le film.',
  tagline:
    'Travaillez votre bande-annonce plan par plan avec nos moteurs vidéo IA, ' +
    'ou insérez directement celle que vous avez déjà. À 5 000 votes, votre ' +
    'film part en production.',
  /** Les deux portes d'entrée de l'Atelier. */
  paths: {
    create: {
      title: 'Créer avec le Mini Studio',
      description:
        'Le Mini Studio vous accompagne du script au montage : structure ' +
        'narrative, storyboard, moodboard, puis génération de chaque plan ' +
        'avec les meilleurs moteurs vidéo IA (Veo, Kling, Seedance). ' +
        'Vous gardez la main sur chaque image.',
      cta: 'Ouvrir le Mini Studio',
    },
    insert: {
      title: 'Insérer votre création',
      description:
        'Vous avez déjà votre bande-annonce ou votre film ? Insérez-le ' +
        'directement : il rejoint la compétition et la communauté vote. ' +
        'Vous gagnez de l’argent à chaque vue une fois le film en ligne.',
      cta: 'Insérer ma bande-annonce ou mon film',
    },
  },
} as const
