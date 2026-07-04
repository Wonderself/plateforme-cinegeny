import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { FILMS_BY_SLUG } from '@/data/films'
import { VOTE } from '@/content/brand'

/**
 * Image de partage d'une fiche film — l'artefact viral : quand un lien
 * /films/[slug] circule sur X, WhatsApp ou LinkedIn, c'est CETTE image
 * qui s'affiche. Affiche du film + compteur de votes réel + marque or.
 */

export const runtime = 'nodejs'
export const alt = 'Votez pour ce film sur CINEGENY'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadPoster(coverImageUrl: string | null): Promise<string | null> {
  if (!coverImageUrl || !coverImageUrl.startsWith('/')) return null
  try {
    const buf = await readFile(join(process.cwd(), 'public', coverImageUrl))
    const ext = coverImageUrl.endsWith('.png') ? 'png' : 'jpeg'
    return `data:image/${ext};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

async function loadVoteCount(slug: string): Promise<number> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbFilm = await prisma.film.findUnique({ where: { slug }, select: { id: true } })
    if (!dbFilm) return 0
    return await prisma.filmVote.count({
      where: { filmId: dbFilm.id, voteType: 'vote', confirmed: true },
    })
  } catch {
    return 0
  }
}

export default async function FilmOGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const film = FILMS_BY_SLUG[slug] ?? null
  const [poster, voteCount] = await Promise.all([
    loadPoster(film?.coverImageUrl ?? null),
    film ? loadVoteCount(slug) : Promise.resolve(0),
  ])

  const title = film?.title ?? 'CINEGENY'
  const genre = film?.genre ?? ''
  const pct = Math.max(0, Math.min(100, (voteCount / VOTE.threshold) * 100))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0A0908',
          position: 'relative',
        }}
      >
        {/* Halo or */}
        <div
          style={{
            position: 'absolute',
            top: '-140px',
            left: '-100px',
            width: '700px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,162,39,0.14) 0%, transparent 70%)',
          }}
        />
        {/* Filets or haut/bas */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />

        {/* Colonne texte */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 48px 64px 72px',
          }}
        >
          <div
            style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '8px',
              background: 'linear-gradient(135deg, #8A6A12 0%, #C9A227 30%, #F5D77A 50%, #C9A227 70%, #8A6A12 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            CINEGENY
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: '28px',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '6px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(201,162,39,0.4)',
                background: 'rgba(201,162,39,0.10)',
                color: '#E8C766',
                fontSize: '18px',
                letterSpacing: '3px',
                fontWeight: 700,
              }}
            >
              EN VOTE
            </div>
            {genre ? (
              <div
                style={{
                  display: 'flex',
                  padding: '6px 18px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '18px',
                  letterSpacing: '2px',
                }}
              >
                {genre}
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginTop: '24px',
              fontSize: title.length > 26 ? '52px' : '64px',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.08,
              maxWidth: '640px',
            }}
          >
            {title}
          </div>

          {/* Compteur + barre */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '40px', gap: '14px' }}>
            <div
              style={{
                fontSize: '44px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #C9A227 0%, #F5D77A 50%, #C9A227 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {voteCount.toLocaleString('fr-FR')}
            </div>
            <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.45)' }}>
              {`/ ${VOTE.threshold.toLocaleString('fr-FR')} votes — et le film se fait`}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '18px',
              width: '620px',
              height: '14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                width: `${Math.max(pct, 2)}%`,
                height: '14px',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #8A6A12, #C9A227, #F5D77A)',
              }}
            />
          </div>

          <div style={{ marginTop: '34px', fontSize: '22px', color: 'rgba(232,199,102,0.85)', letterSpacing: '1px' }}>
            Votre vote lance ce film. 1 vote gratuit.
          </div>
        </div>

        {/* Affiche */}
        {poster ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '48px 64px 48px 0',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              width={356}
              height={534}
              style={{
                width: '356px',
                height: '534px',
                objectFit: 'cover',
                borderRadius: '20px',
                border: '2px solid rgba(201,162,39,0.45)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    { ...size }
  )
}
