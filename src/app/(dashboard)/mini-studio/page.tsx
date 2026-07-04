import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Film, Clock, CheckCircle2, Loader2, Sparkles,
  ChevronRight, Wand2, Trophy, Coins, ArrowRight, Clapperboard,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mini Studio — CINEGENY',
  description: 'Le Mini Studio : créez vos bandes-annonces cinématographiques avec l\'IA, de A à Z',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-white/[0.05] text-white/60', icon: Clock },
  DECOMPOSING: { label: 'Décomposition...', color: 'bg-blue-100 text-blue-600', icon: Loader2 },
  AWAITING_INPUT: { label: 'En attente', color: 'bg-amber-100 text-amber-600', icon: Clock },
  IN_PROGRESS: { label: 'En cours', color: 'bg-purple-100 text-purple-600', icon: Loader2 },
  COMMUNITY_VOTE: { label: 'Vote communauté', color: 'bg-pink-100 text-pink-600', icon: Trophy },
  ASSEMBLING: { label: 'Assemblage', color: 'bg-indigo-100 text-indigo-600', icon: Loader2 },
  REVIEW: { label: 'Vérification', color: 'bg-orange-100 text-orange-600', icon: Clock },
  COMPLETED: { label: 'Terminé', color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
  SUBMITTED: { label: 'Soumis au concours', color: 'bg-[#C9A227]/10 text-[#C9A227]', icon: Trophy },
  CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-600', icon: Clock },
}

export default async function TrailerStudioPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [projects, creditAccount, openContests] = await Promise.all([
    prisma.trailerProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.creditAccount.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.trailerContest.findMany({
      where: { status: 'OPEN' as never },
      take: 3,
      orderBy: { endDate: 'asc' },
    }),
  ])

  const creditBalance = creditAccount?.balance ?? 0

  return (
    <div className="space-y-10">
      {/* Header — identité Mini Studio (or brossé, assorti à la plateforme) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#E8C766] text-black shadow-[0_2px_12px_rgba(201,162,39,0.35)]">
            <Clapperboard className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                Mini Studio
              </h1>
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-[#C9A227]/30 text-[#C9A227] uppercase tracking-wider">
                Bande-annonce
              </Badge>
            </div>
            <p className="text-sm text-white/50 mt-1">
              Créez vos bandes-annonces cinématographiques avec l&apos;IA, du script au montage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/credits">
            <Badge variant="outline" className="text-sm px-3 py-1.5 border-[#C9A227]/20 text-[#C9A227] cursor-pointer hover:bg-[#C9A227]/5 transition-colors">
              <Coins className="h-3.5 w-3.5 mr-1.5" />
              {creditBalance} crédits
            </Badge>
          </Link>
          <Link href="/mini-studio/new">
            <Button className="bg-[#C9A227] hover:bg-[#E8C766] text-white font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Bande-Annonce
            </Button>
          </Link>
        </div>
      </div>

      {/* Open Contests Banner */}
      {openContests.length > 0 && (
        <div className="rounded-2xl border border-[#C9A227]/20 bg-gradient-to-r from-[#C9A227]/5 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-[#C9A227]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">
                {openContests.length} concours ouvert{openContests.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Soumettez votre bande-annonce et gagnez la production de votre film avec des royalties de coproduction !
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {openContests.map((contest) => (
                  <Link key={contest.id} href={`/community/contests/${contest.id}`}>
                    <Badge variant="outline" className="text-xs cursor-pointer hover:bg-[#C9A227]/10 transition-colors border-[#C9A227]/30">
                      {contest.title}
                      {contest.prizePoolEur > 0 && <span className="ml-1 text-[#C9A227]">{contest.prizePoolEur}€</span>}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works (shown when no projects) */}
      {projects.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A227]/10 mb-4">
              <Wand2 className="h-8 w-8 text-[#C9A227]" />
            </div>
            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-white/50 mt-2 max-w-lg mx-auto">
              Notre IA décompose la création de votre bande-annonce en micro-tâches intelligentes et les exécute automatiquement.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '1', title: 'Décrivez votre concept', desc: 'Genre, style, ambiance, durée — donnez le brief créatif' },
              { step: '2', title: 'Faites vos choix', desc: 'Personnages, décors, musique — l\'IA vous propose, vous choisissez' },
              { step: '3', title: 'L\'IA génère tout', desc: 'Chaque scène, chaque plan, chaque son est créé par l\'IA' },
              { step: '4', title: 'Soumettez au concours', desc: 'Participez et gagnez la production de votre film !' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-[#C9A227] text-white text-xs font-bold flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">{item.title}</h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/mini-studio/new">
              <Button size="lg" className="bg-[#C9A227] hover:bg-[#E8C766] text-white font-semibold shadow-md">
                <Sparkles className="h-4 w-4 mr-2" />
                Créer ma première bande-annonce
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Mes projets</h2>
          <div className="grid gap-4">
            {projects.map((project) => {
              const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG.DRAFT
              const StatusIcon = statusInfo.icon
              return (
                <Link
                  key={project.id}
                  href={`/mini-studio/${project.id}`}
                  className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#C9A227]/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C9A227]/15 transition-colors">
                      <Film className="h-6 w-6 text-[#C9A227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#C9A227] transition-colors">
                          {project.title}
                        </h3>
                        <Badge className={`text-[10px] px-2 py-0.5 ${statusInfo.color} border-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-white/50">
                        {project.genre && <span>{project.genre}</span>}
                        {project.style && <span>{project.style}</span>}
                        <span>{project.completedTasks}/{project.totalTasks} tâches</span>
                        {project.creditsUsed > 0 && (
                          <span className="text-[#C9A227]">{project.creditsUsed} crédits</span>
                        )}
                      </div>
                      {/* Progress bar */}
                      {project.totalTasks > 0 && (
                        <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#E8C766] transition-all duration-500"
                            style={{ width: `${project.progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-[#C9A227] transition-colors shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/credits" className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#C9A227]/30 p-5 transition-all">
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-[#C9A227]" />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-[#C9A227] transition-colors">Acheter des crédits</p>
              <p className="text-xs text-white/50">Packs à partir de 4.99€</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/50 ml-auto group-hover:text-[#C9A227] transition-colors" />
          </div>
        </Link>
        <Link href="/community/contests" className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#C9A227]/30 p-5 transition-all">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[#C9A227]" />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-[#C9A227] transition-colors">Concours ouverts</p>
              <p className="text-xs text-white/50">Gagnez la prod de votre film</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/50 ml-auto group-hover:text-[#C9A227] transition-colors" />
          </div>
        </Link>
        <Link href="/films" className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#C9A227]/30 p-5 transition-all">
          <div className="flex items-center gap-3">
            <Film className="h-5 w-5 text-[#C9A227]" />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-[#C9A227] transition-colors">Nos films</p>
              <p className="text-xs text-white/50">Inspirez-vous du catalogue</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/50 ml-auto group-hover:text-[#C9A227] transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
