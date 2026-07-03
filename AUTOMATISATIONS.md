# Plan d'automatisation — OZ Coaching
*Pour simplifier la vie d'Aurélia : RDV, facturation, suivi client. Budget total ≈ 15-40 €/mois.*

## 1. Prise de RDV : Calendly ↔ Outlook (la base, à faire en premier)

Calendly se connecte **nativement** au calendrier Outlook (aurelia.grino@outlook.fr) :
- Synchro bidirectionnelle : un créneau pris sur Calendly apparaît dans Outlook, et ses RDV Outlook bloquent les créneaux Calendly (zéro doublon).
- Confirmations + rappels automatiques (J-1) aux coachés → moins de no-shows.
- Lien visio Teams/Meet généré automatiquement.

**Types de RDV à créer :**
1. `Échange découverte` — 30 min, gratuit, lien mis sur le site (bouton « Prendre RDV »)
2. `Séance coaching` — 60 min, buffer 15 min après (notes/transition)
3. `Séance approfondie` — 90 min, buffer 15 min
4. `Échange écoles/entreprises` — 45 min

**Coût :** gratuit pour démarrer (1 type de RDV), puis Calendly Pro ~14 €/mois pour les 4 types + rappels + paiement à la réservation (Stripe) si souhaité.

**Intégration site : déjà prête** — le module Calendly est intégré dans `contact.html`. Il suffit de remplacer l'URL `data-url` par celle de son compte.

## 2. Facturation électronique (obligation légale qui arrive)

**Calendrier réglementaire pour son EI :**
- **1er sept. 2026** : obligation de pouvoir **recevoir** des factures électroniques (via une plateforme agréée)
- **1er sept. 2027** : obligation d'**émettre** ses factures électroniquement (B2B)
- Pénalité : 15 €/facture en retard

**Outils adaptés à une EI coach (comparés) :**

| Outil | Prix | Verdict |
|---|---|---|
| **Tiime** | Gratuit | ✅ Recommandé pour démarrer : simple, plateforme agréée |
| **Abby** | Gratuit | ✅ Bonne alternative moderne, conforme Factur-X |
| Indy | 0 puis ~9 €/mois | Si volume > 10 factures/mois (devis + suivi paiement) |
| Henrri | ~29 €/mois | Si besoin compta complète |
| Pennylane | Gratuit/payant | Surdimensionné pour une coach solo |

**« Rappidos »** (ta proposition) : je ne le trouve pas dans les plateformes reconnues de l'écosystème français — à vérifier : est-il **immatriculé PDP ou connecté à une plateforme agréée** (liste sur impots.gouv.fr) ? Gère-t-il le format Factur-X ? Sinon, Tiime/Abby sont des valeurs sûres et gratuites. À trancher avec son expert-comptable.

## 3. Workflows n8n (par ordre d'impact)

| # | Workflow | Déclencheur → actions | Gain |
|---|---|---|---|
| 1 | **E-mail de préparation au RDV** | Réservation Calendly → e-mail personnalisé (« Pour préparer notre échange… ») | ~2,5 h/mois + image pro |
| 2 | **Mini-CRM automatique** | Réservation → création fiche client (Notion/Airtable/Sheets) : nom, segment, historique | Suivi sans saisie |
| 3 | **Récap + demande d'avis** | Fin d'accompagnement → e-mail récap, puis à J+3 demande d'avis Google/LinkedIn | Preuve sociale, SEO local |
| 4 | **Devis accepté → facture** | Statut devis « accepté » → génération facture (Tiime/Abby) + envoi | ~8 min/devis, conformité |
| 5 | **Onboarding école** | Formulaire site → fiche + brouillon de devis + relance auto si sans réponse à J+7 | Leads B2B jamais perdus |
| 6 | **Relance factures impayées** | J+14 puis J+30 après émission → e-mails de relance progressifs | Trésorerie |
| 7 | **No-show → replanification** | RDV manqué → e-mail bienveillant + lien Calendly | Clients récupérés |
| 8 | **Posts LinkedIn planifiés** | Brouillons Notion → publication programmée | Régularité sans y penser |
| 9 | **Collecte de témoignages** | J+7 fin de coaching → formulaire 5 questions → intégré au site | Contenu qui vend |

**Infra n8n :** n8n Cloud gratuit pour commencer (jusqu'à quelques workflows), ~20 €/mois au-delà, ou auto-hébergé.
**Ordre de mise en place conseillé :** Calendly+Outlook (1 h de config) → Tiime (1 h) → workflows n8n 1, 2, 3 (une demi-journée).

## 4. Récap budget

| Poste | Coût/mois |
|---|---|
| Calendly (gratuit → Pro) | 0 → 14 € |
| Tiime ou Abby (facturation) | 0 € |
| n8n | 0 → 20 € |
| **Total** | **0 → ~35 €/mois** |
