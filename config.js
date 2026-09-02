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

  /* --- 3. Webhook n8n (capture des leads) ---------------------------------
     Reçoit : l'outil « L'œil », le quiz, les CV, les demandes de plaquette. */
  webhook: 'https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead',

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
