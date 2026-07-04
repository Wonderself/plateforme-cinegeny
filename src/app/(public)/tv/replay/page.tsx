'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Play,
  Search,
  Clock,
  Eye,
  Star,
  Filter,
  Tv,
  Crown,
  ArrowRight,
  CalendarDays,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ALL_TV_SHOWS, SHOWS_BY_GENRE, TV_GENRES, type TvShowData } from '@/data/tv-shows'

/* ── Genre badge color helper ── */

function genreColor(genre: string): string {
  const map: Record<string, string> = {
    'Talk Show': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'News Parody': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Sketch Comedy': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Late Night Comedy': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Reality Competition': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Drama Series': 'bg-red-500/20 text-red-300 border-red-500/30',
    Documentary: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Game Show': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Cooking Show': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Kids & Animation': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  }
  return map[genre] ?? 'bg-white/10 text-white/60 border-white/20'
}

/* ── Simulated "Just Aired" data ── */

interface AiredEpisode {
  show: TvShowData
  episodeTitle: string
  episodeNum: number
  airedAgo: string
  duration: number
  viewCount: number
}

function generateJustAired(): AiredEpisode[] {
  const airedLabels = [
    'Diffusé il y a 30 min', 'Diffusé il y a 1h', 'Diffusé il y a 2h', 'Diffusé il y a 3h', 'Diffusé il y a 5h',
    'Diffusé il y a 8h', 'Diffusé il y a 12h', 'Diffusé hier', 'Diffusé hier', 'Diffusé il y a 2 jours',
  ]
  return ALL_TV_SHOWS.slice(0, 10).map((show, i) => ({
    show,
    episodeTitle: `Épisode ${Math.floor(Math.random() * 40) + 1} : ${['Le début', 'Nouveaux horizons', 'Point de rupture', 'La boucle est bouclée', 'La révélation', 'Vérité cachée', 'Dernier combat', 'La marée monte', 'Croisée des chemins', 'Le retour'][i]}`,
    episodeNum: Math.floor(Math.random() * 40) + 1,
    airedAgo: airedLabels[i],
    duration: show.duration,
    viewCount: Math.floor(Math.random() * 50000) + 5000,
  }))
}

/* ── Most Replayed data ── */

function getMostReplayed(): (TvShowData & { replayViews: number })[] {
  return [...ALL_TV_SHOWS]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10)
    .map((show) => ({
      ...show,
      replayViews: Math.floor(show.viewCount * 0.6),
    }))
}

/* ── Main Component ── */

export default function TvReplayPage() {
  const [activeGenre, setActiveGenre] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const justAired = useMemo(() => generateJustAired(), [])
  const mostReplayed = useMemo(() => getMostReplayed(), [])

  const filteredShows = useMemo(() => {
    let shows = activeGenre === 'All' ? ALL_TV_SHOWS : (SHOWS_BY_GENRE[activeGenre] ?? [])
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      shows = shows.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          s.host.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    return shows
  }, [activeGenre, searchQuery])

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ─── A. HERO ─── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/[0.08] via-[#2563EB]/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#2563EB]/[0.06] blur-[150px] pointer-events-none" />
        <div className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 mb-6">
            <Tv className="h-4 w-4 text-[#2563EB]" />
            <span className="text-[#2563EB] text-sm font-medium">Replay CINEGENY TV</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">
            Replay — Rattrapez CINEGENY TV
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Vous avez manqué une série ? Regardez-la ici dans les 7 jours suivant sa diffusion.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 pb-20">
        {/* ─── B. JUST AIRED ROW ─── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Diffusé récemment
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-white/10">
            {justAired.map((ep, i) => (
              <div
                key={i}
                className="shrink-0 w-[320px] sm:w-[380px] rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden group hover:border-[#2563EB]/30 transition-all"
              >
                {/* 16:9 thumbnail area */}
                <div className="relative aspect-video bg-gradient-to-br from-[#0A1628] to-[#050A15]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tv className="h-10 w-10 text-white/10" />
                  </div>
                  {/* Aired badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/60 text-white/70 border-0 text-[10px] backdrop-blur-sm">
                      <Clock className="h-3 w-3 mr-1" /> {ep.airedAgo}
                    </Badge>
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-[#2563EB]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white/70 text-[10px]">
                    {ep.duration} min
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate group-hover:text-[#2563EB] transition-colors">
                    {ep.show.title}
                  </h3>
                  <p className="text-white/40 text-sm truncate mt-0.5">{ep.episodeTitle}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
                    <Badge className={`text-[9px] ${genreColor(ep.show.genre)}`}>{ep.show.genre}</Badge>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {ep.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => toast.info('Lecture du replay...')}
                    className="mt-3 w-full py-2 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-sm font-medium hover:bg-[#2563EB]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="h-3.5 w-3.5" /> Regarder le replay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── E. SEARCH ─── */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des séries, animateurs, genres..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#2563EB]/50 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Filter className="h-4 w-4" />
              <span>Filtrer par genre :</span>
            </div>
          </div>
        </section>

        {/* ─── C. BROWSE BY GENRE ─── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
            Parcourir par genre
          </h2>

          {/* Genre tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setActiveGenre('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeGenre === 'All'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              Tous
            </button>
            {TV_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeGenre === genre
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Show grid */}
          {filteredShows.length === 0 ? (
            <div className="text-center py-16">
              <Tv className="h-14 w-14 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">Aucune série ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {filteredShows.map((show) => (
                <div
                  key={show.id}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden group hover:border-[#2563EB]/30 transition-all"
                >
                  {/* Poster area */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#0A1628] to-[#050A15]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tv className="h-8 w-8 text-white/10" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <Badge className={`absolute top-2 left-2 text-[9px] ${genreColor(show.genre)}`}>
                      {show.genre}
                    </Badge>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#2563EB] transition-colors">
                      {show.title}
                    </h3>
                    <p className="text-white/30 text-xs mt-1">
                      {show.episodeCount} épisodes disponibles
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {show.rating >= 4.0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-yellow-400/70">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          {show.rating}
                        </span>
                      )}
                      <span className="text-[10px] text-white/20 flex items-center gap-0.5">
                        <Eye className="h-3 w-3" /> {(show.viewCount / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── D. MOST REPLAYED ─── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Les plus regardées en replay
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {mostReplayed.map((show, i) => (
              <div
                key={show.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 transition-all group"
              >
                {/* Rank */}
                <span className={`text-2xl font-bold shrink-0 w-8 text-center ${
                  i < 3 ? 'text-[#2563EB]' : 'text-white/20'
                }`}>
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold truncate group-hover:text-[#2563EB] transition-colors">
                    {show.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-[9px] ${genreColor(show.genre)}`}>{show.genre}</Badge>
                    <span className="text-[10px] text-white/30 flex items-center gap-0.5">
                      <Eye className="h-3 w-3" /> {show.replayViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400/70 text-[10px]">{show.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── F. PREMIUM NOTE ─── */}
        <section className="relative overflow-hidden rounded-2xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.08] via-[#2563EB]/[0.03] to-transparent p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/[0.06] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/25 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-[#2563EB]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                  Débloquez les archives complètes du replay
                </h2>
              </div>
              <p className="text-white/50 leading-relaxed max-w-lg">
                Les utilisateurs gratuits ont accès aux 3 derniers épisodes de chaque série. Passez à Premium
                pour l&apos;archive complète du replay avec tous les épisodes jamais diffusés sur CINEGENY TV.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-colors text-lg shrink-0"
            >
              <Crown className="h-5 w-5" />
              Passer à Premium
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
