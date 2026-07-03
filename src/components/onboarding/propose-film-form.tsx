'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { proposeFilmAction } from '@/app/actions/catalog'
import { FILM_DURATION } from '@/content/atelier'
import {
  Film, Image as ImageIcon, Clapperboard, PlayCircle, Clock,
  Loader2, CheckCircle2, ArrowRight, Vote,
} from 'lucide-react'

/**
 * Proposition de film de l'onboarding (/bienvenue).
 * Volontairement légère : titre + synopsis suffisent — affiche, bande-annonce
 * et film complet sont facultatifs et peuvent être ajoutés plus tard (ou par
 * l'équipe depuis /admin/catalog).
 */

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#C9A227]/50 focus:outline-none transition-colors'
const labelCls = 'text-xs font-medium text-white/55'

export function ProposeFilmForm() {
  const [state, formAction, pending] = useActionState(proposeFilmAction, null)

  if (state?.success) {
    return (
      <div className="border-gold-brushed relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#C9A227]/[0.08] to-transparent p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#C9A227]" />
        <h3 className="mt-4 font-playfair text-2xl font-bold text-white">
          Proposition reçue !
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
          Notre équipe la regarde très vite. Vous pouvez la compléter à tout moment —
          et en attendant, votez pour les films en compétition.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/films"
            className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all"
          >
            <Vote className="h-4 w-4" /> Découvrir les films en vote
          </Link>
          <Link
            href="/atelier"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:border-[#C9A227]/30 hover:text-[#E8C766]"
          >
            Travailler ma bande-annonce <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="border-gold-brushed relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent p-7 sm:p-9"
    >
      <div className="flex items-center gap-3">
        <span className="bg-gold-brushed inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Clapperboard className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-playfair text-xl font-bold text-white sm:text-2xl">
            Proposez votre film
          </h2>
          <p className="text-xs text-white/45">
            Facultatif — deux minutes suffisent, vous pourrez tout compléter plus tard.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Titre de votre film *</label>
          <input name="title" required placeholder="Ex : Les Ombres de Minuit" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Synopsis *</label>
          <textarea
            name="synopsis"
            required
            rows={3}
            placeholder="Racontez votre histoire en quelques phrases…"
            className={`${inputCls} resize-none`}
          />
        </div>
        <div>
          <label className={labelCls}>Genre</label>
          <input name="genre" placeholder="Drame, Sci-Fi, Animation…" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>
            <Clock className="mr-1 inline h-3 w-3" />
            Durée du film (minutes)
          </label>
          <input
            name="durationMinutes"
            type="number"
            min={FILM_DURATION.minMinutes}
            max={FILM_DURATION.maxMinutes}
            placeholder="Ex : 45"
            className={inputCls}
          />
          <p className="mt-1 text-[11px] text-[#C9A227]/70">{FILM_DURATION.label}</p>
        </div>
        <div>
          <label className={labelCls}>
            <ImageIcon className="mr-1 inline h-3 w-3" />
            Affiche (URL)
          </label>
          <input name="posterUrl" type="url" placeholder="https://…" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>
            <PlayCircle className="mr-1 inline h-3 w-3" />
            Bande-annonce (URL)
          </label>
          <input name="trailerUrl" type="url" placeholder="https://…" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>
            <Film className="mr-1 inline h-3 w-3" />
            Film complet (URL, si déjà prêt)
          </label>
          <input name="videoUrl" type="url" placeholder="https://… (MP4, WebM)" className={inputCls} />
        </div>
      </div>

      {state?.error && (
        <p className="mt-5 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="bg-gold-brushed btn-sheen inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-all disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clapperboard className="h-4 w-4" />}
          Envoyer ma proposition
        </button>
        <p className="text-[11px] leading-relaxed text-white/30">
          Pas encore de bande-annonce ? <Link href="/atelier" className="text-[#C9A227]/80 underline-offset-2 hover:underline">Créez-la dans l’Atelier</Link> — vous ajouterez l’URL ensuite.
        </p>
      </div>
    </form>
  )
}
