# CINEGENY — Slate Officielle 2026

> Source de vérité du code : `src/data/films.ts` (page d'accueil et `/films`).
> Pour l'ancien catalogue (archivé), voir la section 2 plus bas.

---

## 1. Les 6 Films Officiels

### 1. Le portrait de Oscar Wilde
- **Genre**: Drame — biopic
- **Réalisation**: Eric Haldezos — un film de Emmanuel Smadja
- **Durée**: 2h 04min · **Année**: 2026 · **Classification**: PG-13
- **Statut**: IN_PRODUCTION (55% production, 70% financement)
- **Logline**: Génie de l'esprit et martyr de son époque, Oscar Wilde fascine et scandalise le
  Londres victorien. Un portrait flamboyant de l'écrivain le plus spirituel — et le plus
  provocateur — de son siècle, de sa gloire à sa chute.
- **Tags**: biopic, littérature, époque victorienne, Oscar Wilde

### 2. Les souffrances du jeune Goethe
- **Genre**: Drame — adaptation littéraire
- **Réalisation**: Ludovic Clermont — d'après J.W. von Goethe
- **Durée**: 2h 10min · **Année**: 2026 · **Classification**: PG-13
- **Statut**: PRE_PRODUCTION (20% production, 45% financement)
- **Logline**: D'après le chef-d'œuvre de Goethe. Un jeune homme se consume d'un amour
  impossible pour une femme déjà promise. L'amour, la folie, l'éternité.
- **Tags**: romantisme, adaptation, amour, Goethe

### 3. Le voyage dans la Lune
- **Genre**: Science-fiction
- **Réalisation**: Frédéric Noël — Les Films de l'Akyme
- **Cast**: Jean Dupont, Sophie Marie, Pierre-Luc Leroy, Marie Glaude
- **Durée**: 2h 02min · **Année**: 2026 · **Classification**: PG
- **Statut**: PRE_PRODUCTION (30% production, 25% financement)
- **Logline**: Le premier film de science-fiction de l'histoire, ré-imaginé pour notre époque.
  L'épopée d'un explorateur visionnaire qui défie l'impossible pour atteindre la Lune.
- **Tags**: science-fiction, aventure, espace

### 4. Le dictionnaire de Voltaire
- **Genre**: Historique — satire
- **Réalisation**: François Laroche
- **Durée**: 1h 58min · **Année**: 2026 · **Classification**: PG-13
- **Statut**: IN_PRODUCTION (40% production, 60% financement)
- **Logline**: Une satire épique sur Voltaire et son combat des Lumières. Armé de sa plume et
  de son ironie, le philosophe affronte l'obscurantisme de son temps.
- **Tags**: Lumières, satire, historique, Voltaire

### 5. Le Dernier Convoi
- **Genre**: Historique — docu-drama
- **Réalisation**: Eric Haldezos
- **Durée**: 1h 52min · **Année**: 2026 · **Classification**: PG-13
- **Statut**: PRE_PRODUCTION (15% production, 20% financement)
- **Logline**: Août 1944 : alors que Paris est sur le point d'être libéré, un dernier train
  quitte Bobigny vers les camps. À travers les destins croisés de déportés, de résistants et
  de cheminots, ce docu-drama reconstitue les dernières heures d'une tragédie historique
  basée sur des témoignages réels.
- **Tags**: docu-drama, Shoah, histoire, résistance

### 6. The Artists
- **Genre**: Animation
- **Réalisation**: Eric Haldezos — produit par Emmanuel Smadja, curation & IA : Daniel Siboni
- **Durée**: 1h 35min · **Année**: 2026 · **Classification**: PG
- **Statut**: POST_PRODUCTION (100% production, 100% financement)
- **Logline**: Un petit garçon donne vie à ses dessins : une bande de petits monstres hauts en
  couleur s'échappe de sa feuille et devient les artistes les plus déjantés du monde. Une
  fable tendre sur l'imagination et la création.
- **Tags**: animation, famille, imagination, CINEGENY

---

## 2. Catalogue Archivé (legacy)

Un second catalogue d'environ 100 films (`src/data/archived-films.ts`) — l'ancienne slate
« Lumière Brothers Pictures » incluant des projets comme *MERCI... (The Miracle Protocol)*,
*KETER (The Singularity Point)*, *Le Code d'Esther*, *Zion of Africa*, etc. — n'est **plus
affiché par défaut** sur le site public.

Chaque film archivé peut être **réactivé individuellement** depuis
**`/admin/films-catalog`** ; l'état actif/inactif est persisté en base de données (modèle
Prisma `CatalogActivation`, exposé via `GET /api/catalog/active-archived` en lecture publique
et `POST /api/admin/catalog-activations` en écriture admin) — pas seulement dans le
navigateur de l'admin qui l'a activé.

Ces films existent aussi en base (`Film` model, `isPublic: false`) et restent éditables
depuis `/admin/films`, indépendamment de leur présence dans le catalogue public statique.

---

## 3. Studio & Sociétés

- **Marque publique**: CINEGENY
- **Références historiques/techniques conservées** (non visibles des utilisateurs) :
  enum Prisma `Catalog.LUMIERE` (catégorie de catalogue par défaut), domaine technique
  `cinegen.studio`, emails de comptes de démo `@lumiere.film`.
