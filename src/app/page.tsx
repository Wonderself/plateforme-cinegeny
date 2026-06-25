import { prisma } from '@/lib/prisma'
import { NetflixHome } from '@/components/netflix/netflix-home'
import { ALL_FILMS, FILMS_BY_GENRE } from '@/data/films'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CINEGENY — Create. Fund. Stream Your Films.',
  description:
    'The collaborative cinema platform powered by AI. Micro-tasks, streaming, independent film production. Paris, Jerusalem, Hollywood.',
  openGraph: {
    title: 'CINEGENY — The AI Cinema Studio',
    description: 'Create, fund, and stream films powered by 113 AI agents. Join the cinema revolution.',
    url: (process.env.NEXT_PUBLIC_APP_URL || 'https://platform.cinegeny.com').replace(/\/+$/, ''),
    siteName: 'CINEGENY',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CINEGENY — The AI Cinema Studio',
    description: 'Create, fund, and stream films powered by 113 AI agents.',
  },
  keywords: ['cinema IA', 'film participatif', 'production cinématographique', 'streaming', 'crowdfunding film', 'AI cinema', 'CINEGENY'],
}

async function getHomeData() {
  // ── Film showcase: canonical slate (src/data/films.ts) ──
  // Source of truth is the curated 6-film slate, identical to /films.
  // This keeps the homepage in sync with the catalogue and the official
  // posters regardless of the (legacy) database seed state.
  const slate = ALL_FILMS.map((f) => ({
    id: f.id,
    title: f.title,
    slug: f.slug,
    synopsis: f.synopsis,
    genre: f.genre,
    coverImageUrl: f.coverImageUrl,
    status: f.status,
    progressPct: f.progressPct,
    fundingPct: f.fundingPct,
    type: 'film' as const,
  }))

  // Hero = the most advanced productions first (highest progress), with poster.
  const heroFilms = [...slate]
    .filter((f) => f.coverImageUrl)
    .sort((a, b) => b.progressPct - a.progressPct)
    .slice(0, 5)
    .map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      synopsis: f.synopsis,
      genre: f.genre,
      coverImageUrl: f.coverImageUrl,
      status: f.status,
      type: 'film' as const,
    }))

  const genres = Object.fromEntries(
    Object.entries(FILMS_BY_GENRE)
      .filter(([, films]) => films.length > 0)
      .map(([genre, films]) => [
        genre,
        films.map((f) => ({
          id: f.id,
          title: f.title,
          slug: f.slug,
          genre: f.genre,
          coverImageUrl: f.coverImageUrl,
          status: f.status,
          progressPct: f.progressPct,
          fundingPct: f.fundingPct,
          type: 'film' as const,
        })),
      ])
  )

  const inProduction = slate.filter(
    (f) => f.status === 'IN_PRODUCTION' || f.status === 'POST_PRODUCTION'
  )
  const inDevelopment = slate.filter(
    (f) => f.status === 'DRAFT' || f.status === 'PRE_PRODUCTION'
  )
  const released = slate.filter((f) => f.status === 'RELEASED')

  // ── Streaming catalog (separate feature) — best-effort from DB ──
  type CatalogCard = {
    id: string
    title: string
    slug: string
    genre: string | null
    coverImageUrl: string | null
    status: string
    progressPct: number
    type: 'catalog'
  }
  let catalogFilms: CatalogCard[] = []
  try {
    const rows = await prisma.catalogFilm.findMany({
      where: { status: { in: ['LIVE', 'APPROVED'] } },
      orderBy: { viewCount: 'desc' },
      select: {
        id: true, title: true, slug: true, genre: true,
        thumbnailUrl: true, posterUrl: true, status: true,
      },
    })
    catalogFilms = rows.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      genre: f.genre,
      coverImageUrl: f.posterUrl || f.thumbnailUrl,
      status: f.status,
      progressPct: 0,
      type: 'catalog' as const,
    }))
  } catch {
    // DB unavailable — the slate above still renders the full homepage.
  }

  return {
    heroFilms,
    allFilms: slate,
    catalogFilms,
    genres,
    inProduction,
    inDevelopment,
    released,
  }
}

export default async function HomePage() {
  const data = await getHomeData()

  return <NetflixHome data={data} />
}
