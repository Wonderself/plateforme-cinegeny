'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Copy, RefreshCw, Loader2, Pencil } from 'lucide-react'
import { setInvestorsPasswordAction, regenerateInvestorsPasswordAction } from '@/app/actions/investors-gate'

interface Props {
  initialPassword: string
}

export function InvestorsPasswordPanel({ initialPassword }: Props) {
  const [password, setPassword] = useState(initialPassword)
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleCopy() {
    navigator.clipboard.writeText(password)
    toast.success('Mot de passe copié')
  }

  function handleRegenerate() {
    startTransition(async () => {
      const result = await regenerateInvestorsPasswordAction()
      if (result.success && result.password) {
        setPassword(result.password)
        setVisible(true)
        toast.success('Nouveau mot de passe généré')
      } else {
        toast.error(result.error || 'Échec de la régénération')
      }
    })
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return toast.error('Mot de passe requis')
    startTransition(async () => {
      const result = await setInvestorsPasswordAction(draft.trim())
      if (result.success && result.password) {
        setPassword(result.password)
        setVisible(true)
        setEditing(false)
        setDraft('')
        toast.success('Mot de passe mis à jour')
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
        <code className="flex-1 text-sm font-mono text-white tracking-wide">
          {visible ? password : '•'.repeat(Math.max(password.length, 8))}
        </code>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-white/40 hover:text-white/70 transition-colors"
          aria-label={visible ? 'Masquer' : 'Afficher'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="text-white/40 hover:text-white/70 transition-colors"
          aria-label="Copier"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-white/40">
        Communiquez ce mot de passe aux investisseurs autorisés pour qu&apos;ils accèdent à{' '}
        <span className="text-white/60">/investors</span>.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setEditing((v) => !v); setDraft('') }}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 text-xs font-medium rounded-lg border border-white/10 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Changer
        </button>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#C9A227] text-xs font-medium rounded-lg border border-[#C9A227]/20 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Régénérer
        </button>
      </div>

      {editing && (
        <form onSubmit={handleEditSubmit} className="space-y-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div>
            <label className="text-[10px] text-white/50 mb-1 block">Nouveau mot de passe</label>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nouveau mot de passe..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-[#C9A227]/50 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C9A227] hover:bg-[#E8C766] text-white text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Confirmer
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
