// Formulaire de contact → e-mail à Aurélia + accusé de réception au visiteur.
//
// Remplace FormSubmit, qui exigeait une activation manuelle jamais faite : les
// messages du formulaire ne partaient donc nulle part. Passer par Resend supprime
// aussi le transit des messages par un service tiers.
//
// Variable d'environnement requise : RESEND_API_KEY.

const { CONTACT, SITE, NOTIF, BANDEAU_TEST } = require('./_emails');

const EXPEDITEUR = 'Site OZ Coaching <contact@oz-coaching.fr>';

const esc = s => ('' + (s == null ? '' : s))
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Le message du visiteur est du texte : on préserve ses sauts de ligne.
const enParagraphes = t => esc(t).split(/\n{2,}/)
  .map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');

async function envoyer(cle, message) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cle, 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 300));
  return r.json();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erreur: 'methode_non_autorisee' });
  }

  const cle = process.env.RESEND_API_KEY;
  if (!cle) return res.status(503).json({ erreur: 'non_configure' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (b.website) return res.status(200).json({ ok: true }); // honeypot

  const nom = (b.nom || '').toString().trim().slice(0, 120);
  const email = (b.email || '').toString().trim().slice(0, 200);
  const message = (b.message || '').toString().trim().slice(0, 5000);
  const profil = (b.profil || '').toString().trim().slice(0, 60);
  const orga = (b.organisation || '').toString().trim().slice(0, 160);

  if (!nom || !message) return res.status(400).json({ erreur: 'champs_manquants' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return res.status(400).json({ erreur: 'email_invalide' });
  }

  const ecole = /école|ecole/i.test(profil);

  // 1. Le message à Aurélia. reply_to pointe sur le visiteur : elle répond
  //    directement depuis sa boîte, sans copier l'adresse à la main.
  const pourAurelia = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#231F20">
  ${BANDEAU_TEST}
  <p style="background:${ecole ? '#EFF6F8' : '#FDF6E9'};border-radius:12px;padding:12px 16px;margin:0 0 18px">
    <strong>${ecole ? '🏫 Une école' : '💼 Un particulier'}</strong>
    ${orga ? ' — ' + esc(orga) : ''}
  </p>
  <p style="margin:0 0 4px"><strong>${esc(nom)}</strong></p>
  <p style="margin:0 0 18px"><a href="mailto:${esc(email)}">${esc(email)}</a></p>
  <div style="border-left:4px solid #0097B2;padding-left:16px;color:#3A3B3C">
    ${enParagraphes(message)}
  </div>
  <p style="margin-top:22px;font-size:12.5px;color:#8A8F91">
    Envoyé depuis le formulaire de ${SITE} — répondez à ce message, votre réponse partira directement à ${esc(nom)}.
  </p>
</div>`;

  try {
    await envoyer(cle, {
      from: EXPEDITEUR,
      to: NOTIF,
      reply_to: email,
      subject: `[Site OZ] ${ecole ? 'École' : 'Particulier'} — ${nom}`,
      html: pourAurelia
    });
  } catch (err) {
    console.error('notification contact', err);
    return res.status(502).json({ erreur: 'envoi' });
  }

  // 2. L'accusé de réception au visiteur. S'il échoue, le message est déjà
  //    arrivé chez Aurélia : on ne fait pas échouer le formulaire pour autant.
  try {
    await envoyer(cle, {
      from: 'Aurélia — OZ Coaching <contact@oz-coaching.fr>',
      to: email,
      reply_to: CONTACT,
      subject: 'Votre message est bien arrivé',
      html: `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15.5px;line-height:1.7;color:#231F20;max-width:600px">
  <p>${esc(nom.split(' ')[0])},</p>
  <p>Votre message est bien arrivé — merci de m'avoir écrit 🙏</p>
  <p>Je lis tout personnellement et je vous réponds sous <strong>48 heures ouvrées</strong>.</p>
  <p>Si votre sujet est pressé, vous pouvez aussi réserver directement un créneau de 30 minutes :
    <a href="${SITE}/contact.html#rdv" style="color:#0097B2">${SITE}/contact.html#rdv</a></p>
  <p>À très vite,<br><strong>Aurélia Grino</strong><br>
    <span style="font-size:13px;color:#8A8F91">OZ Coaching — révélatrice des talents de demain</span></p>
</div>`
    });
  } catch (err) {
    console.error('accuse de reception', err);
  }

  return res.status(200).json({ ok: true });
};
