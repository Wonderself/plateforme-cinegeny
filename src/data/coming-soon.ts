/**
 * « Prochainement » — titres en développement affichés dans le mur d'affiches
 * (accueil + /films) pour montrer l'ampleur du catalogue à venir.
 *
 * Liste éditoriale (le fondateur : des dizaines de films bientôt, une centaine
 * à terme). Aucun compteur de votes ici — uniquement des affiches et des
 * titres ; les chiffres de vote restent réservés aux films en compétition.
 */

export interface ComingSoonFilm {
  title: string
  genre: string
  posterUrl: string
}

export const COMING_SOON: ComingSoonFilm[] = [
  { title: 'KETER: The Final Algorithm', genre: 'Sci-Fi', posterUrl: '/posters/keter.jpg' },
  { title: 'The Miracle Protocol', genre: 'Thriller', posterUrl: '/posters/miracle-protocol.jpg' },
  { title: 'The Esther Code', genre: 'Mystère', posterUrl: '/posters/esther-code.jpg' },
  { title: 'ORTISTS (The Gift)', genre: 'Drame', posterUrl: '/posters/ortists.jpg' },
  { title: 'The Rebbe', genre: 'Biopic', posterUrl: '/posters/the-rebbe.jpg' },
  { title: 'Secret of the Menorah', genre: 'Aventure', posterUrl: '/posters/secret-menorah.jpg' },
  { title: 'MEAM LOEZ', genre: 'Historique', posterUrl: '/posters/meam-loez.jpg' },
]
