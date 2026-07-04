'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Tv, Star, Users, Clock, Play, Plus, ChevronRight, ChevronLeft,
  Tag, Crown, Coins, ArrowRight, Shield, MonitorPlay, Calendar,
  Heart, Briefcase, Film, Clapperboard,
  Eye, TrendingUp, Bookmark, Camera, Mic2, Laugh, X,
} from 'lucide-react'
import { ALL_TV_SHOWS, SHOWS_BY_GENRE } from '@/data/tv-shows'
import type { TvShowData } from '@/data/tv-shows'
import { SocialShare } from '@/components/social-share'
import { VideoPlayerWrapper } from '@/components/streaming/video-player-wrapper'
import { TvVoteButton } from '@/components/tv/tv-vote-button'

/* ── Episode title templates by genre ── */
const EPISODE_TITLES: Record<string, string[]> = {
  'Talk Show': ['Monologue d\'ouverture', 'Le coup de gueule', 'Invité à l\'honneur', 'Plongée en profondeur', 'Le débat', 'Questions des fans', 'Panel d\'experts', 'La révélation', 'Tendance du moment', 'Final de saison', 'Dans les coulisses', 'Courrier des téléspectateurs'],
  'News Parody': ['Bug d\'actualité', 'Les gros titres', 'IA contre réalité', 'Vrai ou faux', 'La salle de com\'', 'Le monde de demain', 'Guerre éditoriale', 'Le rectificatif', 'Reportage spécial', 'Rétrospective de l\'année', 'En direct du terrain', 'Scoop exclusif'],
  'Sketch Comedy': ['Ouverture surprise', 'Chaos de personnages', 'L\'imitation', 'La technologie qui déraille', 'Le malentendu', 'Frasques de bureau', 'Le pitch', 'Soirée entre amis', 'Les retrouvailles', 'Spécial bêtisier', 'Favoris des fans', 'Rafale de sketchs'],
  'Late Night Comedy': ['Le monologue', 'Segment au bureau', 'Discussion avec une célébrité', 'Le sketch', 'Jeux avec le public', 'Invité musical', 'Le coup de gueule', 'Labo de fin de soirée', 'Le défi', 'Le meilleur de', 'Sans script', 'Demandes des téléspectateurs'],
  'Reality Competition': ['Auditions', 'Premier défi', 'Bataille d\'équipes', 'Soir d\'élimination', 'Rebondissements', 'Le retour', 'Demi-finales', 'Carte surprise', 'La confrontation', 'Grande finale', 'Spécial retrouvailles', 'Dans les coulisses'],
  'Drama Series': ['Pilote', 'La mise en place', 'Révélations', 'Point de rupture', 'Les retombées', 'Le tournant', 'Sombres secrets', 'L\'alliance', 'Point de non-retour', 'Final de saison', 'Les conséquences', 'Nouveaux horizons'],
  Documentary: ['Origines', 'La découverte', 'Mondes cachés', 'Voix', 'Les preuves', 'Forces invisibles', 'Les archives', 'Une avancée décisive', 'L\'héritage', 'Le dernier chapitre', 'Épilogue', 'Version du réalisateur'],
  'Game Show': ['Manche 1', 'Quitte ou double', 'La carte surprise', 'Manche rapide', 'Défi d\'équipe', 'L\'épreuve ultime', 'Manche bonus', 'Tout ou rien', 'Championnat', 'Le grand prix', 'Phase de tournoi', 'La revanche'],
  'Cooking Show': ['Mise en place', 'L\'ingrédient secret', 'Sous pression', 'Défi fusion', 'De la ferme à l\'assiette', 'Tentation sucrée', 'Les critiques', 'Cuisine de rue', 'Le plat maître', 'Le festin', 'Spécial fêtes', 'Boîte mystère'],
  'Kids & Animation': ['Un nouvel ami', 'L\'aventure commence', 'Pouvoirs cachés', 'Le mystère', 'Unis pour gagner', 'La grande course', 'Perdu et retrouvé', 'La tempête', 'Les héros s\'unissent', 'La grande fête', 'Le monde des rêves', 'Mission spéciale'],
}

