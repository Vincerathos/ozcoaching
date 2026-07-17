# OZ Coaching — Site vitrine

Site vitrine multi-pages pour **OZ Coaching – Aurélia Grino**, coach emploi, carrière et recrutement
(Montpellier, Nîmes & visio).

## Pages
- `index.html` — Accueil (3 portes : particuliers / écoles / entreprises, quiz d'orientation)
- `particuliers.html` — Accompagnement individuel + tarifs + parcours animé
- `ecoles.html` — Interventions écoles (ateliers, MOOCs, podcasts, conseil Career Center)
- `entreprises.html` — Coaching collaborateurs, conférences RH
- `a-propos.html` — Histoire d'Aurélia (recrutement → école → Australie → OZ)
- `contact.html` — Prise de RDV (Calendly) + formulaires
- `mentions-legales.html`

## Technique
- HTML/CSS/JS statique, sans dépendance de build
- `styles.css` (DA « good vibes » : eucalyptus / océan / crème) · `site.js` (menu, reveals, compteurs, quiz)
- Responsive (mobile-first, breakpoints 600 / 960 px), SEO (JSON-LD, sitemap, OG), RGPD
- Polices : Fraunces + Outfit + Caveat (Google Fonts)

## À finaliser avant mise en ligne
- Choix du logo (voir `logos-v2/`)
- URL Calendly réelle dans `contact.html`
- Validation des tarifs (`OFFRE-TARIFS-PROPOSITION.md`)
- Domaine + hébergement (Hostinger), remplacer `https://www.ozcoaching.fr/`

## Génération de leads (juillet 2026)
- `oeil-recruteuse.html` + `oeil.js` — outil « L'œil de la recruteuse », 2 parcours :
  - **J'écris** : analyse titre LinkedIn / accroche CV (scoring 100 % côté client), jauge animée.
  - **J'importe mon CV (PDF)** : extraction du texte via pdf.js (chargé depuis CDN cloudflare, parcours PDF
    uniquement), détection des PDF illisibles (image/colonnes). Analyse IA **à brancher** :
    remplir la constante `CV_ANALYZE_ENDPOINT` en haut de `oeil.js` avec l'URL d'un endpoint (ex. edge function
    Supabase appelant Claude) qui reçoit `{texte, cible}` et renvoie `{score, verdict:{t,d}, forces, alertes, conseils}`.
    Tant qu'elle est vide → capture du CV + lead pour **audit humain** par Aurélia (source `cv`).
  - Capture e-mail sur les deux parcours. Promo sur l'accueil + lien nav/footer.
- Quiz d'orientation (accueil) : résultat personnalisé avec offre recommandée + capture e-mail « plan d'action ».
- Workflow n8n `OZ Coaching — Leads site (outil + quiz) → séquence email` (ID `UT8YMlsURN9g59Pk`) :
  - Webhook actif : `POST https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead` (capture les leads, visibles dans les exécutions)
  - Séquence : e-mail 1 immédiat (rapport outil / plan quiz / accusé de réception CV) → J+2 histoire → J+5 preuve sociale → J+9 offre Pack Décollage
  - Sources gérées : `outil` (score texte), `quiz` (plan d'action par profil), `cv` (accusé réception + audit 48h)
  - ⚠️ **Les 4 nœuds d'envoi sont désactivés** : l'expéditeur est réglé sur `contact@ozcoaching.fr`, à activer
    seulement après vérification du domaine ozcoaching.fr dans Resend (+ crédential Resend dédiée si compte séparé).
    En attendant, aucun e-mail ne part ; les leads sont capturés.
  - Champ `test: true` dans le payload = e-mail 1 seul, pas de séquence.

## Docs de travail
`SEO-PLAN.md` · `OFFRE-TARIFS-PROPOSITION.md` · `AUTOMATISATIONS.md`
