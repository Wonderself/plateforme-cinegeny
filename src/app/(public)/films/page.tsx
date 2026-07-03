import { Clapperboard, Film, CheckCircle, Users } from 'lucide-react'
import { getCached } from '@/lib/redis'
import FilmCategories from '@/components/films/film-categories'
import { ALL_FILMS } from '@/data/films'
import { ARCHIVED_FILMS } from '@/data/archived-films'
import { prisma } from '@/lib/prisma'
import { buildCatalogModel, type CatalogFilmInput } from '@/lib/films-catalog'
import { MotionCard } from '@/components/ui/motion'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Films — CINEGENY',
  description:
    'Découvrez la slate CINEGENY : nos films en production, créés collaborativement par notre communauté de co-producteurs.',
  openGraph: {
    title: 'Films — CINEGENY',
    description: 'La slate CINEGENY — films en production.',
  },
}

async function getHeroStats() {
  return getCached(
    'films:hero-stats',
    async () => {
      try {
        const [tasksCount, contributorsCount] = await Promise.all([
          prisma.task.count(),
          prisma.user.count({ where: { isVerified: true } }),
        ])
        return { tasksCount, contributorsCount }
      } catch {
        return { tasksCount: 0, contributorsCount: 0 }
      }
    },
    300
  )
}

/**
 * Catalogue complet servi au client : la slate officielle + les archives
 * (legacy) réactivées par l'admin (`/admin/films-catalog`, `CatalogActivation`
 * en base) — même périmètre que l'ancien `useLiveCatalog`, désormais résolu
 * côté serveur pour pouvoir brancher les compteurs de votes réels (15.5).
 */
async function getCatalogInputs(): Promise<CatalogFilmInput[]> {
  let activeArchivedSlugs = new Set<string>()
  try {
    const rows = await prisma.catalogActivation.findMany({ where: { active: true }, select: { slug: true } })
    activeArchivedSlugs = new Set(rows.map((r) => r.slug))
  } catch {
    // Base indisponible — catalogue réduit à la slate officielle.
  }

  const films = [...ALL_FILMS, ...ARCHIVED_FILMS.filter((f) => activeArchivedSlugs.has(f.slug))]
  const slugs = films.map((f) => f.slug)

  const idBySlug = new Map<string, string>()
  const statusBySlug = new Map<string, string>()
  const countByFilmId = new Map<string, number>()

  try {
    const dbFilms = await prisma.film.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true, status: true },
    })
    for (const f of dbFilms) {
      idBySlug.set(f.slug, f.id)
      statusBySlug.set(f.slug, f.status)
    }

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
    // Base indisponible — le catalogue reste rendu, compteurs à zéro.
  }

  return films.map((film) => {
    const filmId = idBySlug.get(film.slug) ?? null
    return {
      film,
      filmId,
      legacyStatus: filmId ? (statusBySlug.get(film.slug) ?? film.status) : film.status,
      voteCount: filmId ? (countByFilmId.get(filmId) ?? 0) : 0,
    }
  })
}

export default async function FilmsPage() {
  const [heroStats, catalogInputs] = await Promise.all([getHeroStats(), getCatalogInputs()])
  const catalogModel = buildCatalogModel(catalogInputs)

  const stats = [
    { label: 'Films', value: ALL_FILMS.length, icon: Film },
    { label: 'Tâches', value: heroStats.tasksCount, icon: CheckCircle },
    { label: 'Contributeurs', value: heroStats.contributorsCount, icon: Users },
  ]

  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent px-6 pb-20 pt-28 sm:px-10 md:px-16 lg:px-20">
        {/* Ambient blur circles */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-[#C9A227]/[0.05] blur-[120px]" />
          <div className="absolute right-1/4 top-10 h-80 w-80 rounded-full bg-[#C9A227]/[0.04] blur-[100px]" />
          <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-[#E11D2A]/[0.03] blur-[110px]" />
        </div>

        <div className="relative container mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-4 py-1.5 text-sm text-[#E8C766]">
            <Clapperboard className="h-4 w-4" />
            <span className="font-medium">Nos Productions</span>
          </div>

          {/* Title */}
          <h1 className="mb-8 font-playfair text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            La <span className="text-gold-metallic">Slate</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-white/50">
            Nos productions cinématographiques, créées collaborativement par notre communauté de
            co-producteurs.
          </p>

          {/* Stats row */}
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-3 sm:gap-6 md:gap-10">
            {stats.map((stat, i) => (
              <MotionCard
                key={stat.label}
                delay={i * 0.12}
                className="group hover-lift rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-center transition-colors duration-500 hover:border-[#C9A227]/30 hover:bg-white/[0.05] sm:rounded-3xl sm:p-6"
              >
                <div className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#C9A227]/50 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.25)]">
                  <stat.icon className="h-4 w-4 text-[#C9A227]" />
                </div>
                <div className="text-2xl font-bold text-[#E8C766] sm:text-3xl">
                  {stat.value > 0 ? stat.value.toLocaleString('fr-FR') : '--'}
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/40 sm:text-xs">
                  {stat.label}
                </div>
              </MotionCard>
            ))}
          </div>
        </div>

        {/* Bottom fade separator */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#C9A227]/25 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* CATALOG (curated slate + admin-activated archives)               */}
      {/* ================================================================ */}
      <FilmCategories model={catalogModel} />
    </div>
  )
}
