'use client'

import { useState, useEffect } from 'react'
import { ALL_FILMS, type FilmData } from '@/data/films'
import { ARCHIVED_FILMS } from '@/data/archived-films'

/**
 * Catalog activation store.
 *
 * The live catalog defaults to the 6 active slate films (ALL_FILMS).
 * Archived (legacy) films can be re-activated from /admin/films-catalog.
 *
 * Source of truth is the database (CatalogActivation), exposed via:
 *   - GET  /api/catalog/active-archived     (public read)
 *   - POST /api/admin/catalog-activations   (admin write)
 *
 * localStorage is kept only as an instant-paint cache so the catalog
 * doesn't flicker on load and degrades gracefully if the API is briefly
 * unavailable; the server value always wins once it resolves.
 */

const CACHE_KEY = 'cinegeny:active-archived-films'
const EVENT = 'cinegeny:catalog-changed'

/** Module-level cache shared across hooks within a session. */
let cache: Set<string> | null = null

function readLocalCache(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function writeLocalCache(slugs: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify([...slugs]))
  } catch {
    /* storage full / disabled — non-fatal, server remains source of truth */
  }
}

function emit(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT))
}

/** Synchronous best-effort read (cache only). */
export function getActiveArchivedSlugs(): string[] {
  if (cache) return [...cache]
  cache = readLocalCache()
  return [...cache]
}

/** Fetch the authoritative set from the server and update the cache. */
async function refreshFromServer(): Promise<void> {
  try {
    const res = await fetch('/api/catalog/active-archived', { cache: 'no-store' })
    if (!res.ok) return
    const data = (await res.json()) as { slugs?: string[] }
    cache = new Set(data.slugs ?? [])
    writeLocalCache(cache)
    emit()
  } catch {
    /* offline — keep the cached value */
  }
}

/** Toggle an archived film; optimistic, then persisted to the DB. */
export async function setArchivedActive(slug: string, active: boolean): Promise<void> {
  const next = new Set(getActiveArchivedSlugs())
  if (active) next.add(slug)
  else next.delete(slug)

  // Optimistic update
  cache = next
  writeLocalCache(next)
  emit()

  try {
    const res = await fetch('/api/admin/catalog-activations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, active }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch {
    // Revert on failure and re-sync from server.
    await refreshFromServer()
    throw new Error('Échec de la mise à jour du catalogue')
  }
}

/** Reactive set of currently activated archived slugs. */
export function useActiveArchivedSlugs(): Set<string> {
  const [slugs, setSlugs] = useState<Set<string>>(() => new Set(getActiveArchivedSlugs()))
  useEffect(() => {
    const sync = () => setSlugs(new Set(getActiveArchivedSlugs()))
    sync()
    void refreshFromServer()
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
  const [films, setFilms] = useState<FilmData[]>(() => {
    const active = new Set(getActiveArchivedSlugs())
    return [...ALL_FILMS, ...ARCHIVED_FILMS.filter((f) => active.has(f.slug))]
  })
  useEffect(() => {
    const compute = () => {
      const active = new Set(getActiveArchivedSlugs())
      const extra = ARCHIVED_FILMS.filter((f) => active.has(f.slug))
      setFilms([...ALL_FILMS, ...extra])
    }
    compute()
    void refreshFromServer()
    window.addEventListener(EVENT, compute)
    window.addEventListener('storage', compute)
    return () => {
      window.removeEventListener(EVENT, compute)
      window.removeEventListener('storage', compute)
    }
  }, [])
  return films
}