/* ── Unsplash thumbnails for episodes ── */
const EPISODE_THUMBS = [
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1518676590747-1e3dcf5a0e32?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=400&h=225&q=80',
]

/* ── Poster URLs ── */
const POSTER_URLS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1685910715615-577928e2450e?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1563905463861-7d77975b3a44?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1576238956869-2098f3d26eb2?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&h=1200&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&h=1200&q=80',
]

function getShowPoster(show: TvShowData): string {
  if (show.coverImageUrl) return show.coverImageUrl
  const idx = ALL_TV_SHOWS.indexOf(show)
  return POSTER_URLS[Math.abs(idx) % POSTER_URLS.length]
}

/* ── Status display ── */
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  ongoing: { label: 'En diffusion', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/25' },
  upcoming: { label: 'En développement', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/25' },
  completed: { label: 'Terminée', color: 'text-white/40', bg: 'bg-white/[0.06] border-white/10' },
}

/* ── Generate simulated episodes ── */
function generateEpisodes(show: TvShowData, season: number) {
  const genreTitles = EPISODE_TITLES[show.genre] || EPISODE_TITLES['Drama Series']
  const epsInSeason = Math.min(Math.ceil(show.episodeCount / Math.max(1, Math.ceil(show.episodeCount / 12))), 13)
  const totalSeasons = Math.max(1, Math.ceil(show.episodeCount / epsInSeason))
  const actualSeason = Math.min(season, totalSeasons)
  const startEp = (actualSeason - 1) * epsInSeason
  const count = actualSeason === totalSeasons ? show.episodeCount - startEp : epsInSeason
  const now = new Date()

  return Array.from({ length: Math.max(1, Math.min(count, 13)) }, (_, i) => {
    const epNum = i + 1
    const titleIdx = i % genreTitles.length
    const airDate = new Date(show.premiered)
    airDate.setDate(airDate.getDate() + ((actualSeason - 1) * epsInSeason + i) * 7)
    const isReleased = airDate <= now

    return {
      id: `${show.id}-s${actualSeason}e${epNum}`,
      episode: epNum,
      season: actualSeason,
      title: `Épisode ${epNum} : ${genreTitles[titleIdx]}`,
      duration: `${show.duration} min`,
      airDate: airDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      thumbnail: EPISODE_THUMBS[(startEp + i) % EPISODE_THUMBS.length],
      isReleased,
    }
  })
}

function getSeasonCount(show: TvShowData): number {
  const epsPerSeason = Math.min(Math.ceil(show.episodeCount / Math.max(1, Math.ceil(show.episodeCount / 12))), 13)
  return Math.max(1, Math.ceil(show.episodeCount / epsPerSeason))
}

/* ── Deterministic hash helper ── */
function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i)
  return Math.abs(h)
}

/* ── Simulated reviews (deterministic — same slug = same reviews) ── */
function generateReviews(show: TvShowData) {
  const REVIEWER_POOL = [
    'Alex M.', 'Jordan K.', 'Taylor S.', 'Morgan W.', 'Casey R.',
    'Riley B.', 'Quinn T.', 'Avery L.', 'Blake N.', 'Drew P.',
  ]
  const MONTH_POOL = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.']
  const comments = [
    `Complètement accro à ${show.title} ! L'écriture est phénoménale.`,
    'Une des meilleures séries de la plateforme. Chaque épisode nous tient en haleine.',
    `${show.host} apporte une énergie incroyable à cette série. À voir absolument.`,
    'La qualité de production est bluffante pour une série générée par IA. Je recommande vivement.',
    'J\'ai commencé à regarder par curiosité, maintenant je ne peux plus m\'arrêter. Le final de saison était bluffant.',
  ]
  const base = hashCode(show.slug)
  return Array.from({ length: 5 }, (_, i) => {
    const seed = hashCode(`${show.slug}-review-${i}`)
    return {
      name: REVIEWER_POOL[(base + i * 3) % REVIEWER_POOL.length],
      rating: Number((3.5 + ((seed + i * 7) % 15) / 10).toFixed(1)),
      comment: comments[i],
      date: `${MONTH_POOL[(base + i * 2) % MONTH_POOL.length]} 2025`,
    }
  })
}

