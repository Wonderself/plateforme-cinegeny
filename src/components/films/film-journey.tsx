import { Vote, Clapperboard, PlayCircle, Check } from 'lucide-react'
import { FILM_STATUS_ORDER, FILM_STATUSES, type FilmStatusKey } from '@/content/brand'
import { cn } from '@/lib/utils'

/**
 * Le parcours d'un film — axe de navigation public unique (décision 15.0 #6) :
 * En vote -> En production -> À regarder. Utilisé sur la fiche film (15.4)
 * pour situer précisément CE film sur les 3 étapes (contrairement au bloc
 * générique `Parcours` de l'accueil, session 15.3).
 */

const ICONS: Record<FilmStatusKey, typeof Vote> = {
  'en-vote': Vote,
  'en-production': Clapperboard,
  'a-regarder': PlayCircle,
}

export function FilmJourney({ current }: { current: FilmStatusKey }) {
  const currentIndex = FILM_STATUS_ORDER.indexOf(current)

  return (
    <section>
      <h2 className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
        <span className="h-px w-6 bg-[#C9A227]/60" /> Le parcours de ce film
      </h2>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {FILM_STATUS_ORDER.map((key, i) => {
          const status = FILM_STATUSES[key]
          const Icon = ICONS[key]
          const isDone = i < currentIndex
          const isActive = i === currentIndex

          return (
            <div key={key} className="flex flex-1 items-center gap-3 md:flex-col md:text-center">
              <div
                className={cn(
                  'flex flex-1 items-start gap-3.5 rounded-2xl border p-4 transition-colors md:h-full md:flex-col md:items-center md:gap-2.5 md:p-5',
                  isActive && 'border-[#C9A227]/40 bg-[#C9A227]/[0.07]',
                  isDone && 'border-emerald-500/20 bg-emerald-500/[0.04]',
                  !isActive && !isDone && 'border-white/[0.06] bg-white/[0.02] opacity-60'
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                    isActive && 'border-[#C9A227]/30 bg-[#C9A227]/15 text-[#E8C766]',
                    isDone && 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
                    !isActive && !isDone && 'border-white/10 bg-white/[0.03] text-white/30'
                  )}
                >
                  {isDone ? <Check className="h-4.5 w-4.5" /> : <Icon className="h-4.5 w-4.5" />}
                </span>
                <div className="min-w-0">
                  <h3 className={cn('text-sm font-semibold', isActive ? 'text-white' : isDone ? 'text-white/70' : 'text-white/40')}>
                    {status.label}
                    {isActive && (
                      <span className="ml-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E8C766] align-middle">
                        Ici
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">{status.description}</p>
                </div>
              </div>
              {i < FILM_STATUS_ORDER.length - 1 && (
                <div className="hidden h-px flex-1 bg-white/[0.08] md:block" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
