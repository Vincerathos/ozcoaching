/* =============================================================================
   OZ COACHING — Réglages des outils externes
   -----------------------------------------------------------------------------
   C'est LE SEUL fichier à modifier pour brancher les outils d'Aurélia.
   Aucun autre fichier n'a besoin d'être touché : le site lit ces valeurs.
   ========================================================================== */
window.OZ_CONFIG = {

  /* --- 1. Domaine définitif ------------------------------------------------
     Choisi par Aurélia le 02/09/2026 (ozcoaching.fr étant déjà pris).
     Reste à acheter puis à héberger. */
  domaine: 'https://www.oz-coaching.fr',

  /* --- 2. Prise de rendez-vous --------------------------------------------
     Aurélia a créé ses créneaux dans Google Agenda (et non Calendly) :
     « OZ Coaching - Réserver un premier échange ☕ », 30 min.
     Lien court equivalent : https://calendar.app.google/pzvwWAVpPP5ttXTV6 */
  agenda: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2RYMIvgIoW1L4x4hwsGxpvvaUDxFSR191NQP0g-ykGtixufL8tRGIJnSJy_Dh2ReBjZqrzbhUx',

  /* --- 3. Capture des leads ------------------------------------------------
     Reçoit : l'outil « L'œil », le quiz, les CV, les demandes de plaquette.

     ⚠️ COUPÉ LE 03/09/2026. Ces deux endpoints pointaient vers une instance
     d'automatisation tierce, devenue inaccessible au prestataire. Elle répondait
     pourtant toujours : chaque formulaire y envoyait le prénom et l'e-mail d'un
     prospect, et chaque import de CV son contenu intégral — vers une destination
     que ni Aurélia (responsable de traitement) ni le prestataire ne pouvaient
     plus consulter, sécuriser ou purger. (Détail technique dans le README, qui
     n'est pas publié.)

     Tant que ces valeurs sont vides, les formulaires basculent proprement sur
     le contact par e-mail et l'outil « L'œil » repasse en audit humain.
     À remplacer par les fonctions Vercel du site (même domaine, même compte). */
  webhook: '',

  /* --- 3.bis Analyse de CV par IA -----------------------------------------
     Reçoit {texte, cible} et renvoie {score, verdict:{t,d}, forces, alertes,
     conseils}. Vide = audit manuel par Aurélia (repli automatique). */
  analyseCV: '',

  /* --- 4. Adresse de réception du formulaire de contact --------------------
     Utilisée par FormSubmit. ⚠️ FormSubmit exige une activation : au tout
     premier envoi, un e-mail de confirmation arrive dans cette boîte et le
     lien doit être cliqué, sinon les messages suivants ne partent jamais. */
  emailContact: 'aurelia.grino.ozcoaching@gmail.com',

  /* --- 5. Téléphone --------------------------------------------------------
     Aurélia ne souhaite pas exposer son portable : le mail est le canal n°1,
     le téléphone se donne après le premier échange. Le numéro reste
     uniquement dans les mentions légales (obligation LCEN pour un
     professionnel). Mettre à true pour le réafficher sur le site. */
  afficherTelephone: false,
  telephone: '06 76 92 15 74'
};