/* ── Cast avatar colors ── */
const CAST_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-violet-500',
]

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function TvShowDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const show = ALL_TV_SHOWS.find(s => s.slug === slug)

  const [selectedSeason, setSelectedSeason] = useState(1)
  const [showPlayer, setShowPlayer] = useState(false)
  const [activeEpisodesTab, setActiveEpisodesTab] = useState<'episodes' | 'bonus'>('episodes')

  /* ── Favorites + approval bar state ── */
  const [voteUp, setVoteUp] = useState(0)
  const [voteDown, setVoteDown] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (!show) return
    try {
      // Seed approval bar with deterministic fake votes (TvVoteButton handles actual voting)
      const stored = localStorage.getItem(`cinegen-tv-vote-${show.slug}`)
      if (stored) {
        const parsed = JSON.parse(stored) as { vote: 'up' | 'down' | null; up: number; down: number }
        setVoteUp(parsed.up)
        setVoteDown(parsed.down)
      } else {
        const baseUp = Math.floor(show.viewCount / 120)
        const baseDown = Math.floor(show.viewCount / 800)
        setVoteUp(baseUp)
        setVoteDown(baseDown)
      }
      const fav = localStorage.getItem(`cinegen-fav-${show.slug}`)
      if (fav === 'true') setIsFavorited(true)
    } catch { /* SSR safety */ }
  }, [show?.slug, show?.viewCount])

  const toggleFavorite = useCallback(() => {
    if (!show) return
    setIsFavorited(prev => {
      const next = !prev
      try { localStorage.setItem(`cinegen-fav-${show.slug}`, String(next)) } catch { /* noop */ }
      if (next) {
        toast.success('Ajouté aux favoris')
      } else {
        toast.info('Retiré des favoris')
      }
      return next
    })
  }, [show])

  /* ── Document title ── */
  useEffect(() => {
    if (!show) return
    document.title = `${show.title} — CINEGENY TV`
  }, [show?.title])

  /* ── Not found ── */
  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050A15' }}>
        <div className="text-center">
          <Tv className="h-16 w-16 mx-auto mb-4 text-white/20" />
          <h1 className="text-2xl font-bold text-white mb-2">Série introuvable</h1>
          <p className="text-white/40 mb-6">La série que vous recherchez n&apos;existe pas.</p>
          <Link href="/tv/shows" className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold text-sm transition-colors">
            Parcourir toutes les séries
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = STATUS_MAP[show.status] || STATUS_MAP.completed
  const seasonCount = getSeasonCount(show)
  const episodes = generateEpisodes(show, selectedSeason)
  const similarShows = (SHOWS_BY_GENRE[show.genre] || []).filter(s => s.slug !== show.slug).slice(0, 6)
  const reviews = generateReviews(show)
  const viewersPct = Math.min(100, Math.round((show.viewCount / 700000) * 100))

  // Simulated funding data
  const fundingPct = show.fundingPct ?? (((ALL_TV_SHOWS.indexOf(show) * 13 + 25) % 70) + 20)
  const fundingAmount = Math.round(fundingPct * 1200)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.title,
    description: show.synopsis,
    genre: show.genre,
    image: show.coverImageUrl,
    url: `https://cinegen.studio/tv/shows/${show.slug}`,
    numberOfSeasons: show.seasons,
    numberOfEpisodes: show.episodeCount,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGENY Studio',
      url: 'https://cinegen.studio',
    },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050A15' }}>

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ════════════════════════════════════════════════════════════
          BREADCRUMB NAV
         ════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-[#050A15]/90 backdrop-blur-md border-b border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-6 sm:px-10 md:px-16 py-3 flex items-center gap-2 text-xs text-white/40">
          <Link href="/tv" className="hover:text-[#2563EB] transition-colors">CINEGENY TV</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tv/shows" className="hover:text-[#2563EB] transition-colors">Séries</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/60 truncate max-w-[200px]">{show.title}</span>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          HERO
         ════════════════════════════════════════════════════════════ */}
      <section className="relative h-[52vh] min-h-[420px] overflow-hidden">
        {/* Background poster */}
        <Image
          src={getShowPoster(show)}
          alt={show.title}
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] via-[#050A15]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A15]/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-10 left-0 right-0 px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="container mx-auto max-w-6xl">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30 font-semibold">
                {show.genre}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/50 bg-white/[0.06] rounded-full px-2.5 py-1 border border-white/10">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                {show.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/50 bg-white/[0.06] rounded-full px-2.5 py-1 border border-white/10">
                <Eye className="h-3 w-3" />
                {(show.viewCount / 1000).toFixed(0)}k vues
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {show.title}
            </h1>

            {/* Synopsis */}
            <p className="text-white/60 text-base sm:text-lg max-w-3xl mb-4 leading-relaxed line-clamp-3">
              {show.synopsis}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-white/40 mb-6 flex-wrap">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {show.host}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {show.premiered}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {show.duration} min/ép</span>
              <span className="flex items-center gap-1.5"><Tv className="h-3.5 w-3.5" /> {show.episodeCount} épisodes</span>
              <span className="flex items-center gap-1.5"><Film className="h-3.5 w-3.5" /> {seasonCount} saison{seasonCount > 1 ? 's' : ''}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowPlayer(p => !p)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold text-sm transition-colors shadow-lg shadow-[#2563EB]/20"
              >
                <Play className="h-4 w-4 fill-white" />
                {showPlayer ? 'Fermer le lecteur' : 'Regarder le dernier épisode'}
              </button>
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${
                  isFavorited
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-rose-400' : ''}`} />
                {isFavorited ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
              </button>
              <SocialShare
                url={typeof window !== 'undefined' ? window.location.href : `/tv/shows/${show.slug}`}
                title={show.title}
                description={show.synopsis}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          VIDEO PLAYER — shown when Watch Latest Episode is clicked
         ════════════════════════════════════════════════════════════ */}
      {showPlayer && (
        <div className="bg-black/80 border-y border-[#2563EB]/20">
          <div className="container mx-auto max-w-6xl px-6 sm:px-10 md:px-16 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  En lecture — {show.title}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Saison {selectedSeason} · Dernier épisode
                </p>
              </div>
              <button
                onClick={() => setShowPlayer(false)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/10"
              >
                <X className="h-4 w-4" />
                Fermer
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#2563EB]/20 shadow-2xl shadow-[#2563EB]/10">
              <VideoPlayerWrapper
                filmId={show.id}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster={show.coverImageUrl || undefined}
                title={`${show.title} — Dernier épisode`}
                className="w-full aspect-video"
              />
            </div>
            <p className="text-[11px] text-white/20 mt-3 text-center">
              Lecteur de démonstration — le streaming complet des épisodes est disponible avec un abonnement CINEGENY
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-6 sm:px-10 md:px-16 py-14 space-y-14">

        {/* ════════════════════════════════════════════════════════════
            VOTING SECTION
           ════════════════════════════════════════════════════════════ */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Notez cette série</h3>
              <p className="text-sm text-white/40">Votre vote contribue à façonner l&apos;avenir de {show.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <TvVoteButton
                showSlug={show.slug}
                initialUpVotes={voteUp}
                initialDownVotes={voteDown}
              />
              {/* Approval bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-500"
                    style={{ width: `${voteUp + voteDown > 0 ? Math.round((voteUp / (voteUp + voteDown)) * 100) : 50}%` }}
                  />
                </div>
                <span className="text-xs text-[#2563EB] font-medium">
                  {voteUp + voteDown > 0 ? Math.round((voteUp / (voteUp + voteDown)) * 100) : 50}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            EPISODES / BONUS TABS
           ════════════════════════════════════════════════════════════ */}
        <section>
          {/* Tab bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
              <button
                onClick={() => setActiveEpisodesTab('episodes')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeEpisodesTab === 'episodes'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Épisodes
              </button>
              <button
                onClick={() => setActiveEpisodesTab('bonus')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeEpisodesTab === 'bonus'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <span>Bonus</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2563EB]/30 text-[#60A5FA] font-bold">3</span>
              </button>
            </div>

            {/* Season selector — only visible on Episodes tab */}
            {activeEpisodesTab === 'episodes' && seasonCount > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto">
                {Array.from({ length: seasonCount }, (_, i) => i + 1).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedSeason === s
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white/[0.06] text-white/50 hover:bg-white/10 border border-white/[0.06]'
                    }`}
                  >
                    S{s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Episodes grid ── */}
          {activeEpisodesTab === 'episodes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#2563EB]/20 transition-all duration-300 group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={ep.thumbnail}
                      alt={ep.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {ep.isReleased ? (
                        <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg shadow-[#2563EB]/30">
                          <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-white/70 bg-black/50 rounded-full px-3 py-1.5">Bientôt disponible</span>
                      )}
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 text-[10px] font-medium text-white bg-black/60 rounded px-1.5 py-0.5">
                      {ep.duration}
                    </div>
                    {/* Season-episode badge */}
                    <div className="absolute top-2 left-2 text-[10px] font-semibold text-white/80 bg-[#2563EB]/70 rounded px-1.5 py-0.5">
                      S{ep.season}E{ep.episode}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                      {ep.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/30">{ep.airDate}</span>
                      {ep.isReleased ? (
                        <span className="text-[10px] font-medium text-[#2563EB]">Regarder</span>
                      ) : (
                        <span className="text-[10px] font-medium text-white/25">À venir</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Bonus content ── */}
          {activeEpisodesTab === 'bonus' && (
            <div className="space-y-6">
              <p className="text-sm text-white/40 -mt-2">
                Contenu exclusif des coulisses réservé aux abonnés de {show.title}.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {/* Card 1 — Behind the Scenes */}
                <div className="group rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/[0.04] overflow-hidden hover:border-[#2563EB]/40 hover:bg-[#2563EB]/[0.07] transition-all duration-300">
                  <div className="relative aspect-video bg-gradient-to-br from-[#0F1E40] to-[#050A15] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
                    <Camera className="h-12 w-12 text-[#2563EB]/40 group-hover:text-[#2563EB]/70 transition-colors duration-300" />
                    <div className="absolute top-2 left-2 text-[10px] font-semibold text-white/80 bg-[#2563EB]/60 rounded px-1.5 py-0.5 uppercase tracking-wider">
                      Bonus
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-medium text-white/60 bg-black/50 rounded px-1.5 py-0.5">
                      18 min
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#2563EB]/80 flex items-center justify-center shadow-lg shadow-[#2563EB]/30 backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#2563EB] transition-colors">
                      Les coulisses
                    </h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">
                      Suivez l&apos;équipe de {show.title} pendant qu&apos;elle installe les lumières, répète les répliques et se prépare pour le tournage en direct. Découvrez la magie avant qu&apos;elle n&apos;arrive à l&apos;écran.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Camera className="h-3 w-3 text-[#2563EB]/60" />
                      <span className="text-[10px] text-[#2563EB]/70 font-medium">Journal de production</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 — Host Interview */}
                <div className="group rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/[0.04] overflow-hidden hover:border-[#2563EB]/40 hover:bg-[#2563EB]/[0.07] transition-all duration-300">
                  <div className="relative aspect-video bg-gradient-to-br from-[#0F1E40] to-[#050A15] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
                    <Mic2 className="h-12 w-12 text-[#2563EB]/40 group-hover:text-[#2563EB]/70 transition-colors duration-300" />
                    <div className="absolute top-2 left-2 text-[10px] font-semibold text-white/80 bg-[#2563EB]/60 rounded px-1.5 py-0.5 uppercase tracking-wider">
                      Interview
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-medium text-white/60 bg-black/50 rounded px-1.5 py-0.5">
                      24 min
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#2563EB]/80 flex items-center justify-center shadow-lg shadow-[#2563EB]/30 backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#2563EB] transition-colors">
                      Interview avec {show.host}
                    </h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">
                      Un entretien exclusif avec {show.host} — sur la vision créative de la série, les défis inattendus, et ce que les fans peuvent attendre de la saison prochaine.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Mic2 className="h-3 w-3 text-[#2563EB]/60" />
                      <span className="text-[10px] text-[#2563EB]/70 font-medium">Interview exclusive</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 — Bloopers */}
                <div className="group rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/[0.04] overflow-hidden hover:border-[#2563EB]/40 hover:bg-[#2563EB]/[0.07] transition-all duration-300">
                  <div className="relative aspect-video bg-gradient-to-br from-[#0F1E40] to-[#050A15] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
                    <Laugh className="h-12 w-12 text-[#2563EB]/40 group-hover:text-[#2563EB]/70 transition-colors duration-300" />
                    <div className="absolute top-2 left-2 text-[10px] font-semibold text-white/80 bg-[#2563EB]/60 rounded px-1.5 py-0.5 uppercase tracking-wider">
                      Bêtisier
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-medium text-white/60 bg-black/50 rounded px-1.5 py-0.5">
                      11 min
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#2563EB]/80 flex items-center justify-center shadow-lg shadow-[#2563EB]/30 backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#2563EB] transition-colors">
                      Bêtisier de la saison
                    </h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">
                      Les meilleurs ratés, répliques manquées et moments inattendus qui n&apos;ont jamais été gardés au montage final — compilés dans une bobine hilarante pour les vrais fans.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Laugh className="h-3 w-3 text-[#2563EB]/60" />
                      <span className="text-[10px] text-[#2563EB]/70 font-medium">Bobine de bêtisier</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Subscription upsell banner */}
              <div className="rounded-2xl border border-[#2563EB]/15 bg-gradient-to-r from-[#2563EB]/[0.06] to-transparent p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/25 flex items-center justify-center shrink-0">
                    <MonitorPlay className="h-5 w-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Débloquez tout le contenu bonus</p>
                    <p className="text-xs text-white/35">Abonnez-vous à CINEGENY TV pour un accès illimité à la médiathèque bonus de chaque série.</p>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold text-sm transition-colors shrink-0 shadow-lg shadow-[#2563EB]/20"
                >
                  S&apos;abonner <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════
            CAST & CREW
           ════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Casting et équipe</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Host card (featured) */}
            <div className="rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/[0.05] p-4 text-center col-span-1 hover:border-[#2563EB]/40 transition-colors">
              <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${CAST_COLORS[0]} flex items-center justify-center mb-3`}>
                <span className="text-xl font-bold text-white">{show.host.charAt(0)}</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{show.host}</p>
              <p className="text-[10px] text-[#2563EB] font-medium uppercase tracking-wider mt-1">Animateur</p>
            </div>
            {/* Cast members */}
            {(show.cast || []).filter(c => c !== show.host).slice(0, 5).map((member, i) => (
              <div key={member} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center hover:border-white/10 transition-colors">
                <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${CAST_COLORS[(i + 1) % CAST_COLORS.length]} flex items-center justify-center mb-3 opacity-80`}>
                  <span className="text-xl font-bold text-white">{member.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-white/70 truncate">{member}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">Acteur</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SHOW INFO PANEL + STATS
           ════════════════════════════════════════════════════════════ */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Left: Tags + Reviews */}
          <div className="md:col-span-2 space-y-6">
            {/* Tags */}
            {show.tags.length > 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-3.5 w-3.5 text-white/30" />
                  {show.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 hover:bg-[#2563EB]/10 hover:text-[#2563EB] hover:border-[#2563EB]/20 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Show details card */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Détails de la série</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Animateur', value: show.host },
                  { label: 'Genre', value: show.genre },
                  { label: 'Diffusion depuis', value: show.premiered },
                  { label: 'Statut', value: statusInfo.label },
                  { label: 'Épisodes', value: `${show.episodeCount} au total` },
                  { label: 'Durée', value: `${show.duration} min/ép` },
                  { label: 'Saisons', value: String(seasonCount) },
                  { label: 'Année', value: String(show.year) },
                ].map(item => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</span>
                    <span className="text-sm text-white/70">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Avis de la communauté</h3>
              <div className="space-y-4">
                {reviews.slice(0, 4).map((review) => (
                  <div key={review.name} className="border-b border-white/[0.04] pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white/70">{review.name}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(review.rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-white/15'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/40">{review.comment}</p>
                    <span className="text-[10px] text-white/20 mt-1 block">{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stats sidebar */}
          <div className="space-y-4">
            {/* Viewer stats */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Statistiques de la série</h3>
              <div className="text-4xl font-bold text-[#2563EB] mb-1">
                {show.viewCount.toLocaleString('fr-FR')}
              </div>
              <div className="text-xs text-white/30 mb-4">Vues totales</div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Popularité</span>
                  <span className="text-[#2563EB] font-medium">{viewersPct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full"
                    style={{ width: `${viewersPct}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{show.episodeCount}</div>
                  <div className="text-[10px] text-white/30">Épisodes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{seasonCount}</div>
                  <div className="text-[10px] text-white/30">Saisons</div>
                </div>
              </div>
            </div>

            {/* Rating card */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">{show.rating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-0.5 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(show.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : i < show.rating
                        ? 'text-amber-400 fill-amber-400/50'
                        : 'text-white/15'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-white/30">{Math.floor(show.viewCount / 50)} avis</p>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Découvrir</h3>
              {[
                { href: '/tv/shows', label: 'Toutes les séries', icon: Tv },
                { href: '/tv/produce', label: 'Produire une série', icon: Clapperboard },
                { href: '/tv/work', label: 'Travailler avec nous', icon: Briefcase },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group/link"
                >
                  <link.icon className="h-4 w-4 text-white/30 group-hover/link:text-[#2563EB] transition-colors" />
                  <span className="text-sm text-white/50 group-hover/link:text-white/80 transition-colors">{link.label}</span>
                  <ChevronRight className="h-3 w-3 text-white/20 ml-auto group-hover/link:text-[#2563EB] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SIMILAR SHOWS
           ════════════════════════════════════════════════════════════ */}
        {similarShows.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#2563EB]">Séries similaires</h2>
              <Link href="/tv/shows" className="text-xs text-white/25 uppercase tracking-wider hover:text-[#2563EB] transition-colors flex items-center gap-1">
                Tout voir <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="relative group/row">
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050A15] to-transparent z-10 pointer-events-none" />
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                {similarShows.map((sf, i) => (
                  <Link
                    key={sf.slug}
                    href={`/tv/shows/${sf.slug}`}
                    className="flex-shrink-0 w-[140px] md:w-[160px] group/card snap-start"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0A1020] ring-1 ring-white/[0.06] mb-2.5 transition-all duration-300 group-hover/card:ring-[#2563EB]/40 group-hover/card:ring-2 group-hover/card:shadow-lg group-hover/card:shadow-black/40">
                      <Image
                        src={sf.coverImageUrl || POSTER_URLS[i % POSTER_URLS.length]}
                        alt={sf.title}
                        fill
                        unoptimized
                        className="object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
                        sizes="160px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" /> Voir
                        </span>
                      </div>
                      {/* Rating badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 rounded px-1.5 py-0.5">
                        <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-[9px] text-white/80 font-medium">{sf.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-white/60 truncate group-hover/card:text-white transition-colors duration-200">{sf.title}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{sf.episodeCount} ép. &middot; {sf.host}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
            INVESTMENT / CO-PRODUCER CTA
           ════════════════════════════════════════════════════════════ */}
        <section>
          <div className="relative rounded-2xl p-[2px] overflow-hidden">
            {/* Animated golden border */}
            <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,#B8860B,#FFD700,#DAA520,#B8860B,#FFD700)] opacity-60" />
            <div className="absolute inset-[2px] rounded-2xl bg-[#050A15]" />

            <div className="relative rounded-2xl bg-gradient-to-br from-amber-900/[0.12] via-[#050A15] to-amber-800/[0.06] p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                      Devenir co-producteur
                    </h2>
                    <p className="text-xs text-amber-500/50 uppercase tracking-wider font-medium mt-0.5">Financer cette série</p>
                  </div>
                </div>

                <p className="text-white/50 max-w-2xl text-lg leading-relaxed">
                  Investissez dans {show.title} et recevez une part des revenus. Les revenus sont répartis 25/25/25/25 entre créateurs, investisseurs, plateforme et communauté.
                </p>

                {/* Funding progress */}
                <div className="rounded-xl border border-amber-500/15 bg-white/[0.02] p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/40">Progression du financement</span>
                    <span className="text-sm font-bold text-amber-400">{fundingPct}%</span>
                  </div>
                  <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 transition-all duration-1000 relative"
                      style={{ width: `${Math.min(fundingPct, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white/25 mt-2">
                    <span>{fundingAmount.toLocaleString()} $ collectés</span>
                    <span>Objectif : {(120000).toLocaleString()} $</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: Coins, title: 'Investissez dès 10 $', desc: 'Tokens de co-production accessibles à tous' },
                    { icon: MonitorPlay, title: 'Votez sur les épisodes', desc: 'Participez aux décisions créatives' },
                    { icon: Crown, title: 'Crédits et revenus', desc: 'Votre nom au générique + une part des revenus' },
                  ].map((b) => (
                    <div key={b.title} className="rounded-xl border border-amber-500/10 bg-white/[0.02] p-4 text-center hover:border-amber-500/25 transition-colors">
                      <b.icon className="h-6 w-6 text-amber-400/60 mx-auto mb-2" />
                      <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>
                      <p className="text-xs text-white/30">{b.desc}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/tv/produce">
                    <button className="relative group px-8 py-4 rounded-xl font-bold text-base text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:via-amber-200 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] border-2 border-amber-500/40">
                      <span className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        Devenir co-producteur
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </Link>
                  <p className="text-xs text-white/25">Partage des revenus : 25% créateurs / 25% investisseurs / 25% plateforme / 25% communauté</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SMART CONTRACT NOTE
           ════════════════════════════════════════════════════════════ */}
        <section>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-400 mb-2">Sécurisé par smart contract</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Tous les tokens de série sont déployés sur Ethereum. Ce sont des utility tokens qui confèrent des droits de vote et un accès au partage des revenus. Les tokens sont non transférables et liés à votre compte CINEGENY.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            BOTTOM NAVIGATION
           ════════════════════════════════════════════════════════════ */}
        <section className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/tv/shows"
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-[#2563EB]/20 hover:bg-[#2563EB]/[0.03] transition-all duration-300 group/nav"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
                <Tv className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover/nav:text-[#2563EB] transition-colors">Parcourir les séries</h4>
                <p className="text-[10px] text-white/30">Découvrez les {ALL_TV_SHOWS.length} séries</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/20 ml-auto group-hover/nav:text-[#2563EB] transition-colors" />
            </div>
          </Link>
          <Link
            href="/tv/produce"
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all duration-300 group/nav"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clapperboard className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover/nav:text-amber-400 transition-colors">Produire</h4>
                <p className="text-[10px] text-white/30">Créez votre propre série</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/20 ml-auto group-hover/nav:text-amber-400 transition-colors" />
            </div>
          </Link>
          <Link
            href="/tv/work"
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-300 group/nav"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover/nav:text-emerald-400 transition-colors">Travailler</h4>
                <p className="text-[10px] text-white/30">Rejoignez l&apos;équipe CINEGENY</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/20 ml-auto group-hover/nav:text-emerald-400 transition-colors" />
            </div>
          </Link>
        </section>
      </div>
    </div>
  )
}
