import { describe, it, expect } from 'vitest'
import {
  buildCatalogFilmVM,
  sortByProgressDesc,
  buildCatalogModel,
  type CatalogFilmInput,
} from '@/lib/films-catalog'
import { VOTE_TRACKS } from '@/content/brand'
import type { FilmData } from '@/data/films'

/* ── Fixtures ── */

function makeFilm(overrides: Partial<FilmData> = {}): FilmData {
  return {
    id: 'slate-x',
    title: 'Film Test',
    slug: 'film-test',
    genre: 'Drame',
    synopsis: 'Un synopsis.',
    director: 'Réalisateur',
    cast: [],
    duration: '1h 30min',
    year: 2026,
    rating: 'PG',
    tags: [],
    coverImageUrl: '/posters/test.png',
    status: 'IN_PRODUCTION',
    progressPct: 0,
    fundingPct: 0,
    track: 'A',
    ...overrides,
  }
}

function input(overrides: Omit<Partial<CatalogFilmInput>, 'film'> & { film?: Partial<FilmData> } = {}): CatalogFilmInput {
  return {
    film: makeFilm(overrides.film),
    filmId: 'filmId' in overrides ? (overrides.filmId ?? null) : 'db-id',
    legacyStatus: overrides.legacyStatus ?? overrides.film?.status ?? 'IN_PRODUCTION',
    voteCount: overrides.voteCount ?? 0,
  }
}

/* ── buildCatalogFilmVM ── */

describe('buildCatalogFilmVM', () => {
  it('maps catalog data + real count into a view-model with real progress', () => {
    const vm = buildCatalogFilmVM(input({ film: { track: 'B' }, voteCount: 2500 }))
    expect(vm.progress.count).toBe(2500)
    expect(vm.progress.threshold).toBe(5000)
    expect(vm.progress.pct).toBe(50)
    expect(vm.track).toBe('B')
    expect(vm.trackName).toBe(VOTE_TRACKS.B.name)
  })

  it('marks a film votable only when it has a DB id', () => {
    expect(buildCatalogFilmVM(input({ filmId: 'db-1' })).votable).toBe(true)
    expect(buildCatalogFilmVM(input({ filmId: null })).votable).toBe(false)
  })

  it('never invents a count — an unknown film shows 0 votes', () => {
    const vm = buildCatalogFilmVM(input({ voteCount: 0 }))
    expect(vm.progress.count).toBe(0)
    expect(vm.progress.pct).toBe(0)
  })

  it('derives the single journey status from legacy status + real progress (15.0 #6)', () => {
    expect(buildCatalogFilmVM(input({ legacyStatus: 'PRE_PRODUCTION', voteCount: 0 })).statusKey).toBe('en-vote')
    expect(buildCatalogFilmVM(input({ legacyStatus: 'IN_PRODUCTION', voteCount: 5000 })).statusKey).toBe(
      'en-production'
    )
    expect(buildCatalogFilmVM(input({ legacyStatus: 'RELEASED', voteCount: 0 })).statusKey).toBe('a-regarder')
  })
})

/* ── sortByProgressDesc ── */

describe('sortByProgressDesc', () => {
  it('places the films closest to the threshold first', () => {
    const low = buildCatalogFilmVM(input({ film: { slug: 'low' }, voteCount: 100 }))
    const high = buildCatalogFilmVM(input({ film: { slug: 'high' }, voteCount: 4000 }))
    const mid = buildCatalogFilmVM(input({ film: { slug: 'mid' }, voteCount: 1500 }))
    expect(sortByProgressDesc([low, high, mid]).map((f) => f.slug)).toEqual(['high', 'mid', 'low'])
  })

  it('does not mutate the input array', () => {
    const arr = [buildCatalogFilmVM(input())]
    const copy = [...arr]
    sortByProgressDesc(arr)
    expect(arr).toEqual(copy)
  })
})

/* ── buildCatalogModel ── */

describe('buildCatalogModel', () => {
  it('groups films by the single journey axis (decision 15.0 #6), zero invented data', () => {
    const inputs: CatalogFilmInput[] = [
      input({ film: { slug: 'a' }, legacyStatus: 'PRE_PRODUCTION', voteCount: 0 }),
      input({ film: { slug: 'b' }, legacyStatus: 'IN_PRODUCTION', voteCount: 5200 }),
      input({ film: { slug: 'c' }, legacyStatus: 'RELEASED', voteCount: 0 }),
    ]
    const model = buildCatalogModel(inputs)
    expect(model['en-vote'].map((f) => f.slug)).toEqual(['a'])
    expect(model['en-production'].map((f) => f.slug)).toEqual(['b'])
    expect(model['a-regarder'].map((f) => f.slug)).toEqual(['c'])
  })

  it('sorts "en-vote" and "en-production" by real progress, closest to the threshold first', () => {
    const inputs: CatalogFilmInput[] = [
      input({ film: { slug: 'low' }, legacyStatus: 'PRE_PRODUCTION', voteCount: 100 }),
      input({ film: { slug: 'high' }, legacyStatus: 'PRE_PRODUCTION', voteCount: 4000 }),
    ]
    const model = buildCatalogModel(inputs)
    expect(model['en-vote'].map((f) => f.slug)).toEqual(['high', 'low'])
  })

  it('all 6 official films start "en-vote" with zero votes (decision 15.0)', () => {
    const inputs: CatalogFilmInput[] = Array.from({ length: 6 }, (_, i) =>
      input({ film: { slug: `film-${i}` }, legacyStatus: 'PRE_PRODUCTION', voteCount: 0 })
    )
    const model = buildCatalogModel(inputs)
    expect(model['en-vote']).toHaveLength(6)
    expect(model['en-production']).toHaveLength(0)
    expect(model['a-regarder']).toHaveLength(0)
  })

  it('returns empty arrays (not invented placeholders) when there are no films', () => {
    const model = buildCatalogModel([])
    expect(model).toEqual({ 'en-vote': [], 'en-production': [], 'a-regarder': [] })
  })
})
