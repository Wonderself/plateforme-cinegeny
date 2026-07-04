'use client'

import { useState, useTransition } from 'react'
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { joinCoProducerWaitlistAction } from '@/app/actions/co-produce'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [intentAmount, setIntentAmount] = useState('500')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const amount = Number(intentAmount)
    if (!Number.isInteger(amount) || amount < 100) {
      setError('Indiquez un montant d\'intention d\'au moins 100 €')
      return
    }

    startTransition(async () => {
      const result = await joinCoProducerWaitlistAction({ email, intentAmount: amount })
      if (!result.success) {
        setError(result.error || 'Une erreur est survenue')
        return
      }
      setSuccess(true)
      setAlreadyRegistered(!!result.alreadyRegistered)
    })
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl border border-[#C9A227]/25 bg-[#C9A227]/[0.06] text-center">
        <CheckCircle className="h-9 w-9 text-[#E8C766]" />
        <h3 className="text-lg font-semibold text-white">
          {alreadyRegistered ? 'Vous êtes déjà en liste d\'attente' : 'C\'est noté !'}
        </h3>
        <p className="text-sm text-white/50 max-w-sm">
          Nous vous écrirons à cette adresse dès l&apos;ouverture des co-productions, après
          la première sélection. Aucun paiement n&apos;est demandé aujourd&apos;hui.
        </p>
        <a
          href="/films"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-[#E8C766] mt-2"
        >
          Voter pour les films en compétition <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
          Votre email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.fr"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]/40"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-white/70 mb-2">
          Montant d&apos;intention (€)
        </label>
        <input
          id="amount"
          type="number"
          min={10}
          step={10}
          required
          value={intentAmount}
          onChange={(e) => setIntentAmount(e.target.value)}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227]/40"
        />
        <p className="text-xs text-white/30 mt-2">
          Un montant indicatif — non engageant, aucun paiement aujourd&apos;hui.
        </p>
      </div>

      {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/[0.08] py-4 text-sm font-semibold text-[#E8C766] transition-all duration-300 hover:bg-[#C9A227]/[0.16] hover:border-[#C9A227]/50 disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Rejoindre la liste d&apos;attente
      </button>

      <p className="text-[11px] text-white/30 text-center mt-5 leading-relaxed">
        En renseignant votre email, vous acceptez d&apos;être recontacté par CINEGENY
        Studio au sujet de l&apos;ouverture des co-productions. Vos données ne sont ni
        vendues ni partagées, conservées 24 mois maximum. Désinscription à tout moment.
        Voir notre{' '}
        <a href="/legal/privacy" className="underline underline-offset-2 hover:text-white/50">
          politique de confidentialité
        </a>
        .
      </p>
    </form>
  )
}
