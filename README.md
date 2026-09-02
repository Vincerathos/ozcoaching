# OZ Coaching — Site vitrine

Site vitrine multi-pages pour **OZ Coaching – Aurélia Grino**
*Révélatrice des talents de demain* — ingénierie pédagogique & employabilité, accompagnement carrière
(Montpellier, Nîmes, Aix-Marseille & visio).

> **Refonte v3 (septembre 2026)** — contenu et positionnement issus du document
> `OZ_Coaching_Contenu_site_web_v3` (Caroline Vergier / helloCaroline), charte graphique
> et logos fournis par Aurélia. Le site est passé de 3 portes (particuliers / écoles /
> entreprises) à **2 portes** : Écoles supérieures et Accompagnement carrière.

## Pages
- `index.html` — Accueil : hero, bifurcation 2 portes, quiz, outil « L'œil », chiffres, méthode, témoignages
- `ecoles.html` — Écoles supérieures : écosystème alternance 360°, formats, Career Center & Qualiopi, réalisations
- `carriere.html` — Accompagnement carrière : cadres/dirigeants, transitions, leadership au féminin, parcours Ikigaï, FAQ
- `oeil-recruteuse.html` — Outil gratuit « L'œil de la recruteuse » (analyse de titre/accroche + import CV PDF)
- `a-propos.html` — Qui suis-je : 17 ans de terrain, ADN, valeurs, convictions
- `blog.html` — Page coquille (articles à venir) + capture e-mail
- `contact.html` — Google Agenda + formulaire avec routage école / particulier
- `404.html` — page d'erreur personnalisée (2 portes + CTA)
- `mentions-legales.html` · `confidentialite.html`
- `particuliers.html` — redirection vers `carriere.html` (ancienne URL)
- `entreprises.html` — redirection vers l'accueil (page supprimée : la v3 ne garde que 2 portes)

## Charte graphique v3
Référence : `design/charte-graphique-ag.png`

| Rôle | Couleur |
|---|---|
| Pétrole (primaire foncé) | `#004956` |
| Cyan (accent) | `#0097B2` |
| Encre | `#231F20` |
| Fond | `#F6F4F0` |

**Typographie officielle : Neue Montréal (texte) + Znikomit (titres de héros).**

- **Les deux sont en place** ✅ — Neue Montréal (Light/Regular/Medium/Bold/Italic) pour le texte,
  Znikomit pour les titres de héros, en écho au logo composé dans cette même police.
- **Toutes hébergées en local** (`/fonts`) : plus aucune requête vers Google Fonts, donc aucune
  IP de visiteur transmise à un tiers (RGPD).
- ⚠️ **Licence Neue Montréal à confirmer** : police commerciale (Pangram Pangram) dont la
  licence *webfont* est distincte de la licence bureau. Les fichiers fournis ne portent pas de
  licence embarquée — à valider avec Aurélia avant mise en ligne. Manrope reste dans la pile
  comme filet de sécurité.

👉 Marche à suivre détaillée : [`fonts/README.md`](fonts/README.md)

**Logos** (`images/`) — dérivés du PNG officiel fourni :
- `logo-oz.png` — logo complet couleur (œil + nom + baseline)
- `logo-oz-blanc.png` — version blanche, pour le footer sombre
- `logo-oz-header.png` / `-blanc` — sans la baseline, pour la navigation (plus lisible en petit)
- `favicon-oz-v3.png` — l'œil seul
- `trait-oz.png` — le trait ondulé cyan seul

## Photos
Les visuels de personnes viennent d'**Unsplash** (licence gratuite, usage commercial autorisé,
sans attribution obligatoire) : `oz-animation`, `oz-leadership`, `oz-echange`, `oz-atelier`.
Ils remplacent des images qui posaient problème — la page « Qui suis-je » d'Aurélia était
illustrée par un homme en présentation, et « Leadership au féminin » par des mains anonymes
sur des claviers.

⚠️ Les photos envoyées par Caroline (`Exemples d'images.pdf`) **ne sont pas libres de droit**
hors Canva : elles ne sont pas utilisées ici. À remplacer à terme par de vraies photos
d'Aurélia en atelier.

## Hébergement
**Vercel, plan Pro**, sur le compte de Vincent Bélicot (prestataire).
Le plan Hobby est explicitement réservé à un usage non commercial : la politique de Vercel
range dans le commercial aussi bien la promotion d'un service que le fait d'être *payé pour
créer le site*. Le plan Pro est donc obligatoire ici — il est facturé par équipe, pas par
projet, et couvre un nombre illimité de sites.

**Le nom de domaine, lui, est au nom d'Aurélia Grino** (titulaire AFNIC, avec son SIREN).
C'est ce qui garantit son indépendance : le site étant statique et versionné sur GitHub,
elle peut le faire redéployer ailleurs et repointer ses DNS sans dépendre de personne.

À déclarer dans les mentions légales : **Vercel Inc.**, 340 S Lemon Ave #4133, Walnut,
CA 91789, USA.

