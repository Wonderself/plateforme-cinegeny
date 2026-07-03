# CINEGENY — Roadmap Technique Detaillee

> Chaque etape inclut le **prompt pret a copier** pour Claude Code et la **liste de prerequis** (ce que le fondateur doit fournir avant de lancer).

---

## ETAT ACTUEL (Juin 2026)

### Fait — Fondations (jusqu'a Fevrier 2026)
- [x] Architecture Next.js 16 + Prisma 7 (108 modeles) + PostgreSQL + Redis
- [x] Auth complete (register, login, reset password, roles, Google OAuth)
- [x] Pipeline de production par phases (10 phases : SCRIPT -> STORYBOARD -> PREVIZ -> DESIGN -> ANIMATION -> VFX -> AUDIO -> EDITING -> COLOR -> FINAL)
- [x] Design Netflix premium (hero banner, film rows, top 10, creator bar)
- [x] Systeme de vote blockchain (hash SHA-256, pret pour on-chain)
- [x] Scenarios communautaires (soumission + vote)
- [x] Concours de bandes-annonces + Trailer Studio complet (32 types de taches)
- [x] Streaming catalog + TV en direct
- [x] Tokenisation V4 (modeles DB complets)
- [x] Dashboard admin complet (~65 sous-sections)
- [x] Creator tools (profil, videos, social, scheduler)
- [x] Systeme de credits IA (packs prepayes, commission 20%)
- [x] Paiements Stripe (modeles prets)

### Fait — Refonte & mise en production (Juin 2026)
- [x] **Marque unifiee CINEGENY** partout (ex-"Lumiere" cote public ; references techniques
      legacy conservees : enum `Catalog.LUMIERE`, emails de demo `@lumiere.film`)
- [x] **Theme noir & or premium** (logo, boutons avec sheen anime, cartes de films avec
      hover-lift, fiche film entierement refondue, motion/Framer Motion)
- [x] **Catalogue reduit a 6 films officiels** (`src/data/films.ts`) sur l'accueil et
      `/films` ; ~100 films legacy archives (`src/data/archived-films.ts`) reactivables
      individuellement depuis `/admin/films-catalog`, avec etat persiste en base
      (modele `CatalogActivation`, pas seulement localStorage)
- [x] Tous les films existent aussi en base (`Film` model), geres depuis `/admin/films`
- [x] **Menus simplifies** : header/footer/sidebar restructures autour de 5 intentions
      claires (Films, Regarder, Participer, Investir, Communaute) au lieu d'entrees eparses
- [x] **CINEGENY Academy** — cours complet migre depuis l'ancien fork : 3 niveaux, 29 lecons,
      87 prompts copiables, images ; gratuite pour tout membre, mise en avant dans le menu
      connecte, le footer, l'accueil et la page d'inscription (`src/content/academy.ts`,
      pages `/academy` et `/academy/[level]/[slug]`)
- [x] **Securite** : suppression d'un bypass d'authentification code en dur
      (`admin@admin.com` / `adminadmin`) qui etait affiche publiquement sur `/login` —
      voir `SECURITY.md` section 0
- [x] **Script bootstrap admin** (`prisma/bootstrap-admin.cjs`) — cree un compte admin sans
      injecter de donnees de demo, declenchable via `ADMIN_BOOTSTRAP` en production
- [x] **Fix build production** : `next.config.ts` ignore la verification TypeScript/ESLint
      pendant `next build` (deja assuree par la CI) — evite un OOM sur le serveur de deploiement
- [x] Domaine de production pilote par `NEXT_PUBLIC_APP_URL` (plus de domaine en dur dans le SEO/OG)

### En cours
- [ ] Integration Claude AI reelle (remplacement du mock de review)
- [ ] Invitation scenaristes (systeme d'invitation en masse)

---

## PHASE 15 — REFONTE « CLARTE & LANCEMENT » (PRIORITE ABSOLUE — Juillet 2026)

> **Objectif** : un visiteur novice comprend en 5 secondes ce que propose CINEGENY, vote en
> 30 secondes, et sait pourquoi revenir. C'est la phase qui prepare le premier lancement
> public. Elle passe AVANT toutes les autres phases en attente.

### 15.0 Decisions strategiques verrouillees (fondateur, Juillet 2026)

1. **Pitch** : CINEGENY est le studio de cinema IA ou le public decide — un 360 complet de
   la creation au streaming, en passant par le vote et le financement.
2. **Cible n°1** : grand public novice + petits investisseurs. Zero jargon.
3. **Action prioritaire du visiteur** : VOTER. Les autres parcours (contribuer, investir,
   regarder, apprendre) sont proposes selon le profil, apres le vote.
4. **Hierarchie des piliers** : (1) Vote, (2) Production collaborative, (3) Streaming.
   Academy = produit d'appel pour les reseaux sociaux. Tokenisation/TV = bonus discrets.
   **TV en direct retiree du site public.**
5. **Systeme de vote (LA mecanique centrale du site)** :
   - Deux competitions distinctes :
     - **Piste A — Bandes-annonces en competition** : films au stade bande-annonce.
       **A 5 000 votes, le film part en production.**
     - **Piste B — Films en competition** : films deja developpes. **A 5 000 votes, le
       film entre dans la Finale annuelle** ; en fin d'annee, des prix sont a gagner
       (voyages) pour la communaute votante.
   - 1 vote gratuit par film et par personne. **Pas de mise de points** (le staking est
     abandonne cote public : incompris, il brouille le message).
   - **Vote anonyme autorise** : le vote est enregistre immediatement (cookie + hash IP),
     puis une inscription rapide (email) le confirme et le rend definitif. Anti-fraude :
     rate limiting, 1 vote confirme par compte et par film.
   - Les 6 films officiels demarrent tous en statut **« En vote »**, compteurs reels
     affiches (meme bas) : **zero chiffre invente, zero stat aleatoire**.
6. **Axe de navigation du catalogue — un seul, celui du parcours d'un film** :
   « En vote » → « En production » → « A regarder ». Pas d'autre taxonomie publique.
7. **Une seule monnaie publique** : les **Points CINEGENY** (gagnes en votant, contribuant,
   parrainant ; utilises pour les recompenses et le concours). Credits IA = usage interne
   outils uniquement. Lumens et tokens retires de l'interface publique.
8. **Investissement au lancement** : pas d'argent reel — page « Devenir co-producteur » en
   **liste d'attente** (capture email + montant d'intention), ouverture des co-productions
   annoncee « apres la premiere selection ». Evite tout risque legal avant structuration
   (les phases Stripe/tokenisation existantes restent pour plus tard).
