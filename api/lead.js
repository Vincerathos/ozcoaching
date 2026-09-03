// Capture des leads du site → séquence de 4 e-mails via Resend.
//
// Remplace le workflow n8n. Les trois relances ne dépendent plus d'un automate
// qui doit rester allumé : elles sont programmées chez Resend au moment du lead
// (paramètre scheduled_at), donc elles partiront même si rien ne tourne ici.
//
// Variable d'environnement requise : RESEND_API_KEY (réglages Vercel).
// La clé ne doit jamais être appelée depuis le navigateur : elle permettrait à
// n'importe qui d'envoyer du courrier au nom du domaine.

const { construireEmails, CONTACT } = require('./_emails');

const EXPEDITEUR = 'Aurélia — OZ Coaching <contact@oz-coaching.fr>';
const JOURS = { e2: 2, e3: 5, e4: 9 };

const LIBELLES = {
  outil: "de l'outil « L'œil »",
  quiz: 'du quiz',
  cv: '— CV importé',
  doc: '— demande de documentation'
};

const dans = jours => new Date(Date.now() + jours * 86400000).toISOString();

const esc = s => ('' + (s == null ? '' : s))
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Récapitulatif envoyé à Aurélia : ce qu'elle doit savoir pour rappeler la
// personne, y compris ce que la séquence automatique va lui écrire ensuite.
function notificationLead(b, e) {
  const ligne = (l, v) => v ? `<tr><td style="padding:5px 12px 5px 0;color:#8A8F91;font-size:13.5px">${l}</td><td style="padding:5px 0;font-size:14.5px"><strong>${esc(v)}</strong></td></tr>` : '';
  const bloc = (titre, arr) => (arr && arr.length)
    ? `<p style="margin:16px 0 6px;font-size:13.5px;color:#8A8F91">${titre}</p><ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.65">${arr.map(x => '<li>' + esc(x) + '</li>').join('')}</ul>`
    : '';
  return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#231F20;max-width:620px">
  <p style="background:${e.b2b ? '#EFF6F8' : '#FDF6E9'};border-radius:12px;padding:12px 16px;margin:0 0 18px;font-size:15px">
    <strong>${e.b2b ? '🏫 Lead école (B2B)' : '💼 Lead particulier'}</strong>
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0">
    ${ligne('Prénom', e.prenom)}
    ${ligne('E-mail', e.email)}
    ${ligne('Origine', LIBELLES[e.source] || e.source)}
    ${ligne('Profil', e.profil)}
    ${ligne('Document', e.doc)}
    ${ligne('Établissement', e.orga)}
    ${ligne('Score obtenu', b.score != null ? b.score + '/100' : '')}
    ${ligne('Page', b.page)}
  </table>
  ${bloc("Points forts relevés", b.forces)}
  ${bloc("Alertes relevées", b.alertes)}
  <p style="margin-top:22px;padding-top:14px;border-top:1px solid #E9E7E2;font-size:12.5px;color:#8A8F91">
    Cette personne vient de recevoir son e-mail, et recevra automatiquement trois relances
    à J+2, J+5 et J+9. Répondez à ce message pour lui écrire directement.
  </p>
</div>`;
}

async function envoyer(cle, message) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cle, 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    throw new Error('resend ' + r.status + ' ' + detail.slice(0, 300));
  }
  return r.json();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erreur: 'methode_non_autorisee' });
  }

  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    // Pas de clé : on le dit franchement plutôt que de faire croire à un envoi.
    return res.status(503).json({ erreur: 'non_configure' });
  }

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Honeypot : un robot remplit ce champ, un humain ne le voit pas.
  // On répond 200 pour ne pas lui signaler qu'il a été détecté.
  if (b.website) return res.status(200).json({ ok: true });

  const email = (b.email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return res.status(400).json({ erreur: 'email_invalide' });
  }

  let e;
  try {
    e = construireEmails(b);
  } catch (err) {
    console.error('construction des emails', err);
    return res.status(500).json({ erreur: 'construction' });
  }

  try {
    // E-mail 1 : immédiat. C'est celui que la personne attend — s'il échoue,
    // l'échec doit remonter au formulaire.
    await envoyer(cle, { from: EXPEDITEUR, to: email, subject: e.e1s, html: e.e1h, reply_to: CONTACT });
  } catch (err) {
    console.error('envoi immediat', err);
    return res.status(502).json({ erreur: 'envoi' });
  }

  // Prévenir Aurélia : sans ça, elle ne sait pas qu'un lead est arrivé.
  // L'échec ne doit pas faire échouer le formulaire — le prospect, lui, a
  // déjà reçu son e-mail.
  try {
    await envoyer(cle, {
      from: 'Site OZ Coaching <contact@oz-coaching.fr>',
      to: CONTACT,
      reply_to: email,
      subject: `[Site OZ] Nouveau lead ${LIBELLES[e.source] || e.source} — ${e.prenom}`,
      html: notificationLead(b, e)
    });
  } catch (err) {
    console.error('notification lead', err);
  }

  // Un lead de test ne déclenche que le premier e-mail.
  if (b.test) return res.status(200).json({ ok: true, programmes: 0 });

  // Les trois relances. Programmées une par une : si l'une échoue, les autres
  // partent quand même, et le lead reste acquis puisque l'e-mail 1 est envoyé.
  let programmes = 0;
  for (const [n, jours] of Object.entries(JOURS)) {
    try {
      await envoyer(cle, {
        from: EXPEDITEUR, to: email,
        subject: e[n + 's'], html: e[n + 'h'],
        reply_to: CONTACT,
        scheduled_at: dans(jours)
      });
      programmes++;
    } catch (err) {
      console.error('programmation ' + n, err);
    }
  }

  return res.status(200).json({ ok: true, programmes });
};