## Mesure d'audience
**Vercel Web Analytics** (`<script defer src="/_vercel/insights/script.js">` sur chaque page).
Sans cookie, sans identifiant permanent, sans suivi inter-sites : **aucun bandeau de consentement
n'est nécessaire**, et la politique de confidentialité le documente.
- ⚠️ À activer dans le projet Vercel (onglet Analytics) après le déploiement, sinon rien n'est collecté.
- Le script renvoie un 404 en local : normal, il n'est servi que par Vercel.
- Les **conversions** (quiz, CV, plaquettes, contact) sont déjà tracées côté n8n : l'audience et
  les conversions se lisent donc à deux endroits complémentaires.

## Technique
- HTML/CSS/JS statique, sans dépendance de build
- `styles.css` (charte v3) · `site.js` (menu, reveals, compteurs, quiz, formulaires) · `oeil.js` (outil)
- Responsive (mobile-first, breakpoints 600 / 960 px), SEO (JSON-LD, sitemap, OG), RGPD

## Génération de leads
- **Outil « L'œil de la recruteuse »**, 2 parcours :
  - *J'écris* : analyse de titre LinkedIn / accroche (scoring 100 % côté client), jauge animée
  - *J'importe mon CV (PDF)* : extraction du texte via pdf.js, puis **analyse par Claude** ✅
    (workflow n8n `OZ Coaching — Analyse CV par IA`, ID `pMbciGGc82doOq90`, webhook
    `/webhook/oz-analyse-cv`). Le modèle joue le rôle d'Aurélia et renvoie score, verdict,
    forces, alertes et conseils, en citant des éléments précis du CV. ~10 à 20 s par analyse,
    quelques centimes. Si l'appel échoue ou si `analyseCV` est vidé dans `config.js`,
    le site retombe automatiquement sur l'audit humain.
- **Quiz d'orientation** (accueil) : 4 profils → offre recommandée + capture e-mail
- **Formulaires de documentation** : plaquette écoles, doc carrière, alerte blog.
  Le PDF se **télécharge immédiatement** après l'envoi du formulaire (le visiteur n'attend pas
  sa boîte mail) et le lien est aussi repris dans l'e-mail.
- **Brochures** (`brochures/`) : PDF générés depuis les `.pptx` d'Aurélia via LibreOffice,
  en 16:9 (33,87 × 19,05 cm), avec les polices d'origine installées (Comfortaa, NTR,
  Zen Kaku Gothic New) pour un rendu fidèle — vérifié : aucun texte perdu, aucun débordement.
- **Workflow n8n** `OZ Coaching — Leads site (œil, quiz, CV, docs) → séquence email` (ID `UT8YMlsURN9g59Pk`)
  - Webhook actif : `POST https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead`
  - Sources gérées : `outil` · `quiz` · `cv` · `doc` — avec une **branche B2B distincte** pour les écoles
  - Séquence : e-mail 1 immédiat → J+2 (histoire) → J+5 (preuve sociale) → J+9 (invitation)
  - **Aucun tarif affiché** : tout est « sur devis », conformément au positionnement v3
  - ⚠️ **Les 4 nœuds d'envoi sont désactivés.** L'expéditeur est réglé sur `contact@ozcoaching.fr` :
    à activer seulement après vérification du domaine dans Resend. En attendant, les leads sont
    capturés (visibles dans les exécutions n8n) mais aucun e-mail ne part.
  - Champ `test: true` dans le payload = e-mail 1 seul, pas de séquence.

## Retours d'Aurélia intégrés (02/09/2026)
- Domaine retenu : **oz-coaching.fr** (ozcoaching.fr étant pris) — propagé partout
- Prise de RDV : **Google Agenda** et non Calendly. Créneaux « OZ Coaching — Réserver un
  premier échange ☕ », 30 min. Vérifié : la page publique n'expose que les créneaux ouverts,
  jamais le contenu de son agenda
- Son **portable n'est plus affiché** sur le site (le mail est le canal n°1, le téléphone se
  donne après le premier échange). Il reste dans les mentions légales — obligation LCEN pour
  un professionnel. Réglable via `afficherTelephone` dans `config.js`
- « Qui suis-je » : les cabinets de recrutement couvrent désormais « de Paris à Montpellier
  en passant par Aix-Marseille »

## À finaliser avant mise en ligne
- [ ] Acheter **oz-coaching.fr** + héberger, puis compléter l'hébergeur dans les mentions légales
- [ ] **Photos** : Aurélia veut des visuels plus parlants (ateliers). Caroline a envoyé un PDF de
      photos mais elles **ne sont pas libres de droit** — ne pas les publier en l'état
- [ ] Récupérer la **brochure Écoles corrigée** par Caroline (les « :: » enlevés) et regénérer le PDF
- [ ] Vérifier la dernière version du **document site web** (Caroline a retiré une recommandation)
- [ ] Vérifier le domaine dans Resend, puis réactiver les 4 nœuds d'envoi n8n
- [ ] Confirmer avec Aurélia qu'elle détient bien une licence **webfont** pour Neue Montréal
      (distincte de la licence bureau) — voir `fonts/README.md`
- [ ] Nouvelle photo d'Aurélia quand elle l'aura faite (`images/aurelia-2026.jpg` est une
      photo de transition, 635×869 — à ne pas afficher plus grand)

## Docs de travail
`SEO-PLAN.md` · `OFFRE-TARIFS-PROPOSITION.md` (⚠️ obsolète : la v3 ne publie plus de tarifs) · `AUTOMATISATIONS.md`