9. **Accueil** : vitrine type Netflix (hero + rows), mais dont chaque bloc sert la
   comprehension et le vote.
10. **Design** : on garde le theme noir & or et on l'affine (contraste, respiration,
    hierarchie typographique). Pas de changement d'identite.
11. **Langue** : 100 % francais pour cette phase (la Phase 14 bilingue vient apres).
12. **Ton** : communautaire et enthousiaste — « un mouvement », pas une institution.
13. **Angle de lancement** : « Le premier studio de cinema ou VOUS decidez du prochain
    film IA. 5 000 votes, et le film se fait. » Le compteur public de votes EST la
    campagne de lancement.
14. **Sessions** : taille moyenne, validees une par une par le fondateur (pas de sessions
    autonomes). Deploiement par le fondateur via Coolify apres chaque validation.

### 15.0bis PROMPT MAITRE de la refonte (a coller en tete de CHAQUE session 15.x)

```text
Tu es l'architecte produit et le lead designer de CINEGENY (Next.js 16 App Router,
React 19, Tailwind 4, Prisma 7 + PostgreSQL, next-intl FR). Tu executes une session de la
PHASE 15 « Clarte & Lancement » decrite dans ROADMAP.md — lis d'abord la section 15.0
(decisions verrouillees) : elle prime sur tout le reste.

CONTEXTE PRODUIT
CINEGENY est le studio de cinema IA ou le public decide : la communaute vote pour les
films (bandes-annonces et films developpes), les films plebiscites sont produits de
maniere collaborative, puis diffuses en streaming sur la plateforme. Cible : grand public
novice et petits investisseurs. Ton : communautaire, enthousiaste, simple — on s'adresse a
quelqu'un qui n'a jamais entendu parler de nous et n'y connait rien en cinema ni en IA.

LA MECANIQUE A RENDRE LIMPIDE PARTOUT
« Regardez. Votez. Le film se fait. »
- Piste A (bandes-annonces) : 5 000 votes => le film part en production.
- Piste B (films developpes) : 5 000 votes => Finale annuelle, prix a gagner (voyages).
- 1 vote gratuit par film. Vote possible sans compte, confirme par inscription rapide.
- Un film suit un parcours unique et visible : En vote -> En production -> A regarder.

REGLES NON NEGOCIABLES
1. ZERO donnee inventee : pas de compteurs codes en dur, pas de seededRandom, pas de
   pourcentages fictifs. Tout compteur affiche vient de la base (ou n'est pas affiche).
2. Une seule monnaie publique : les Points CINEGENY. Ne jamais exposer lumens, tokens ou
   credits IA dans un parcours grand public.
3. 100 % francais sur toute surface publique (labels, boutons, categories, messages
   d'erreur, emails). Aucun label anglais residuel.
4. Theme noir & or existant (#0A0908 / #C9A227, .text-gold-metallic, .btn-sheen,
   composants ui/ existants) — on affine, on ne remplace pas. Viser un rendu premium :
   plus de respiration, hierarchie typographique nette, 1 CTA principal par ecran.
5. Chaque page publique doit repondre en un ecran a : qu'est-ce que c'est ? qu'est-ce que
   j'y gagne ? que dois-je faire maintenant ? Si un element ne sert pas une de ces trois
   reponses, il saute ou descend sous le pli.
6. Vocabulaire fixe (ne pas creer de synonymes) : « voter », « En vote », « En
   production », « A regarder », « co-producteur », « Points CINEGENY », « Finale
   CINEGENY ». Bannir cote public : staking, tokenisation, gouvernance, DAO, micro-tache.
7. Pas d'argent reel au lancement : tout parcours d'investissement aboutit a la liste
   d'attente co-producteurs, jamais a un paiement.
8. Mobile d'abord : chaque ecran est concu et verifie en 390px avant le desktop.
9. Accessibilite : contrastes AA sur fond noir, focus visibles, alt sur les affiches.
10. Ne casse rien : les pages retirees du public font l'objet de redirects 308 ; l'admin
    et les modeles Prisma existants sont conserves.

QUALITE ATTENDUE
Niveau « produit qu'on montre a la presse » : inspiration Netflix (vitrine), Kickstarter
(clarte de la mecanique et des compteurs), Ulule/KissKissBankBank (chaleur communautaire
francaise). Code TypeScript strict, composants reutilisables dans src/components,
contenus editables centralises dans src/content ou src/data, tests sur la logique de
vote. Termine chaque session par : npx tsc --noEmit && npx vitest run, et un recapitulatif
de ce qui a change avec les URLs a verifier pour validation par le fondateur.
```

