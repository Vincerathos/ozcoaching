/* =============================================================================
   OZ COACHING — Réglages des outils externes
   -----------------------------------------------------------------------------
   C'est LE SEUL fichier à modifier pour brancher les outils d'Aurélia.
   Aucun autre fichier n'a besoin d'être touché : le site lit ces valeurs.
   ========================================================================== */
window.OZ_CONFIG = {

  /* --- 1. Domaine définitif ------------------------------------------------
     Sert aux liens absolus (partages, e-mails, plaquettes).
     ⚠️ ozcoaching.fr appartient à un autre coach (à Brest) : un domaine
     disponible reste à choisir. Laisser vide tant que ce n'est pas tranché. */
  domaine: '',

  /* --- 2. Calendly ---------------------------------------------------------
     Compte d'Aurélia : https://calendly.com/aurelia-grino
     Un seul type de RDV y existe aujourd'hui : « RDV Individuel PPI ».
     ⚠️ À valider : le site promet « un échange découverte de 30 min, offert ».
     Si ce RDV n'est pas celui-là, créer dans Calendly un événement dédié
     (30 min, gratuit) et remplacer le slug ci-dessous. */
  calendly: 'https://calendly.com/aurelia-grino/rdv-individuel-ppi',

  /* --- 3. Webhook n8n (capture des leads) ---------------------------------
     Reçoit : l'outil « L'œil », le quiz, les CV, les demandes de plaquette. */
  webhook: 'https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead',

  /* --- 4. Adresse de réception du formulaire de contact --------------------
     Utilisée par FormSubmit. ⚠️ FormSubmit exige une activation : au tout
     premier envoi, un e-mail de confirmation arrive dans cette boîte et le
     lien doit être cliqué, sinon les messages suivants ne partent jamais. */
  emailContact: 'aurelia.grino.ozcoaching@gmail.com'
};
