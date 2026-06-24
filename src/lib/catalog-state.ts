'use client'

import { useState, useEffect } from 'react'
import { ALL_FILMS, type FilmData } from '@/data/films'
import { ARCHIVED_FILMS } from '@/data/archived-films'

/**
 * Client-side catalog activation store.
 *
 * The live catalog defaults to the 6 active slate films (ALL_FILMS).
 * Archived (legacy) films can be re-activated from /admin/films-catalog;
 * activated slugs are persisted in localStorage and merged into the live
 * catalog on the client.
 */

const KEY = 'cinegeny:active-archived-films'
const EVENT = 'cinegeny:catalog-changed'

export function getActiveArchivedSlugs(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function setArchivedActive(slug: string, active: boolean): void {
  const next = new Set(getActiveArchivedSlugs())
  if (active) next.add(slug)
  else next.delete(slug)
  localStorage.setItem(KEY, JSON.stringify([...next]))
  window.dispatchEvent(new Event(EVENT))
}

/** Reactive set of currently activated archived slugs. */
export function useActiveArchivedSlugs(): Set<string> {
  const [slugs, setSlugs] = useState<Set<string>>(new Set())
  useEffect(() => {
    const sync = () => setSlugs(new Set(getActiveArchivedSlugs()))
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return slugs
}

/** Live catalog = active slate films + any re-activated archived films. */
export function useLiveCatalog(): FilmData[] {
  const [films, setFilms] = useState<FilmData[]>(ALL_FILMS)
  useEffect(() => {
    const compute = () => {
      const active = new Set(getActiveArchivedSlugs())
      const extra = ARCHIVED_FILMS.filter((f) => active.has(f.slug))
      setFilms([...ALL_FILMS, ...extra])
    }
    compute()
    window.addEventListener(EVENT, compute)
    window.addEventListener('storage', compute)
    return () => {
      window.removeEventListener(EVENT, compute)
      window.removeEventListener('storage', compute)
    }
  }, [])
  return films
}
