import { describe, it, expect } from 'vitest'
import {
  buildHomeFilmVM,
  selectHeroFilm,
  sortByProgressDesc,
  buildHomeVitrineModel,
  type HomeFilmInput,
} from '@/lib/home-vitrine'
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

function input(overrides: Omit<Partial<HomeFilmInput>, 'film'> & { film?: Partial<FilmData> } = {}): HomeFilmInput {
  return {
    film: makeFilm(overrides.film),
    // Respect an explicit `null` (distinguish "not votable" from "not provided").
    filmId: 'filmId' in overrides ? (overrides.filmId ?? null) : 'db-id',
    voteCount: overrides.voteCount ?? 0,
  }
}

/* ── buildHomeFilmVM ── */

describe('buildHomeFilmVM', () => {
  it('maps slate data + real count into a view-model with real progress', () => {
    const vm = buildHomeFilmVM(input({ film: { track: 'B' }, voteCount: 2500 }))
    expect(vm.progress.count).toBe(2500)
    expect(vm.progress.threshold).toBe(5000)
    expect(vm.progress.pct).toBe(50)
    expect(vm.track).toBe('B')
    expect(vm.trackName).toBe(VOTE_TRACKS.B.name)
    expect(vm.trackOutcome).toBe(VOTE_TRACKS.B.outcome)
  })

  it('marks a film votable only when it has a DB id', () => {
    expect(buildHomeFilmVM(input({ filmId: 'db-1' })).votable).toBe(true)
    expect(buildHomeFilmVM(input({ filmId: null })).votable).toBe(false)
  })

  it('never invents a count — an unknown film shows 0 votes', () => {
    const vm = buildHomeFilmVM(input({ voteCount: 0 }))
    expect(vm.progress.count).toBe(0)
    expect(vm.progress.pct).toBe(0)
    expect(vm.progress.reached).toBe(false)
  })
})

/* ── selectHeroFilm ── */

describe('selectHeroFilm', () => {
  const a = buildHomeFilmVM(input({ film: { slug: 'a' } }))
  const b = buildHomeFilmVM(input({ film: { slug: 'b' } }))

  it('returns the preferred film when present (founder choice, 15.3)', () => {
    expect(selectHeroFilm([a, b], 'b')?.slug).toBe('b')
  })

  it('falls back to the first film so the hero is never empty', () => {
    expect(selectHeroFilm([a, b], 'missing')?.slug).toBe('a')
  })

  it('returns null when there is no film at all', () => {
    expect(selectHeroFilm([], 'a')).toBeNull()
  })
})

/* ── sortByProgressDesc ── */

describe('sortByProgressDesc', () => {
  it('places the films closest to the threshold first', () => {
    const low = buildHomeFilmVM(input({ film: { slug: 'low' }, voteCount: 100 }))
    const high = buildHomeFilmVM(input({ film: { slug: 'high' }, voteCount: 4000 }))
    const mid = buildHomeFilmVM(input({ film: { slug: 'mid' }, voteCount: 1500 }))
    expect(sortByProgressDesc([low, high, mid]).map((f) => f.slug)).toEqual(['high', 'mid', 'low'])
  })

  it('does not mutate the input array', () => {
    const arr = [buildHomeFilmVM(input())]
    const copy = [...arr]
    sortByProgressDesc(arr)
    expect(arr).toEqual(copy)
  })
})

/* ── buildHomeVitrineModel ── */

describe('buildHomeVitrineModel', () => {
  const inputs: HomeFilmInput[] = [
    input({ film: { slug: 'a1', track: 'A' }, voteCount: 300 }),
    input({ film: { slug: 'a2', track: 'A' }, voteCount: 900 }),
    input({ film: { slug: 'b1', track: 'B' }, voteCount: 1200 }),
    input({ film: { slug: 'hero', track: 'B' }, voteCount: 50 }),
  ]

  it('splits films by competition track and sorts each by real progress', () => {
    const model = buildHomeVitrineModel(inputs, 'hero')!
    expect(model.trackA.map((f) => f.slug)).toEqual(['a2', 'a1'])
    expect(model.trackB.map((f) => f.slug)).toEqual(['b1', 'hero'])
  })

  it('features the founder-chosen hero film', () => {
    expect(buildHomeVitrineModel(inputs, 'hero')!.hero.slug).toBe('hero')
  })

  it('sums a real public total from confirmed votes only', () => {
    expect(buildHomeVitrineModel(inputs, 'hero')!.totalVotes).toBe(300 + 900 + 1200 + 50)
  })

  it('returns null when there are no films (honest empty state)', () => {
    expect(buildHomeVitrineModel([], 'hero')).toBeNull()
  })
})
