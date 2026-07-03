import { describe, it, expect } from 'vitest'
import { selectFinalists, type FinalistInput } from '@/lib/finale'

function makeInput(overrides: Partial<FinalistInput> = {}): FinalistInput {
  return {
    slug: 'film-test',
    title: 'Film Test',
    synopsis: 'Un synopsis.',
    genre: 'Drame',
    director: 'Réalisateur',
    coverImageUrl: '/posters/test.png',
    track: 'B',
    voteCount: 0,
    ...overrides,
  }
}

describe('selectFinalists', () => {
  it('returns no finalist when no film reached the threshold (zero invented data)', () => {
    const films = [makeInput({ voteCount: 0 }), makeInput({ slug: 'b', voteCount: 4999, track: 'B' })]
    expect(selectFinalists(films)).toEqual([])
  })

  it('only piste B films can become finalists, even past the threshold', () => {
    const films = [makeInput({ slug: 'piste-a', track: 'A', voteCount: 6000 })]
    expect(selectFinalists(films)).toEqual([])
  })

  it('a piste B film reaching 5000 confirmed votes becomes a finalist', () => {
    const films = [makeInput({ slug: 'qualifie', track: 'B', voteCount: 5000 })]
    const finalists = selectFinalists(films)
    expect(finalists).toHaveLength(1)
    expect(finalists[0].slug).toBe('qualifie')
    expect(finalists[0].progress.reached).toBe(true)
  })

  it('sorts finalists by real vote count, highest first', () => {
    const films = [
      makeInput({ slug: 'low', track: 'B', voteCount: 5000 }),
      makeInput({ slug: 'high', track: 'B', voteCount: 9000 }),
      makeInput({ slug: 'mid', track: 'B', voteCount: 6500 }),
    ]
    expect(selectFinalists(films).map((f) => f.slug)).toEqual(['high', 'mid', 'low'])
  })
})