### Sessions d'execution (dans l'ordre — 1 session = 1 validation fondateur)

### 15.1 Fondations du message — architecture de l'information & wording
**Statut**: A FAIRE · **Modele**: **Opus** (travail de strategie/copywriting, faible volume de code)
> Creer `src/content/brand.ts` : pitch officiel, baseline « Regardez. Votez. Le film se
> fait. », vocabulaire fixe (regle 6 du prompt maitre), definition des 3 statuts du
> parcours film, texte « Comment ca marche » en 3 etapes maximum (formule grand public a
> proposer en 2-3 variantes au fondateur), noms officiels des deux pistes de vote et de la
> Finale CINEGENY. Restructurer header/footer autour de 4 entrees : Films (voter),
> Regarder, Participer, Co-produire — Academy mise en avant comme accroche. Livrable
> soumis au fondateur AVANT toute session suivante : c'est la source de verite du wording.
> **Prerequis fondateur** : valider les noms des pistes et la formule « Comment ca marche ».

### 15.2 Vote reel branche en base + parcours vote anonyme
**Statut**: A FAIRE · **Modele**: **Sonnet** (implementation backend cadree)
> Remplacer integralement le vote localStorage de `src/components/films/vote-panel.tsx`
> par le modele Prisma `FilmVote` existant (adapte si besoin) : server actions + API de
> vote, piste A/B par film, compteur reel, seuil 5 000 avec barre de progression,
> vote anonyme (cookie + hash IP) confirme a l'inscription, contrainte unique
> user+film, rate limiting (lib existante `src/lib/rate-limit.ts`), tests Vitest sur la
> logique (double vote, confirmation, seuil). Supprimer `seededRandom` et tous les
> compteurs inventes du front (187/47, points localStorage a 500).
> **Prerequis fondateur** : aucun.

### 15.3 Page d'accueil — vitrine Netflix au service du vote
**Statut**: A FAIRE · **Modele**: **Opus** (page la plus strategique du site : structure, design et narration)
> Refondre `/` : hero plein ecran sur un film en vote (affiche + baseline + CTA « Voter »
> + compteur reel x/5000), row « En vote — Bandes-annonces », row « En vote — Films en
> competition », bloc « Comment ca marche » (3 etapes, issu de 15.1), row « Bientot en
> production / A regarder », bloc Finale CINEGENY (prix, date), bloc Academy (accroche
> reseaux), CTA final inscription. Supprimer de l'accueil tout ce qui ne sert pas ces
> blocs. Verification mobile 390px systematique.
> **Prerequis fondateur** : choisir le film mis en avant dans le hero.

