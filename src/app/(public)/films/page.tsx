import { Clapperboard, Film, CheckCircle, Users } from 'lucide-react'
import { getCached } from '@/lib/redis'
import FilmCategories from '@/components/films/film-categories'
import { ALL_FILMS } from '@/data/films'
import { prisma } from '@/lib/prisma'
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

export default async function FilmsPage() {
  const heroStats = await getHeroStats()

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
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-center transition-all duration-500 hover:border-[#C9A227]/20 sm:rounded-3xl sm:p-6"
              >
                <div className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/10">
                  <stat.icon className="h-4 w-4 text-[#C9A227]" />
                </div>
                <div className="text-2xl font-bold text-[#E8C766] sm:text-3xl">
                  {stat.value > 0 ? stat.value.toLocaleString('fr-FR') : '--'}
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/40 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade separator */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#C9A227]/25 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* CATALOG (curated slate + admin-activated archives)               */}
      {/* ================================================================ */}
      <FilmCategories />
    </div>
  )
}
