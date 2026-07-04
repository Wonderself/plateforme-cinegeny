// ─────────────────────────────────────────────────────────────────────────────
// CINEGENY — Règles de coproduction & paliers du générique (session 15.11)
//
// Source de vérité unique pour :
//  - le montant MINIMUM qu'un coproducteur doit mettre,
//  - les PALIERS d'affichage au générique (plus on met, plus le nom est gros).
//
// Toute surface (formulaire coprod, générique, admin) doit lire ces valeurs ICI.
// ─────────────────────────────────────────────────────────────────────────────

/** Montant minimum d'une coproduction, en euros (décision fondateur, 15.11). */
export const COPROD_MIN_EUR = 100

/**
 * Paliers d'affichage d'un producteur au générique, du plus prestigieux au plus
 * modeste. Le premier palier dont `min` est atteint gagne la partie.
 *  - grand  : ≥ 10 000 €  → nom en gros
 *  - moyen  : ≥ 500 €     → nom moyen
 *  - petit  : ≥ 100 €     → nom en petit (plancher = minimum de coproduction)
 */
export type CreditTierId = 'grand' | 'moyen' | 'petit'

export interface CreditTier {
  id: CreditTierId
  /** Montant minimum (€) pour atteindre ce palier. */
  min: number
  label: string
}

export const CREDIT_TIERS: CreditTier[] = [
  { id: 'grand', min: 10_000, label: 'Producteur principal' },
  { id: 'moyen', min: 500, label: 'Coproducteur' },
  { id: 'petit', min: COPROD_MIN_EUR, label: 'Coproducteur associé' },
]

/**
 * Renvoie le palier d'affichage pour un montant investi (€).
 * En dessous du minimum (ou montant inconnu), on retombe sur le plus petit
 * palier — un producteur crédité manuellement sans montant reste affiché.
 */
export function creditTierForAmount(amountEur: number | null | undefined): CreditTier {
  if (typeof amountEur === 'number') {
    for (const tier of CREDIT_TIERS) {
      if (amountEur >= tier.min) return tier
    }
  }
  return CREDIT_TIERS[CREDIT_TIERS.length - 1]
}
