'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Armchair, Plus, Trash2, Loader2, Clapperboard, Gem, Users } from 'lucide-react'
import {
  getFilmCuratedCreditsAction,
  addFilmCreditAction,
  removeFilmCreditAction,
} from '@/app/actions/credits-admin'

type FilmOption = { id: string; title: string; slug: string }
type Credit = Awaited<ReturnType<typeof getFilmCuratedCreditsAction>>[number]

const ROLE_LABELS: Record<string, { label: string; icon: typeof Clapperboard; color: string }> = {
  ARTIST: { label: 'Artiste', icon: Clapperboard, color: 'text-blue-300' },
  PRODUCER: { label: 'Producteur', icon: Gem, color: 'text-[#E8C766]' },
  ARTIST_PRODUCER: { label: 'Artiste & Producteur', icon: Users, color: 'text-emerald-300' },
}

export function GeneriqueManager({
  films,
  initialCredits,
}: {
  films: FilmOption[]
  initialCredits: Credit[]
}) {
  const [filmId, setFilmId] = useState<string>(films[0]?.id ?? '')
  const [credits, setCredits] = useState<Credit[]>(initialCredits)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Formulaire d'ajout
  const [name, setName] = useState('')
  const [role, setRole] = useState<'ARTIST' | 'PRODUCER' | 'ARTIST_PRODUCER'>('PRODUCER')
  const [roleLabel, setRoleLabel] = useState('')
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const showsAmount = role === 'PRODUCER' || role === 'ARTIST_PRODUCER'

  function refresh(id: string) {
    if (!id) return
    setLoading(true)
    getFilmCuratedCreditsAction(id)
      .then(setCredits)
      .catch(() => toast.error('Impossible de charger les crédits'))
      .finally(() => setLoading(false))
  }

  function handleFilmChange(id: string) {
    setFilmId(id)
    refresh(id)
  }

  function handleAdd() {
    if (!name.trim()) {
      toast.error('Le nom est requis')
      return
    }
    startTransition(async () => {
      const res = await addFilmCreditAction({
        filmId,
        name: name.trim(),
        role,
        roleLabel: roleLabel.trim(),
        userId: userId.trim(),
        amountEur: showsAmount && amount.trim() ? Number(amount) : undefined,
        note: note.trim(),
        order: credits.length,
      })
      if (res.success) {
        toast.success('Crédit ajouté au générique')
        setName('')
        setRoleLabel('')
        setUserId('')
        setAmount('')
        setNote('')
        refresh(filmId)
      } else {
        toast.error(res.error ?? 'Échec de l’ajout')
      }
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      const res = await removeFilmCreditAction(id)
      if (res.success) {
        toast.success('Crédit retiré')
        setCredits((c) => c.filter((x) => x.id !== id))
      } else {
        toast.error(res.error ?? 'Échec de la suppression')
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#E8C766] text-black">
          <Armchair className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Générique — la chaise dorée
          </h1>
          <p className="text-sm text-white/50 mt-0.5">
            Les artistes sont crédités automatiquement (tâches validées, scénario gagnant).
            Ajoutez ici les producteurs (coprods) et les crédits manuels.
          </p>
        </div>
      </div>

      {/* Sélecteur de film */}
      <div>
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Film</label>
        <select
          value={filmId}
          onChange={(e) => handleFilmChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-[#C9A227]/40 focus:outline-none"
        >
          {films.length === 0 && <option value="">Aucun film</option>}
          {films.map((f) => (
            <option key={f.id} value={f.id} className="bg-[#0A0908]">
              {f.title}
            </option>
          ))}
        </select>
      </div>

      {/* Formulaire d'ajout */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Ajouter un crédit</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-white/50">Nom affiché *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Marie Dupont"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A227]/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/50">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#C9A227]/40 focus:outline-none"
            >
              <option value="PRODUCER" className="bg-[#0A0908]">Producteur (coprod / argent)</option>
              <option value="ARTIST" className="bg-[#0A0908]">Artiste (créateur)</option>
              <option value="ARTIST_PRODUCER" className="bg-[#0A0908]">Artiste & Producteur (travail contre parts)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/50">Intitulé précis (optionnel)</label>
            <input
              value={roleLabel}
              onChange={(e) => setRoleLabel(e.target.value)}
              placeholder="ex. Producteur exécutif"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A227]/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/50">ID utilisateur (optionnel)</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="rattacher à un compte"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A227]/40 focus:outline-none"
            />
          </div>
          {showsAmount && (
            <div className="sm:col-span-2">
              <label className="text-xs text-white/50">Montant investi (€) — pilote la taille au générique</label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ex. 10000"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A227]/40 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-white/35">
                ≥ 10 000 € : en gros · ≥ 500 € : moyen · ≥ 100 € : en petit (minimum de coproduction : 100 €)
              </p>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="text-xs text-white/50">Note interne (optionnel — non publique)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ex. 5 000 € investis / 2 % de parts"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A227]/40 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={isPending || !filmId}
          className="inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#E8C766] disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Ajouter au générique
        </button>
      </div>

      {/* Liste des crédits curés */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Crédits saisis</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : credits.length === 0 ? (
          <p className="text-sm text-white/40">
            Aucun crédit manuel. Les artistes restent crédités automatiquement.
          </p>
        ) : (
          <div className="space-y-2">
            {credits.map((c) => {
              const cfg = ROLE_LABELS[c.role] ?? ROLE_LABELS.PRODUCER
              const RoleIcon = cfg.icon
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <RoleIcon className={`h-4 w-4 shrink-0 ${cfg.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {c.user?.displayName ?? c.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {cfg.label}
                      {c.roleLabel ? ` · ${c.roleLabel}` : ''}
                      {c.amountEur ? ` · ${c.amountEur.toLocaleString('fr-FR')} €` : ''}
                      {c.note ? ` · ${c.note}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(c.id)}
                    disabled={isPending}
                    className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    aria-label="Retirer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
