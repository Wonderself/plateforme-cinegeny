'use client'

import Link from 'next/link'
import {
  Film, Play, Tv, Trophy, Users, Briefcase, GraduationCap, Coins,
  TrendingUp, Info, MapPin, Clapperboard,
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { BRAND, FOOTER_COLUMNS } from '@/content/brand'

/**
 * Footer — miroir de l'architecture d'information du header (session 15.1) :
 * les 4 piliers (Films · Regarder · Participer · Co-produire) + CINEGENY.
 * Wording et destinations viennent de `src/content/brand.ts` (source de vérité).
 */

// Icônes de la couche présentation, associées aux destinations de brand.ts.
const LINK_ICONS: Record<string, React.ElementType> = {
  '/films': Film,
  '/finale': Trophy,
  '/leaderboard': Trophy,
  '/streaming': Play,
  '/tv': Tv,
  '/residence': Trophy,
  '/atelier': Clapperboard,
  '/createurs': Film,
  '/create': Users,
  '/work': Briefcase,
  '/academy': GraduationCap,
  '/invest': Coins,
  '/investors': TrendingUp,
  '/about': Info,
  '/roadmap': MapPin,
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#060606] pt-20 md:pt-24 pb-12 md:pb-16 mt-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-5">
            <Logo height={62} />
            <p className="text-[13px] text-white/30 leading-[1.8] max-w-sm">
              {BRAND.pitch}
            </p>
            <p className="text-[13px] font-medium text-[#C9A227]/70">{BRAND.baseline}</p>
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Paris</span>
              <div className="h-1 w-1 rounded-full bg-[#C9A227]/30" />
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Jérusalem</span>
            </div>
          </div>

          {/* Colonnes de liens — une par pilier de l'IA */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2 space-y-5">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{col.title}</h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => {
                  const Icon = LINK_ICONS[link.href]
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-[13px] text-white/25 transition-colors hover:text-[#C9A227]"
                      >
                        {Icon && <Icon className="h-3.5 w-3.5 opacity-40 transition-opacity group-hover:opacity-100" />}
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-10 border-t border-white/[0.04] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} {BRAND.name} Films. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/legal/terms" className="text-[11px] text-white/20 transition-colors hover:text-white/50">Conditions d’utilisation</Link>
            <span className="text-[10px] text-white/10">&middot;</span>
            <Link href="/legal/privacy" className="text-[11px] text-white/20 transition-colors hover:text-white/50">Confidentialité</Link>
            <span className="text-[10px] text-white/10">&middot;</span>
            <Link href="/legal/cookies" className="text-[11px] text-white/20 transition-colors hover:text-white/50">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
