import { describe, it, expect } from 'vitest'
import {
  computeVoteProgress,
  decideCastVote,
  hashIp,
  planVoteConfirmation,
  VOTE_THRESHOLD,
} from '@/lib/votes'

describe('computeVoteProgress (seuil)', () => {
  it('uses the official 5 000 votes threshold by default', () => {
    expect(VOTE_THRESHOLD).toBe(5000)
  })

  it('computes the percentage towards the threshold', () => {
    const progress = computeVoteProgress(2500)
    expect(progress.count).toBe(2500)
    expect(progress.threshold).toBe(5000)
    expect(progress.pct).toBe(50)
    expect(progress.reached).toBe(false)
  })

  it('caps the percentage at 100 and flags reached once the threshold is hit', () => {
    const progress = computeVoteProgress(5000)
    expect(progress.pct).toBe(100)
    expect(progress.reached).toBe(true)
  })

  it('never reports more than 100% even past the threshold', () => {
    const progress = computeVoteProgress(7000)
    expect(progress.pct).toBe(100)
    expect(progress.reached).toBe(true)
  })

  it('never returns a negative count', () => {
    const progress = computeVoteProgress(-5)
    expect(progress.count).toBe(0)
    expect(progress.pct).toBe(0)
  })
})

describe('decideCastVote (double vote)', () => {
  it('allows a fresh vote', () => {
    const decision = decideCastVote({ hasConfirmedVote: false, hasAnonVote: false })
    expect(decision.allowed).toBe(true)
  })

  it('rejects a second vote from an account that already voted (1 vote confirmé par compte et par film)', () => {
    const decision = decideCastVote({ hasConfirmedVote: true, hasAnonVote: false })
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toMatch(/déjà voté/)
  })

  it('rejects a second anonymous vote for the same film', () => {
    const decision = decideCastVote({ hasConfirmedVote: false, hasAnonVote: true })
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toMatch(/confirmez/i)
  })
})

describe('planVoteConfirmation (confirmation à l\'inscription)', () => {
  it('confirms all pending anonymous votes when the account has none yet', () => {
    const plan = planVoteConfirmation(
      [
        { id: 'v1', filmId: 'film-a' },
        { id: 'v2', filmId: 'film-b' },
      ],
      new Set(),
    )
    expect(plan.toConfirm.sort()).toEqual(['v1', 'v2'])
    expect(plan.toDiscard).toEqual([])
  })

  it('discards an anonymous vote when the account already has a confirmed vote for that film', () => {
    const plan = planVoteConfirmation(
      [{ id: 'v1', filmId: 'film-a' }],
      new Set(['film-a']),
    )
    expect(plan.toConfirm).toEqual([])
    expect(plan.toDiscard).toEqual(['v1'])
  })

  it('deduplicates when several pending anonymous votes target the same film', () => {
    const plan = planVoteConfirmation(
      [
        { id: 'v1', filmId: 'film-a' },
        { id: 'v2', filmId: 'film-a' },
      ],
      new Set(),
    )
    expect(plan.toConfirm).toEqual(['v1'])
    expect(plan.toDiscard).toEqual(['v2'])
  })
})

describe('hashIp', () => {
  it('is deterministic for the same IP and salt', () => {
    expect(hashIp('1.2.3.4', 'salt')).toBe(hashIp('1.2.3.4', 'salt'))
  })

  it('never returns the raw IP', () => {
    const hash = hashIp('1.2.3.4', 'salt')
    expect(hash).not.toContain('1.2.3.4')
    expect(hash).toHaveLength(64) // sha256 hex digest
  })

  it('produces different hashes for different IPs', () => {
    expect(hashIp('1.2.3.4', 'salt')).not.toBe(hashIp('5.6.7.8', 'salt'))
  })
})
