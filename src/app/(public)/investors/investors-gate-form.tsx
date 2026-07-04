'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { verifyInvestorsPasswordAction } from '@/app/actions/investors-gate'

export function InvestorsGateForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!password.trim()) {
      setError('Mot de passe requis.')
      return
    }
    startTransition(async () => {
      const result = await verifyInvestorsPasswordAction(password)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Mot de passe incorrect.')
      }
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-[#0A0A0A]">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-4">
            <ShieldCheck className="h-8 w-8 text-[#C9A227]" />
          </div>
          <h1 className="text-3xl font-bold text-white font-playfair">Espace investisseurs</h1>
          <p className="text-white/50 text-sm">
            Accès réservé aux personnes ayant reçu le mot de passe de la part de l&apos;équipe CINEGENY.
          </p>
        </div>

        <div className="relative sm:rounded-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-10 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-400 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="investors-password" className="text-white/70 text-sm font-medium block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <input
                  id="investors-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="off"
                  autoFocus
                  className="w-full pl-11 pr-11 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-[#C9A227]/40 focus:ring-1 focus:ring-[#C9A227]/20 outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-[#C9A227] hover:bg-[#E8C766] text-white font-semibold shadow-lg shadow-[#C9A227]/20 hover:shadow-[#C9A227]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isPending ? <><Loader2 className="h-5 w-5 animate-spin" /> Vérification...</> : 'Accéder'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40">
          Vous investissez sur un film en particulier ?{' '}
          <a href="/invest" className="text-[#C9A227] hover:text-[#E8C766] transition-colors duration-300 font-medium">
            Voir la co-production
          </a>
        </p>
      </div>
    </div>
  )
}
