import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HomeVitrine } from '@/components/home/home-vitrine'
import { ALL_FILMS, HERO_FILM_SLUG } from '@/data/films'
import { ARCHIVED_FILMS } from '@/data/archived-films'
import { buildHomeVitrineModel, type HomeFilmInput } from '@/lib/home-vitrine'
import { BRAND } from '@/content/brand'

export const dynamic = 'force-dynamic'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://platform.cinegeny.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'CINEGENY — Regardez. Votez. Le film se fait.',
  description: BRAND.launchLine,
  keywords: [
    'CINEGENY',
    'cinéma IA',
    'voter pour un film',
    'film participatif',
    'studio de cinéma',
    'Finale CINEGENY',
    'streaming',
  ],
  openGraph: {
    title: 'CINEGENY — Regardez. Votez. Le film se fait.',
    description: BRAND.pitchShort,
    url: APP_URL,
    siteName: 'CINEGENY',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CINEGENY — Regardez. Votez. Le film se fait.',
    description: BRAND.pitchShort,
  },
}

/**
 * Construit les entrées de la vitrine : slate officielle (contenu éditorial)
 * enrichie de l'id en base et du compteur de votes RÉEL (aucun chiffre inventé,
 * règle 15.0bis #1). Si la base est indisponible, on rend quand même la page
 * avec des compteurs à zéro et un repli « Voter » vers la fiche du film.
 */
async function getHomeInputs(): Promise<HomeFilmInput[]> {
  // Session 15.11 : tout le catalogue est en ligne (slate curée + archives).
  // L'accueil montre donc l'intégralité des films (abondance façon Netflix),
  // les compteurs de votes venant toujours de la base.
  const catalog = [...ALL_FILMS, ...ARCHIVED_FILMS]
  const slugs = catalog.map((f) => f.slug)

  const idBySlug = new Map<string, string>()
  const countByFilmId = new Map<string, number>()

  try {
    const dbFilms = await prisma.film.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    })
    for (const f of dbFilms) idBySlug.set(f.slug, f.id)

    const filmIds = dbFilms.map((f) => f.id)
    if (filmIds.length > 0) {
      // Compteur public = votes CONFIRMÉS uniquement (15.0 #5, cf. votes.ts).
      const grouped = await prisma.filmVote.groupBy({
        by: ['filmId'],
        where: { filmId: { in: filmIds }, voteType: 'vote', confirmed: true },
        _count: { _all: true },
      })
      for (const g of grouped) countByFilmId.set(g.filmId, g._count._all)
    }
  } catch {
    // Base indisponible (build/preview) — la vitrine reste rendue.
  }

  return catalog.map((film) => {
    const filmId = idBySlug.get(film.slug) ?? null
    return {
      film,
      filmId,
      voteCount: filmId ? (countByFilmId.get(filmId) ?? 0) : 0,
    }
  })
}

export default async function HomePage() {
  const inputs = await getHomeInputs()
  const model = buildHomeVitrineModel(inputs, HERO_FILM_SLUG)

  return (
    <div className="min-h-screen bg-[#0A0908] text-white">
      <Header />
      {model && <HomeVitrine model={model} />}
      <Footer />
    </div>
  )
}
