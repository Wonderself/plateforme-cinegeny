import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { submitFilmAction } from '@/app/actions/catalog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Film, Upload, FileText, Shield, Clock, Wand2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Markdown } from '@/components/ui/markdown'
import { generateFilmContract } from '@/lib/contracts'
import { ATELIER, FILM_DURATION } from '@/content/atelier'

export default async function SubmitFilmPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const previewContract = generateFilmContract({
    creatorName: '[Votre nom]',
    filmTitle: '[Titre du film]',
    revenueSharePct: 50,
    exclusivity: false,
    exclusivityBonus: 10,
    signDate: new Date().toLocaleDateString('fr-FR'),
  })

  return (
    <div className="min-h-screen bg-[#0A0908]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/atelier" className="text-sm text-white/40 transition-colors duration-300 hover:text-[#E8C766]">
          ← Retour à l’Atelier
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="font-playfair text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Insérer votre <span className="text-gold-brushed">création</span>
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/50">
            Bande-annonce ou film terminé : insérez votre œuvre, la communauté vote,
            et vous gagnez de l’argent à chaque vue une fois le film en ligne.
          </p>
        </div>

        {/* Règle de format — impossible à manquer */}
        <div className="border-gold-brushed relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#C9A227]/[0.10] via-[#0E0D0A] to-transparent p-5">
          <div className="flex items-start gap-4">
            <span className="bg-gold-brushed inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[#E8C766]">
                Format des films : {FILM_DURATION.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/50">{FILM_DURATION.rule}</p>
            </div>
          </div>
        </div>

        {/* Pas encore de film ? → l'Atelier de création */}
        <Link
          href={ATELIER.href}
          className="group mb-10 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-colors hover:border-[#C9A227]/30"
        >
          <div className="flex items-center gap-3">
            <Wand2 className="h-5 w-5 text-[#C9A227]" />
            <p className="text-sm text-white/60">
              Votre bande-annonce n’est pas prête ?{' '}
              <span className="font-semibold text-white">Créez-la avec l’Atelier</span> — script,
              storyboard et moteurs vidéo IA.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#E8C766]" />
        </Link>

        {/* Revenue Info */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-[#C9A227]/20 bg-[#C9A227]/5 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gold-brushed">50%</p>
              <p className="text-sm text-white/50">Part créateur par défaut</p>
            </CardContent>
          </Card>
          <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">+10%</p>
              <p className="text-sm text-white/50">Bonus exclusivité</p>
            </CardContent>
          </Card>
          <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">Mensuel</p>
              <p className="text-sm text-white/50">Paiement fin de mois</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-[#C9A227]/15 to-transparent" />

        <form action={async (formData: FormData) => {
          'use server'
          await submitFilmAction(null, formData)
        }}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left — Form */}
            <div className="space-y-6">
              <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Film className="h-5 w-5 text-[#C9A227]" /> Informations du film
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/60">Titre *</Label>
                    <Input name="title" required className="mt-1 border-white/[0.08] bg-white/5 text-white" placeholder="Le titre de votre film" />
                  </div>
                  <div>
                    <Label className="text-white/60">Synopsis *</Label>
                    <Textarea name="synopsis" required className="mt-1 border-white/[0.08] bg-white/5 text-white" rows={4} placeholder="Décrivez votre film..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Genre</Label>
                      <Input name="genre" className="mt-1 border-white/[0.08] bg-white/5 text-white" placeholder="Sci-Fi, Drame..." />
                    </div>
                    <div>
                      <Label className="text-white/60">Année</Label>
                      <Input name="year" type="number" className="mt-1 border-white/[0.08] bg-white/5 text-white" placeholder="2026" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Durée (minutes) *</Label>
                      <Input
                        name="durationMinutes"
                        type="number"
                        required
                        min={FILM_DURATION.minMinutes}
                        max={FILM_DURATION.maxMinutes}
                        className="mt-1 border-white/[0.08] bg-white/5 text-white"
                        placeholder="Ex : 45"
                      />
                      <p className="mt-1 text-xs text-[#C9A227]/70">
                        {FILM_DURATION.label}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white/60">Langue</Label>
                      <Input name="language" defaultValue="fr" className="mt-1 border-white/[0.08] bg-white/5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Upload className="h-5 w-5 text-[#C9A227]" /> Fichiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/60">URL de la vidéo *</Label>
                    <Input name="videoUrl" required className="mt-1 border-white/[0.08] bg-white/5 text-white" placeholder="https://..." />
                    <p className="mt-1 text-xs text-white/20">Lien direct vers le fichier vidéo (MP4, WebM)</p>
                  </div>
                  <div>
                    <Label className="text-white/60">URL bande-annonce</Label>
                    <Input name="trailerUrl" className="mt-1 border-white/[0.08] bg-white/5 text-white" placeholder="https://..." />
                    <p className="mt-1 text-xs text-white/20">
                      Créée avec l’Atelier ou importée — c’est elle que la communauté verra en premier.
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/60">URL affiche / thumbnail</Label>
                    <Input name="thumbnailUrl" className="mt-1 border-white/[0.08] bg-white/5 text-white" placeholder="https://..." />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-[#C9A227]" /> Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" name="exclusivity" value="true" className="mt-1 accent-[#C9A227]" />
                    <div>
                      <p className="font-medium text-white">CINEGENY Exclusive</p>
                      <p className="text-sm text-white/40">Ne pas diffuser sur d&apos;autres plateformes → +10% de revenus</p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" name="isContest" value="true" className="mt-1 accent-[#C9A227]" />
                    <div>
                      <p className="font-medium text-white">Participer au concours mensuel</p>
                      <p className="text-sm text-white/40">Votre film sera visible dans la section concours</p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Right — Contract Preview */}
            <div className="space-y-6">
              <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5 text-[#C9A227]" /> Contrat de distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <Markdown content={previewContract} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#C9A227]/20 bg-[#C9A227]/5 backdrop-blur-sm">
                <CardContent className="p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" name="acceptTerms" value="true" required className="mt-1 accent-[#C9A227]" />
                    <p className="text-sm text-white/70">
                      J&apos;ai lu et j&apos;accepte les conditions du contrat de distribution.
                      Je certifie être le titulaire des droits sur cette œuvre.
                    </p>
                  </label>
                </CardContent>
              </Card>

              <button
                type="submit"
                className="bg-gold-brushed btn-sheen w-full rounded-xl py-3.5 text-lg font-bold transition-all"
              >
                Insérer mon film
              </button>
              <p className="text-center text-xs text-white/20">
                Votre film sera vérifié par notre équipe avant d&apos;être publié dans le catalogue.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
