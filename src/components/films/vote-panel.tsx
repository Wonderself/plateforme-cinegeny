'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { Vote as VoteIcon, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { castVoteAction, getVoteStateAction } from '@/app/actions/votes'
import { computeVoteProgress, type VoteProgress, type VoteTrack } from '@/lib/votes'
import { VOTE_TRACKS } from '@/content/brand'
import { SocialShare } from '@/components/social-share'

interface VotePanelProps {
  filmId: string
  filmTitle: string
  /** Piste de compétition du film (décision 15.0 #5). */
  track: VoteTrack
  /** Compteur réel initial (rendu serveur) — évite un flash à 0 au montage. */
  initialProgress?: VoteProgress
  compact?: boolean
  /**
   * URL publique de la fiche film — active le bloc post-vote "à partager"
   * (règle 15.4 : le vote partagé EST l'acquisition). Omis en mode compact.
   */
  shareUrl?: string
  /** Lien "voter pour un autre film" affiché après un vote confirmé. */
  otherFilmsHref?: string
}

export function VotePanel({
  filmId,
  filmTitle,
  track,
  initialProgress,
  compact = false,
  shareUrl,
  otherFilmsHref = '/films',
}: VotePanelProps) {
  const [progress, setProgress] = useState<VoteProgress | null>(initialProgress ?? null)
  const [hasVoted, setHasVoted] = useState(false)
  const [pendingConfirmation, setPendingConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false
    getVoteStateAction(filmId).then((state) => {
      if (cancelled) return
      setProgress(state.progress)
      setHasVoted(state.hasVoted)
      setPendingConfirmation(state.pendingConfirmation)
    })
    return () => {
      cancelled = true
    }
  }, [filmId])

  const handleVote = useCallback(() => {
    if (hasVoted || isPending) return
    setError(null)
    startTransition(async () => {
      const result = await castVoteAction(filmId, track)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setProgress(result.progress)
      setHasVoted(true)
      setPendingConfirmation(result.pendingConfirmation)
    })
  }, [filmId, track, hasVoted, isPending])

  const displayProgress = progress ?? computeVoteProgress(0)
  const trackInfo = VOTE_TRACKS[track]

  /* ------------------------------------------------------------------ */
  /* COMPACT MODE                                                       */
  /* ------------------------------------------------------------------ */
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleVote()
          }}
          disabled={hasVoted || isPending}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
            hasVoted
              ? 'bg-[#C9A227]/20 text-[#E8C766] border border-[#C9A227]/30'
              : 'bg-white/[0.06] text-white/60 border border-white/[0.08] hover:bg-[#C9A227]/10 hover:text-[#E8C766] hover:border-[#C9A227]/20'
          }`}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <VoteIcon className="h-3 w-3" />
          )}
          <span>{displayProgress.count.toLocaleString('fr-FR')}</span>
        </button>
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /* FULL MODE                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Voter pour ce film</h3>
        <span className="rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 px-2.5 py-1 text-[11px] font-medium text-[#E8C766]">
          {trackInfo.name}
        </span>
      </div>

      <p className="text-sm text-white/50 mb-6">
        <span className="text-white/80 font-medium">{filmTitle}</span> — {trackInfo.outcome}
      </p>

      {/* Vote button / confirmation */}
      {!hasVoted ? (
        <div className="mb-4 flex justify-center sm:mb-6 sm:block">
          <button
            onClick={handleVote}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/[0.08] px-5 py-1.5 text-xs font-semibold text-[#E8C766] transition-all duration-300 hover:bg-[#C9A227]/[0.16] hover:border-[#C9A227]/50 disabled:opacity-50 sm:w-full sm:rounded-xl sm:px-0 sm:py-4 sm:text-sm"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-5 sm:w-5" /> : <VoteIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />}
            Voter
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 mb-6 rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/[0.06]">
          <CheckCircle className="h-8 w-8 text-[#E8C766]" />
          {/* Le Fauteuil numéroté — l'artefact que l'on partage : votre place
              réelle dans l'histoire de ce film (compteur en base). */}
          <p className="font-playfair text-2xl font-bold text-gold-brushed">
            Fauteuil n° {displayProgress.count.toLocaleString('fr-FR')}
          </p>
          <p className="text-sm font-medium text-white/80 text-center px-4">
            Votre place dans l’histoire de ce film est réservée.
            <br />
            <span className="text-xs text-white/45">
              Les {displayProgress.threshold.toLocaleString('fr-FR')} premiers fauteuils entrent au générique quand le film se fait.
            </span>
          </p>
          {pendingConfirmation && (
            <div className="text-center px-4">
              <p className="text-xs text-white/40 mb-2">
                Votre vote est enregistré mais pas encore définitif.
              </p>
              <Link
                href="/register"
                className="text-xs font-semibold text-[#E8C766] underline underline-offset-2 hover:text-[#C9A227]"
              >
                Confirmez-le en vous inscrivant
              </Link>
            </div>
          )}

          {/* États post-vote (15.4) : partager, voter pour un autre film. */}
          {shareUrl && (
            <div className="flex flex-col items-center gap-2 px-4">
              <p className="text-xs text-white/40">Faites gagner ce film : partagez votre vote.</p>
              <SocialShare
                url={shareUrl}
                title={`Fauteuil n° ${displayProgress.count.toLocaleString('fr-FR')} — je viens de voter pour ${filmTitle} sur CINEGENY`}
                description={trackInfo.outcome}
              />
            </div>
          )}
          <Link
            href={otherFilmsHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-[#E8C766]"
          >
            Voter pour un autre film <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {error && <p className="text-xs text-red-400 text-center mb-4">{error}</p>}

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Progression</span>
          <span className="font-medium text-[#C9A227]">{Math.round(displayProgress.pct)}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A] transition-all duration-700"
            style={{ width: `${displayProgress.pct}%` }}
          />
        </div>
        <p className="text-xs text-white/40 text-center">
          {displayProgress.count.toLocaleString('fr-FR')} / {displayProgress.threshold.toLocaleString('fr-FR')} votes
        </p>
      </div>

      {/* Info */}
      {!hasVoted && (
        <p className="text-[11px] text-white/30 text-center mt-5 leading-relaxed">
          1 vote gratuit par film. Vous pouvez voter sans compte — une inscription rapide confirme votre vote.
        </p>
      )}
    </div>
  )
}