### 15.4 Fiche film + panneau de vote refondus
**Statut**: A FAIRE · **Modele**: **Sonnet**
> Refondre `/films/[slug]` : au-dessus du pli = affiche/bande-annonce, piste (A ou B),
> compteur x/5000, bouton Voter, « que se passe-t-il a 5 000 ? » en une phrase. En
> dessous : synopsis, equipe/contributeurs reels, parcours du film (timeline En vote ->
> En production -> A regarder), partage social (le vote partage EST l'acquisition).
> Etats post-vote soignes : confirmation, invitation a s'inscrire (si anonyme), a
> partager, a voter pour un autre film.
> **Prerequis fondateur** : bandes-annonces/videos disponibles pour chaque film (ou
> placeholder assume).

### 15.5 Catalogue /films — axe unique de progression
**Statut**: A FAIRE · **Modele**: **Sonnet**
> Refondre `src/components/films/film-categories.tsx` et `/films` : 3 onglets seulement
> (« En vote » (defaut), « En production », « A regarder »), badges de piste A/B, labels
> 100 % FR, cartes films avec compteur reel et CTA Voter direct depuis la carte.
> Supprimer la categorisation par fundingPct et les 5 onglets anglais actuels.
> **Prerequis fondateur** : aucun (les 6 films sont « En vote », decision 15.0).

### 15.6 Monnaie unique + degraissage des pages publiques
**Statut**: FAIT (Juillet 2026)
> `/points` (page publique factice) et `/lumens` (page privee reelle) fusionnees en une
> seule page privee « Mes Points » a `/points`. `/rewards` refondue en page publique
> « Recompenses » (les stats personnelles affichees etaient toutes inventees — XP, streak,
> badges « debloques », code de parrainage). Retires du public avec redirect 308 :
> `/tv/live`, `/produce` (-> `/create`), `/act` (-> `/create/casting`), `/tv/invest`
> (-> `/invest`). CTA tokenisation retires de la fiche film / `/streaming` / `/tv` au
> profit de `/invest`. Header public bascule sur le composant `Header` (15.1, jamais
> branche jusque-la — les pages publiques affichaient encore l'ancien `NetflixHeader`
> avec son mega-menu TV live/tokenisation/micro-taches). `/credits` (credits IA, outils)
> et `/invest` vs `/investors` laisses inchanges — deja differencies par la 15.1, pas de
> vraie redondance. Rien de supprime en base ni dans l'admin.
>
> **Suites decidees avec le fondateur (Juillet 2026), a traiter chacune dans sa propre
> session — voir 15.6bis et 15.6ter ci-dessous.**

### 15.6bis Refonte de l'economie des Points CINEGENY
**Statut**: A FAIRE (a cadrer) · **Modele**: a definir selon le cadrage retenu
> **Le probleme** : la page « Mes Points » (`/points`, ex-Lumens) a garde telle quelle la
> mecanique financiere historique des Lumens — on peut ACHETER des Points avec de l'argent
> reel, et les RETIRER en euros. Or la decision 15.0 #7 definit les Points CINEGENY comme
> une monnaie qu'on GAGNE en votant, en participant et en parrainant, utilisee pour les
> recompenses et le concours — pas une monnaie qu'on achete ni qu'on encaisse. Ce sujet a
> ete identifie en 15.6 mais volontairement laisse de cote (a part entiere, hors routing/UI)
> pour etre pense au calme dans sa propre session plutot que tranche a la volee.
> **A trancher a ce moment-la** : garde-t-on l'achat/retrait en euros pour les utilisateurs
> qui ont deja un solde Lumens (continuite), ou construit-on un vrai systeme de Points
> non-monetaire (gagnes uniquement, jamais achetes/retires) en parallele ? Impact DB/Prisma
> a evaluer (modele `LumenTransaction`, types `PURCHASE`/`WITHDRAWAL`).
> **Prerequis fondateur** : decider du modele economique des Points avant de cadrer la
> session.

### 15.6ter Espace investisseurs entreprise — acces protege par mot de passe
**Statut**: A FAIRE · **Modele**: Sonnet
> **Le contexte, explique en detail pour quand on y arrivera** : il y a deux types de
> personnes qui « investissent » sur CINEGENY, et ce sont deux parcours differents.
> 1. Les gens qui investissent **sur un film en particulier** (co-production) : c'est la
>    page publique `/invest` (« Devenir co-producteur »), en acces libre, liste d'attente
>    email + montant d'intention — rien ne change ici.
> 2. Les gens qui pourraient investir **dans l'entreprise CINEGENY elle-meme** (le studio,
>    pas un film precis — typiquement un tour de table SAFE / investisseurs strategiques) :
>    c'est la page `/investors` (« Espace investisseurs »). Cette page contient des
>    informations sensibles (structure legale, conditions du tour de table) qui ne doivent
>    pas etre visibles par n'importe quel visiteur du site — seulement par les personnes a
>    qui le fondateur a donne acces.
> **Ce qu'il faut construire** : `/investors` passe derriere un simple mot de passe
> partage (pas un compte utilisateur complet — un mot de passe unique, comme une porte
> fermee a clef) : un ecran de saisie avant d'afficher le contenu de la page. Ce mot de
> passe doit etre **visible et modifiable depuis la page d'accueil de l'admin**
> (`/admin`), sous forme d'un encart « Mot de passe Espace investisseurs » — pour que le
> fondateur puisse le retrouver en un coup d'oeil et le communiquer aux personnes
> concernees (ou le changer) sans avoir a chercher dans les variables d'environnement ou
> a demander a un developpeur.
> **Prerequis fondateur** : aucun — le mot de passe peut etre genere automatiquement au
> premier passage puis change depuis l'admin.

### 15.7 « Comment ca marche » + co-producteurs en liste d'attente
**Statut**: FAIT (Juillet 2026) · **Modele**: **Sonnet**
> Page `/comment-ca-marche` grand public (3 etapes illustrees, FAQ courte : qui peut
> voter, c'est gratuit ?, que gagne-t-on ?, c'est quoi un film IA ?). Page
> `/co-produire` : promesse co-production + formulaire liste d'attente (email + montant
> d'intention, stockage Prisma, email de confirmation via Resend) — aucun paiement.
> Mention claire « ouverture apres la premiere selection ».
> **Prerequis fondateur** : valider le texte legal court de la liste d'attente.

### 15.8 Page equipe / A propos
**Statut**: A FAIRE · **Modele**: **Haiku** (integration de contenu, pas de logique)
> Page `/about` refondue : mission (wording 15.1), equipe reelle reprise de CineGeny.com
> (photos, roles), la promesse de transparence (compteurs publics). Ton communautaire.
> **Prerequis fondateur** : fournir photos + noms + roles de l'equipe (ou lien exact vers
> la page CineGeny.com a repliquer).

### 15.9 Finale CINEGENY — page concours + reglement
**Statut**: A FAIRE · **Modele**: **Sonnet**
> Page `/finale` : principe (les films de la piste B a 5 000 votes entrent en Finale),
> prix de fin d'annee (voyages), compte a rebours, films qualifies (reel : vide au debut,
> assume avec un etat « Aucun finaliste encore — votez ! »), reglement lisible.
> **Prerequis fondateur** : nature exacte des prix, date de la Finale, conditions
> (indispensable avant mise en ligne — obligations legales des jeux-concours FR).

### 15.10 Passe francais integral des surfaces publiques
**Statut**: A FAIRE · **Modele**: **Haiku** (passe mecanique de labels, volume eleve, zero decision)
> Balayer toutes les pages publiques restantes : traduire chaque label/bouton/message
> anglais residuel en francais, appliquer le vocabulaire fixe de 15.1, verifier emails
> transactionnels. Ne touche pas a l'admin ni a la Phase 14 (i18n complete plus tard).
> **Prerequis fondateur** : aucun.

