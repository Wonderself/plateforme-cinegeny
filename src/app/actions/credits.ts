'use server'

import { prisma } from '@/lib/prisma'
import { creditTierForAmount, type CreditTierId } from '@/content/coprod'

function fetchFilmForCredits(filmSlug: string) {
  return prisma.film.findUnique({
    where: { slug: filmSlug },
    select: {
      id: true,
      title: true,
      phases: {
        select: {
          id: true,
          phaseName: true,
          phaseOrder: true,
          tasks: {
            where: { status: 'VALIDATED', claimedById: { not: null } },
            select: {
              id: true,
              title: true,
              type: true,
              claimedBy: {
                select: {
                  id: true,
                  displayName: true,
                  avatarUrl: true,
                  role: true,
                },
              },
            },
          },
        },
        orderBy: { phaseOrder: 'asc' },
      },
    },
  })
}

function fetchWinningScenario(filmId: string) {
  return prisma.scenarioProposal.findFirst({
    where: { filmId, status: 'WINNER' },
    select: {
      id: true,
      title: true,
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
  })
}

/**
 * Returns all contributors who worked on a film, grouped by phase.
 * Only includes VALIDATED tasks. Also includes the scenario author if applicable.
 * Public — no auth required.
 */
export async function getFilmCreditsAction(filmSlug: string) {
  // Base indisponible (build/preview, hoquet réseau) → la fiche film reste
  // rendue sans générique plutôt que de faire planter toute la page.
  let film: Awaited<ReturnType<typeof fetchFilmForCredits>> = null
  try {
    film = await fetchFilmForCredits(filmSlug)
  } catch {
    return { filmTitle: null, credits: [] }
  }

  if (!film) return { filmTitle: null, credits: [] }

  let scenario: Awaited<ReturnType<typeof fetchWinningScenario>> = null
  try {
    scenario = await fetchWinningScenario(film.id)
  } catch {
    // Générique partiel (sans le scénario) plutôt qu'une page en erreur.
  }

  const credits = film.phases
    .filter((phase) => phase.tasks.length > 0)
    .map((phase) => ({
      phase: phase.phaseName,
      tasks: phase.tasks.map((task) => ({
        title: task.title,
        type: task.type,
        contributor: task.claimedBy
          ? {
              id: task.claimedBy.id,
              displayName: task.claimedBy.displayName,
              avatarUrl: task.claimedBy.avatarUrl,
              role: task.claimedBy.role,
            }
          : null,
      })),
    }))

  if (scenario) {
    credits.unshift({
      phase: 'SCRIPT' as const,
      tasks: [
        {
          title: `Scénario : ${scenario.title}`,
          type: 'PROMPT_WRITING' as const,
          contributor: {
            id: scenario.author.id,
            displayName: scenario.author.displayName,
            avatarUrl: scenario.author.avatarUrl,
            role: scenario.author.role,
          },
        },
      ],
    })
  }

  return {
    filmTitle: film.title,
    credits,
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Session 15.11 — Générique à 2 rôles (la « chaise dorée »)
 *
 * Deux familles au générique d'un film, clairement différenciées :
 *  - ARTISTES   : les créateurs / participants au film. Dérivés AUTOMATIQUEMENT
 *                 des tâches validées + l'auteur du scénario gagnant.
 *  - PRODUCTEURS: les apporteurs d'argent (coprods). Saisis à la main par
 *                 l'admin pour l'instant (modèle coprod complet → roadmap).
 *
 * Une même personne peut être les DEUX (ex. un artiste qui travaille contre
 * des parts de production) : elle apparaît dans les deux sections avec le
 * badge « Artiste & Producteur ».
 * ───────────────────────────────────────────────────────────────────────── */

export type GeneriqueRole = 'ARTIST' | 'PRODUCER'

export interface GeneriqueEntry {
  /** userId si compte rattaché, sinon id synthétique (crédit libre). */
  key: string
  name: string
  avatarUrl: string | null
  /** Intitulé précis (ex. « Scénariste », « Producteur exécutif »). */
  roleLabel: string | null
  /** true si la personne est à la fois artiste et productrice. */
  isDual: boolean
  /** Palier d'affichage producteur (grand/moyen/petit) — cf. content/coprod.ts. */
  tier?: CreditTierId
}

export interface FilmGenerique {
  filmTitle: string | null
  artists: GeneriqueEntry[]
  producers: GeneriqueEntry[]
}

/**
 * Construit le générique à 2 rôles d'un film. Public — aucune auth requise.
 * Fusionne les artistes dérivés automatiquement (tâches validées + scénario
 * gagnant) et les crédits curés à la main (FilmCredit), puis détecte les
 * personnes présentes dans les deux familles (rôle double).
 */
const EMPTY_GENERIQUE: FilmGenerique = { filmTitle: null, artists: [], producers: [] }

export async function getFilmGeneriqueAction(filmSlug: string): Promise<FilmGenerique> {
  try {
    return await buildFilmGenerique(filmSlug)
  } catch {
    // Base indisponible (build/preview, hoquet réseau) → la fiche film reste
    // rendue sans générique plutôt que de faire planter toute la page.
    return EMPTY_GENERIQUE
  }
}

async function buildFilmGenerique(filmSlug: string): Promise<FilmGenerique> {
  const film = await prisma.film.findUnique({
    where: { slug: filmSlug },
    select: {
      id: true,
      title: true,
      phases: {
        select: {
          tasks: {
            where: { status: 'VALIDATED', claimedById: { not: null } },
            select: {
              type: true,
              claimedBy: { select: { id: true, displayName: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  })

  if (!film) return EMPTY_GENERIQUE

  const [scenario, curated] = await Promise.all([
    prisma.scenarioProposal.findFirst({
      where: { filmId: film.id, status: 'WINNER' },
      select: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    }),
    prisma.filmCredit.findMany({
      where: { filmId: film.id, isPublic: true },
      orderBy: [{ role: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        roleLabel: true,
        amountEur: true,
        user: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    }),
  ])

  // ── Famille ARTISTES (auto) : tâches validées + scénario gagnant ──────────
  const artistMap = new Map<string, GeneriqueEntry>()
  const addArtist = (
    key: string,
    name: string,
    avatarUrl: string | null,
    roleLabel: string | null,
  ) => {
    const existing = artistMap.get(key)
    if (existing) {
      if (!existing.roleLabel && roleLabel) existing.roleLabel = roleLabel
      return
    }
    artistMap.set(key, { key, name, avatarUrl, roleLabel, isDual: false })
  }

  for (const phase of film.phases) {
    for (const task of phase.tasks) {
      const c = task.claimedBy
      if (!c) continue
      addArtist(c.id, c.displayName ?? 'Créateur', c.avatarUrl ?? null, null)
    }
  }
  if (scenario?.author) {
    const a = scenario.author
    addArtist(a.id, a.displayName ?? 'Scénariste', a.avatarUrl ?? null, 'Scénariste')
  }

  // ── Crédits curés (FilmCredit) : artistes, producteurs, ou les deux ───────
  const producerMap = new Map<string, GeneriqueEntry & { amount: number }>()
  const addProducer = (
    key: string,
    name: string,
    avatarUrl: string | null,
    roleLabel: string | null,
    amountEur: number | null,
  ) => {
    const tier = creditTierForAmount(amountEur).id
    const existing = producerMap.get(key)
    if (existing) {
      if (!existing.roleLabel && roleLabel) existing.roleLabel = roleLabel
      // On garde le plus gros montant si crédité plusieurs fois.
      if ((amountEur ?? 0) > existing.amount) {
        existing.amount = amountEur ?? 0
        existing.tier = tier
      }
      return
    }
    producerMap.set(key, {
      key, name, avatarUrl, roleLabel, isDual: false, tier, amount: amountEur ?? 0,
    })
  }

  for (const credit of curated) {
    const key = credit.userId ?? `credit:${credit.id}`
    const name = credit.user?.displayName ?? credit.name
    const avatarUrl = credit.user?.avatarUrl ?? null
    if (credit.role === 'ARTIST' || credit.role === 'ARTIST_PRODUCER') {
      addArtist(key, name, avatarUrl, credit.roleLabel ?? null)
    }
    if (credit.role === 'PRODUCER' || credit.role === 'ARTIST_PRODUCER') {
      addProducer(key, name, avatarUrl, credit.roleLabel ?? null, credit.amountEur)
    }
  }

  // ── Détection du rôle double (présent dans les deux familles) ─────────────
  for (const [key, entry] of artistMap) {
    if (producerMap.has(key)) {
      entry.isDual = true
      producerMap.get(key)!.isDual = true
    }
  }

  // Producteurs triés par montant décroissant (les gros paliers en tête).
  const producers: GeneriqueEntry[] = [...producerMap.values()]
    .sort((a, b) => b.amount - a.amount)
    .map((e) => ({
      key: e.key,
      name: e.name,
      avatarUrl: e.avatarUrl,
      roleLabel: e.roleLabel,
      isDual: e.isDual,
      tier: e.tier,
    }))

  return {
    filmTitle: film.title,
    artists: [...artistMap.values()],
    producers,
  }
}
