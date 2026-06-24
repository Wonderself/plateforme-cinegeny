/**
 * Shared film data for the CINEGENY slate.
 * Used by the homepage (netflix-home), film detail fallback, and any page
 * that needs to reference the catalog when the DB has no entries.
 */

/* ── Types ── */

export interface FilmData {
  id: string
  title: string
  slug: string
  genre: string
  synopsis: string
  director: string
  cast: string[]
  duration: string
  year: number
  rating: string
  tags: string[]
  coverImageUrl: string | null
  status: string
  progressPct: number
  fundingPct: number
  isPipeline?: boolean
  /** True when the film belongs to the archived (legacy) catalog */
  archived?: boolean
}

/* ── Named posters (films with real images) ── */

export const NAMED_POSTERS: Record<string, string> = {
  'The Artists': '/posters/the-artists.png',
  'Le portrait de Oscar Wilde': '/posters/oscar-wilde.png',
  'Les souffrances du jeune Goethe': '/posters/jeune-goethe.png',
  'Le voyage dans la Lune': '/posters/voyage-dans-la-lune.png',
  'Le dictionnaire de Voltaire': '/posters/dictionnaire-voltaire.png',
  'Le Dernier Convoi': '/posters/last-train.jpg',
}

/* ── Genre order (only genres with films) ── */

export const GENRE_ORDER = ['Drama', 'Sci-Fi', 'Historical', 'Animation'] as const

/* ── Slug helper ── */

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/* ── The CINEGENY slate ── */

const SLATE: Omit<FilmData, 'id' | 'slug' | 'coverImageUrl'>[] = [
  {
    title: 'Le portrait de Oscar Wilde',
    genre: 'Drama',
    synopsis:
      "Génie de l'esprit et martyr de son époque, Oscar Wilde fascine et scandalise le Londres victorien. Un portrait flamboyant de l'écrivain le plus spirituel — et le plus provocateur — de son siècle, de sa gloire à sa chute.",
    director: 'Eric Haldezos',
    cast: ['Un film de Emmanuel Smadja'],
    duration: '2h 04min',
    year: 2026,
    rating: 'PG-13',
    tags: ['biopic', 'littérature', 'époque victorienne', 'Oscar Wilde'],
    status: 'IN_PRODUCTION',
    progressPct: 55,
    fundingPct: 70,
    isPipeline: true,
  },
  {
    title: 'Les souffrances du jeune Goethe',
    genre: 'Drama',
    synopsis:
      "D'après le chef-d'œuvre de J.W. von Goethe. Un jeune homme se consume d'un amour impossible pour une femme déjà promise. L'amour, la folie, l'éternité : une adaptation cinématographique éblouissante.",
    director: 'Ludovic Clermont',
    cast: ["D'après J.W. von Goethe"],
    duration: '2h 10min',
    year: 2026,
    rating: 'PG-13',
    tags: ['romantisme', 'adaptation', 'amour', 'Goethe'],
    status: 'PRE_PRODUCTION',
    progressPct: 20,
    fundingPct: 45,
    isPipeline: true,
  },
  {
    title: 'Le voyage dans la Lune',
    genre: 'Sci-Fi',
    synopsis:
      "Le premier film de science-fiction de l'histoire, ré-imaginé pour notre époque. L'épopée d'un explorateur visionnaire qui défie l'impossible pour atteindre la Lune. Sortie prochainement.",
    director: 'Frédéric Noël',
    cast: ['Jean Dupont', 'Sophie Marie', 'Pierre-Luc Leroy', 'Marie Glaude'],
    duration: '2h 02min',
    year: 2026,
    rating: 'PG',
    tags: ['science-fiction', 'aventure', 'espace', 'Les Films de l\'Akyme'],
    status: 'PRE_PRODUCTION',
    progressPct: 30,
    fundingPct: 25,
    isPipeline: true,
  },
  {
    title: 'Le dictionnaire de Voltaire',
    genre: 'Historical',
    synopsis:
      "Une satire épique sur Voltaire et son combat des Lumières. Armé de sa plume et de son ironie, le philosophe affronte l'obscurantisme de son temps dans une fresque mordante et flamboyante.",
    director: 'François Laroche',
    cast: ['Une satire épique'],
    duration: '1h 58min',
    year: 2026,
    rating: 'PG-13',
    tags: ['Lumières', 'satire', 'historique', 'Voltaire'],
    status: 'IN_PRODUCTION',
    progressPct: 40,
    fundingPct: 60,
    isPipeline: true,
  },
  {
    title: 'Le Dernier Convoi',
    genre: 'Historical',
    synopsis:
      "Août 1944 : alors que Paris est sur le point d'être libéré, un dernier train quitte Bobigny vers les camps. À travers les destins croisés de déportés, de résistants et de cheminots, ce docu-drama reconstitue les dernières heures d'une tragédie historique basée sur des témoignages réels.",
    director: 'Eric Haldezos',
    cast: ['Docu-drama'],
    duration: '1h 52min',
    year: 2026,
    rating: 'PG-13',
    tags: ['docu-drama', 'Shoah', 'histoire', 'résistance'],
    status: 'PRE_PRODUCTION',
    progressPct: 15,
    fundingPct: 20,
    isPipeline: true,
  },
  {
    title: 'The Artists',
    genre: 'Animation',
    synopsis:
      "Un petit garçon donne vie à ses dessins : une bande de petits monstres hauts en couleur s'échappe de sa feuille et devient les artistes les plus déjantés du monde. Une fable tendre sur l'imagination et la création.",
    director: 'Eric Haldezos',
    cast: ['Produit par Emmanuel Smadja', 'Curator & IA : Daniel Siboni'],
    duration: '1h 35min',
    year: 2026,
    rating: 'PG',
    tags: ['animation', 'famille', 'imagination', 'CINEGENY'],
    status: 'POST_PRODUCTION',
    progressPct: 100,
    fundingPct: 100,
    isPipeline: true,
  },
]

/* ── Build catalog ── */

function buildCatalog(): {
  all: FilmData[]
  byGenre: Record<string, FilmData[]>
  bySlug: Record<string, FilmData>
} {
  const all: FilmData[] = []
  const byGenre: Record<string, FilmData[]> = {}
  const bySlug: Record<string, FilmData> = {}

  SLATE.forEach((entry, i) => {
    const slug = toSlug(entry.title)
    const film: FilmData = {
      ...entry,
      id: `slate-${i}`,
      slug,
      coverImageUrl: NAMED_POSTERS[entry.title] ?? null,
    }
    all.push(film)
    bySlug[slug] = film
    ;(byGenre[entry.genre] ||= []).push(film)
  })

  return { all, byGenre, bySlug }
}

const catalog = buildCatalog()

export const ALL_FILMS = catalog.all
export const FILMS_BY_GENRE = catalog.byGenre
export const FILMS_BY_SLUG = catalog.bySlug

/** The production-slate films — displayed prominently in the UI */
export const PIPELINE_FILMS = catalog.all.filter((f) => f.isPipeline)