### 15.11 QA de lancement
**Statut**: A FAIRE · **Modele**: **Sonnet**
> Parcours complet teste en conditions reelles (mobile + desktop) : arrivee -> comprendre
> -> voter anonyme -> s'inscrire -> vote confirme -> partager -> revenir. SEO/OG de
> toutes les pages publiques (titres FR, images OG par film), sitemap a jour apres 15.6,
> perf (LCP accueil < 2,5 s), events analytics sur l'entonnoir de vote (vue film ->
> clic vote -> vote confirme -> inscription). Rapport final go/no-go pour le fondateur.
> **Prerequis fondateur** : acces au domaine de prod pour la verification finale.

### 15.12 (Post-lancement) Trailer Studio v2 — integration du depot « bande annonce »
**Statut**: A FAIRE (apres lancement) · **Modele**: **Opus** (refonte from scratch d'un module complet)
> Reconstruire de zero l'outil de creation de video assistee a partir du depot « bande
> annonce » du fondateur, et l'integrer comme parcours « Creer une bande-annonce » qui
> alimente directement la piste A du vote. Cadrage en debut de session avec le fondateur.
> **Prerequis fondateur** : acces au depot « bande annonce » + demo de l'existant.

---

## PHASE 14 — VERSIONS COMPLETES BILINGUES FR / EN

**Decision (Juin 2026)** : plutot que d'harmoniser au cas par cas (ex: le contenu Academy
importe est actuellement 100% anglais avec une palette differente #E50914/#D4AF37 du reste
du site en #0A0908/#C9A227), construire **une vraie version complete en anglais ET une vraie
version complete en francais** de toute la plateforme.

### 14.1 Audit du melange FR/EN actuel
**Statut**: A FAIRE
> Reperer toutes les pages/contenus qui ne suivent pas la locale active : Academy (100%
> anglais, non traduit), quelques pages historiques en anglais (ex: certaines pages
> publiques legacy), vs le gros du site qui est en francais avec un systeme i18n (next-intl)
> deja en place (`messages/fr.json`, `messages/en.json`) mais partiellement utilise.

### 14.2 Academy — traduction + harmonisation theme
**Statut**: A FAIRE
> Traduire integralement le contenu de `src/content/academy.ts` (3 niveaux, 29 lecons, 87
> prompts) en francais, et proposer les deux langues via le systeme de locale existant
> (next-intl). Harmoniser la palette avec le theme noir & or du site (#0A0908/#C9A227,
> `.text-gold-metallic`, `.btn-sheen`, composant `Button`) au lieu du rouge Netflix
> (#E50914) et de l'or divergent (#D4AF37) actuellement utilises.

### 14.3 Couverture i18n complete du reste du site
**Statut**: A FAIRE
> Passer toutes les pages et tout le contenu restant (pas seulement la nav) par next-intl,
> pour garantir une bascule FR/EN complete et coherente sur l'integralite de la plateforme,
> pas seulement les menus.

### 14.4 CINEGENY TV — bilingue FR/EN (decision fondateur, Juillet 2026)
**Statut**: A FAIRE
> Confirme en session 15.6 : on ne retire pas la section TV du site (seul le direct/« TV
> live » a ete retire du public, cf. 15.6). `/tv` et ses sous-pages restent 100% anglais
> pour l'instant (heritees telles quelles) — elles seront traitees dans cette phase, en
> anglais ET en francais via next-intl, comme le reste du site. Pas de session dediee
> avant que 14.1/14.3 ne soient cadrees.

---

## PHASE 1 — IA & QUALITE (Semaines 1-2)

### 1.1 Review IA reelle avec Claude API
**Statut**: EN COURS
**Prerequis fondateur**: Cle API Anthropic (FAIT — dans .env)

> **Prompt Claude Code:**
> ```
> Remplace le mock AI review dans src/lib/ai-review.ts par une vraie integration Claude API.
> La cle ANTHROPIC_API_KEY est dans .env.
> Utilise le SDK @anthropic-ai/sdk.
> La fonction doit:
> 1. Analyser le contenu de la soumission (notes + fileUrl)
> 2. Evaluer la qualite sur 100 selon le type de tache
> 3. Donner un feedback detaille en francais
> 4. Rendre un verdict AI_APPROVED ou AI_FLAGGED
> Optimise les tokens: utilise haiku pour les reviews simples, sonnet pour les complexes.
> Garde le fallback mock si l'API est indisponible.
> ```

### 1.2 Analyse IA des scenarios
**Statut**: A FAIRE
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Ajoute une analyse IA automatique quand un scenario est soumis via submitScenarioAction.
> Dans src/app/actions/community.ts, apres la creation du scenario, lance une analyse async avec Claude:
> - Evaluation du logline (originalite, clarte, potentiel commercial)
> - Score sur 100
> - Suggestions d'amelioration
> - Detection de contenu inapproprie
> Stocke le resultat dans un nouveau champ aiAnalysis (JSON) sur ScenarioProposal.
> Utilise claude-haiku pour economiser les tokens.
> ```

### 1.3 Generation de synopsis IA
**Statut**: A FAIRE
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Ajoute un bouton "Generer avec l'IA" sur le formulaire de soumission de scenario.
> Quand l'utilisateur donne un titre et un genre, Claude genere:
> - Un logline accrocheur
> - Un synopsis de 3 paragraphes
> - 3 suggestions de genre
> Cree une server action generateSynopsisAction dans src/app/actions/ai.ts.
> UI: bouton gold avec sparkles icon, resultat dans un dialog.
> ```

---

## PHASE 2 — INVITATION SCENARISTES (Semaines 2-3)

### 2.1 Systeme d'invitation par email
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte Resend.com (service email) — gratuit 100 emails/jour
- Domaine verifie sur Resend (lumiere.film ou autre)
- Variable env: `RESEND_API_KEY`

> **Prompt Claude Code:**
> ```
> Cree un systeme d'invitation de scenaristes en masse.
> 1. Page admin /admin/invite-screenwriters avec:
>    - Textarea pour coller des emails (1 par ligne, max 100)
>    - Template d'email personnalisable
>    - Bouton "Envoyer les invitations"
> 2. Server action sendScreenwriterInvitesAction qui:
>    - Valide les emails
>    - Cree un InviteToken unique par email (nouveau modele Prisma)
>    - Envoie l'email via Resend API
>    - L'email contient un lien /register?invite=TOKEN&role=SCREENWRITER
> 3. Sur /register, si invite token present:
>    - Pre-remplit le role SCREENWRITER
>    - Marque l'invitation comme utilisee
>    - Credite 50 lumens de bienvenue
> Installe resend (npm install resend).
> ```

### 2.2 Page scenariste dediee
**Statut**: A FAIRE
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Cree une page /screenwriters (landing page publique) qui explique:
> - Comment devenir scenariste sur Lumiere
> - Les avantages (credits, blockchain, coproduction)
> - Les films ouverts aux scenarios
> - Formulaire de candidature (nom, email, bio, portfolio)
> - Testimonials (faux pour l'instant)
> Design: style cinema premium, gold accents, fond noir.
> ```

---

## PHASE 3 — PAIEMENTS & STRIPE (Semaines 3-5)

### 3.1 Checkout Stripe
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte Stripe (stripe.com) — mode test gratuit
- Variables env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

> **Prompt Claude Code:**
> ```
> Integre Stripe Checkout pour:
> 1. Abonnements (FREE, STARTER 9.99/mois, PRO 19.99/mois, PREMIUM 49.99/mois)
> 2. Achat de Lumens (packs: 100L=5EUR, 500L=20EUR, 2000L=70EUR)
> 3. Investissement tokenise (montants custom)
> Cree:
> - src/app/api/stripe/checkout/route.ts (session creation)
> - src/app/api/stripe/webhook/route.ts (webhook handler)
> - src/app/actions/payment.ts (server actions)
> - src/app/(public)/pricing/page.tsx (page tarifs)
> Utilise stripe npm package. Mode test avec cles test.
> ```

### 3.2 Wallet Lumens
**Statut**: PARTIELLEMENT FAIT (modeles DB existent)
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Cree l'interface du wallet Lumens dans /dashboard/wallet:
> - Solde actuel avec animation compteur
> - Historique des transactions (gains taches + achats)
> - Bouton "Acheter des Lumens" (redirige vers Stripe)
> - Bouton "Retirer" (convertir en EUR, minimum 50 Lumens)
> Les donnees viennent de la table LumenTransaction deja dans Prisma.
> Design: cards avec gradients gold, graphique d'evolution.
> ```

---

## PHASE 4 — BLOCKCHAIN REELLE (Semaines 5-8)

### 4.1 Smart contracts Polygon
**Statut**: A FAIRE
**Prerequis fondateur**:
- Wallet MetaMask avec MATIC test (faucet gratuit)
- Variable env: `POLYGON_RPC_URL`, `DEPLOYER_PRIVATE_KEY`
- Optionnel: compte Alchemy ou Infura (RPC gratuit)

> **Prompt Claude Code:**
> ```
> Deploie les smart contracts sur Polygon Mumbai testnet:
> 1. LumiereVoting.sol — enregistrement des votes on-chain
> 2. LumiereToken.sol — ERC-20 pour les Lumens
> 3. LumiereNFT.sol — ERC-721 pour les credits de coproduction
> Utilise Hardhat + ethers.js.
> Cree contracts/ a la racine du projet.
> Connecte src/lib/blockchain.ts aux vrais contrats.
> ```

### 4.2 Credits NFT de coproduction
**Statut**: A FAIRE
**Prerequis fondateur**: Smart contracts deployes (4.1)

> **Prompt Claude Code:**
> ```
> Quand un scenario gagne le vote et que le film est produit:
> 1. Mint un NFT "Co-Producteur" pour l'auteur du scenario
> 2. Mint des NFTs "Contributeur" pour chaque participant valide
> 3. Le NFT contient: titre du film, role, pourcentage de revenue share
> 4. Ajoute une page /dashboard/nfts pour voir ses NFTs
> Le metadata IPFS peut etre simule pour l'instant (JSON sur le serveur).
> ```

---

## PHASE 5 — VIDEO & CONTENU (Semaines 8-12)

### 5.1 Generation video IA
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte API video (Runway ML, Luma AI, ou Kling)
- Variable env: `VIDEO_API_KEY`, `VIDEO_API_PROVIDER`

> **Prompt Claude Code:**
> ```
> Integre la generation video IA dans le workflow de production:
> 1. Sur chaque tache de type IMAGE_GEN ou VIDEO_REVIEW:
>    - Bouton "Generer avec l'IA"
>    - L'utilisateur entre un prompt
>    - L'API genere la video/image
>    - Le resultat est soumis comme submission
> 2. Cree src/lib/video-gen.ts avec support multi-provider
> 3. Stocke les videos generees sur un CDN (Cloudflare R2 ou S3)
> Variables: VIDEO_API_KEY, VIDEO_API_PROVIDER (runway|luma|kling)
> ```

### 5.2 Stockage media (CDN)
**Statut**: A FAIRE
**Prerequis fondateur**:
- Compte Cloudflare R2 (10GB gratuit) ou AWS S3
- Variables env: `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, `R2_ENDPOINT`

> **Prompt Claude Code:**
> ```
> Cree un systeme d'upload media centralise:
> 1. src/lib/storage.ts — upload/download/delete vers R2
> 2. src/app/api/upload/route.ts — endpoint d'upload avec presigned URLs
> 3. Integre dans: soumission de taches, affiches de films, avatars
> 4. Limite: 50MB par fichier, formats image+video
> Installe @aws-sdk/client-s3 et @aws-sdk/s3-request-presigner.
> ```

---

## PHASE 6 — SEO & PERFORMANCE (Semaines 12-14)

### 6.1 SEO & Metadata
**Statut**: PARTIELLEMENT FAIT
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Optimise le SEO de toutes les pages:
> 1. Ajoute generateMetadata() sur chaque page dynamique
> 2. Cree src/app/sitemap.ts (sitemap dynamique)
> 3. Cree src/app/robots.ts
> 4. Ajoute OpenGraph images pour les films (og:image)
> 5. Schema.org JSON-LD pour les films (Movie type)
> 6. Canonical URLs sur toutes les pages
> Langue: fr. Titre pattern: "Nom | Lumiere Cinema"
> ```

### 6.2 Performance & Core Web Vitals
**Statut**: PARTIELLEMENT FAIT
**Prerequis fondateur**: Aucun

> **Prompt Claude Code:**
> ```
> Optimise les performances:
> 1. Lazy load tous les composants below-the-fold avec dynamic()
> 2. Prefetch les liens critiques
> 3. Optimise les images: blur placeholder, priority sur hero
> 4. Ajoute loading.tsx sur chaque route group
> 5. Cache les requetes Prisma chaudes avec Redis (src/lib/redis.ts)
> 6. Bundle analysis: supprime les imports inutiles
> Target: LCP < 2.5s, CLS < 0.1, FID < 100ms
> ```

---

## PHASE 7 — DEPLOIEMENT PRODUCTION (Semaines 14-16)

### 7.1 Docker & CI/CD
**Statut**: PARTIELLEMENT FAIT (docker-compose local existe)
**Prerequis fondateur**:
- Compte Vercel (gratuit) OU serveur VPS (Hetzner ~5EUR/mois)
- Domaine (lumiere.film ou similaire)
- Variables env de production

> **Prompt Claude Code:**
> ```
> Prepare le deploiement production:
> 1. Dockerfile multi-stage optimise (build + runtime)
> 2. docker-compose.prod.yml (avec SSL, Redis persist, PG backups)
> 3. .github/workflows/deploy.yml (CI: lint + test + build + deploy)
> 4. Script de migration automatique au deploiement
> 5. Health check endpoint /api/health
> Si Vercel: configure vercel.json + edge runtime ou pas.
> Si VPS: nginx reverse proxy + certbot SSL.
> ```

---

## PHASE 8 — FEATURES AVANCEES (Post-lancement)

### 8.1 Systeme de recommandation
> **Prompt:** Cree un algorithme de recommandation base sur: genres preferes, votes passes, films consultes. Stocke les scores dans Redis pour la rapidite.

### 8.2 Notifications temps reel
> **Prompt:** Ajoute des notifications push avec Server-Sent Events. Notifie: nouveau vote sur ton scenario, tache validee, nouveau film disponible.

### 8.3 Mobile app (React Native)
> **Prompt:** Scaffolde une app React Native avec Expo qui reutilise les API existantes. Ecrans: Home, Films, Mon Profil, Wallet.

### 8.4 Multi-langue (i18n)
> **Prompt:** Ajoute le support francais/anglais/hebreu avec next-intl. Commence par FR (defaut) + EN.

---

## PHASE 9 — SCALE & INTELLIGENCE (En cours)

### 9.1 App mobile PWA ✅
> Service worker, manifest, meta tags, mode offline cache-first.

### 9.2 Internationalisation (i18n) ✅
> next-intl + FR/EN + switcher + header traduit.

### 9.3 Analytics avancees ✅
> Dashboard admin avec KPIs, graphiques, top contributors, pipeline.

### 9.4 CDN video + HLS ✅
> cdn.ts multi-provider (Cloudflare/Mux/self-hosted), signed URLs, transcoding 4 profils.

### 9.5 Annulation abonnement ✅
> Page /dashboard/subscription — gestion plan, annulation, upgrade, dates.

### 9.6 Historique de visionnage ✅
> watch-history.ts — recordProgress, getContinueWatching, getHistory via FilmView.

### 9.7 Watchlist / Ma Liste ✅
> watchlist.ts — add/remove/get/isInWatchlist.

### 9.8 Cookie consent RGPD ✅
> CookieBanner + CookieConsent dans layout.tsx.

### 9.9 Health check API ✅
> /api/health — DB + Redis checks, latency, uptime.

### 9.10 IA Generative
**Statut**: A FAIRE
**Prerequis**: API Runway/Luma/Kling
> Generation d'affiches, storyboards, previsualisations par IA.

### 9.11 Whisper sous-titres auto
**Statut**: A FAIRE
**Prerequis**: OpenAI Whisper API ou modele local
> Transcription automatique audio → sous-titres multi-langues.

---

## PHASE 10 — BLOCKCHAIN LIVE

### 10.1 Deploy smart contracts
**Statut**: A FAIRE
**Prerequis**: Wallet MetaMask + RPC Polygon/Base + cles deploiement
> ERC-20 FilmToken + ERC-721 ContributionNFT sur Polygon/Base.

### 10.2 Wallet Connect
**Statut**: A FAIRE
> Connexion MetaMask/WalletConnect pour acheter tokens et voter.

### 10.3 NFT contributeur
**Statut**: A FAIRE
> Mint automatique d'un NFT preuve-de-contribution a chaque tache validee.

### 10.4 Gouvernance on-chain
**Statut**: A FAIRE
> Votes token-weighted pour decisions de production.

### 10.5 Dividendes automatiques
**Statut**: A FAIRE
> Distribution automatique des revenus aux detenteurs de tokens.

---

## PHASE 11 — INFRASTRUCTURE VIDEO (En cours)

### 11.1 File d'attente transcoding ✅
> transcoding-queue.ts — CRUD jobs, stats, priorite, cleanup.

### 11.2 Generation auto de thumbnails ✅
> thumbnails.ts — FFmpeg commands, sprite sheets, progress parsing.

### 11.3 CDN video (Cloudflare/Mux) ✅
> cdn.ts — multi-provider, signed URLs, hotlink protection.

### 11.4 Protection DRM
**Statut**: A FAIRE
**Prerequis**: Licence Widevine/FairPlay
> Protection du contenu premium des abonnes.

### 11.5 Configuration bitrate adaptatif
**Statut**: A FAIRE
> Interface admin pour configurer les profils qualite par film.

---

## PHASE 12 — CONFORMITE & SECURITE (En cours)

### 12.1 Authentification deux facteurs (2FA)
**Statut**: A FAIRE
> TOTP via app authenticator (Google Auth, Authy).

### 12.2 Suppression de compte (RGPD Art. 17) ✅
> account.ts — requestAccountDeletionAction, anonymisation des donnees.

### 12.3 Export donnees personnelles (RGPD Art. 20) ✅
> account.ts — exportPersonalDataAction, JSON complet.

### 12.4 Gestion des sessions
**Statut**: A FAIRE
> Voir et revoquer les sessions actives depuis le profil.

### 12.5 Journal d'audit admin
**Statut**: A FAIRE
> Log de toutes les actions admin avec horodatage.

---

## PHASE 13 — SOCIAL & ENGAGEMENT

### 13.1 Commentaires sur les films
**Statut**: A FAIRE
> Discussion par film avec reponses, likes et moderation.

### 13.2 Generique / credits d'equipe
**Statut**: A FAIRE
> Page credits interactive par film listant tous les contributeurs et roles.

### 13.3 Collections & playlists
**Statut**: A FAIRE
> Playlists thematiques de films partagees ou personnelles.

### 13.4 Createur a la une
**Statut**: A FAIRE
> Mise en avant hebdomadaire d'un createur avec interview et stats.

---

## FEATURES TRANSVERSALES (Fait)

### Avis & notations films ✅
> reviews.ts + FilmReviews component — etoiles 1-5, formulaire, listing.

### Partage social ✅
> SocialShare component — copie lien, X/Twitter, Facebook, WhatsApp.

### Tests unitaires (85 tests Vitest) ✅
> 5 suites: utils, reputation, invoices, film-decomposer, rate-limiter.

### CI/CD GitHub Actions ✅
> Pipeline 3 jobs: lint, test, build sur chaque push/PR.

### Rate Limiting ✅
> Login (5/15min), register (3/h), password reset (3/15min).

### Security Headers ✅
> CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy.

### Email Verification ✅
> isVerified check + resendVerificationAction.

---

## CHECKLIST PREREQUIS FONDATEUR

| Etape | Ce que tu dois fournir | Gratuit? |
|-------|----------------------|----------|
| 1.1 IA Review | Cle Anthropic API | 5$ credit gratuit |
| 2.1 Invitations | Compte Resend + domaine verifie | 100 emails/jour gratuit |
| 3.1 Paiements | Compte Stripe (mode test) | Gratuit en test |
| 10.x Blockchain | Wallet MetaMask + RPC Polygon | Gratuit (testnet) |
| 9.10 Video IA | API Runway/Luma/Kling | ~0.05$/video |
| 11.3 CDN | Cloudflare R2/Stream | 10GB gratuit |
| 7.1 Hosting | Vercel ou VPS | Gratuit (Vercel hobby) |
| 11.4 DRM | Licence Widevine | Gratuit (Shaka Player) |
| 9.11 Whisper | OpenAI Whisper API | ~0.006$/min |

---

*Derniere mise a jour: 3 Juillet 2026*
