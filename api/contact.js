// Formulaire de contact → e-mail à Aurélia + accusé de réception au visiteur.
//
// Remplace FormSubmit, qui exigeait une activation manuelle jamais faite : les
// messages du formulaire ne partaient donc nulle part. Passer par Resend supprime
// aussi le transit des messages par un service tiers.
//
// Variable d'environnement requise : RESEND_API_KEY.

const {
  CONTACT, SITE, NOTIF, BANDEAU_TEST,
  wrapInterne, BTN_INTERNE, ENCART, esc, CYAN,
  wrap, BTN, RDV
} = require('./_emails');

const EXPEDITEUR = 'Site OZ Coaching <contact@oz-coaching.fr>';

// Le message du visiteur est du texte : on préserve ses sauts de ligne.
// Marges explicites — les clients mail appliquent des marges par défaut
// très variables sur les paragraphes.
const enParagraphes = t => esc(t).split(/\n{2,}/)
  .map((p, i) => `<p style="margin:${i ? '12px' : '0'} 0 0">` + p.replace(/\n/g, '<br>') + '</p>')
  .join('');

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
  const prenom = nom.split(' ')[0];
  const pourAurelia = wrapInterne(
    'Formulaire de contact',
    `${prenom} vous a écrit`,
    `${BANDEAU_TEST}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px">
    <tr>
      <td style="background:${ecole ? '#EFF6F8' : '#FDF6E9'};border-radius:12px;padding:14px 18px;font-size:14.5px;color:#3A3B3C">
        <strong style="font-size:15.5px">${ecole ? '🏫 Une école' : '💼 Un particulier'}</strong>${orga ? `<br><span style="color:#8A8F91">${esc(orga)}</span>` : ''}
      </td>
    </tr>
  </table>
  <p style="margin:0 0 2px;font-size:19px;font-weight:bold">${esc(nom)}</p>
  <p style="margin:0 0 24px;font-size:15px"><a href="mailto:${esc(email)}" style="color:${CYAN};text-decoration:none">${esc(email)}</a></p>
  <p style="margin:0 0 8px;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#8A8F91">Son message</p>
  ${ENCART(enParagraphes(message), '#F6F4F0', CYAN)}
  ${BTN_INTERNE('mailto:' + esc(email), 'Répondre à ' + esc(prenom))}`
  );

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
      html: wrap('Bien reçu — Aurélia vous répond sous 48 h ouvrées.', `
<p>${esc(prenom)},</p>
<p>Votre message est bien arrivé — merci de m'avoir écrit 🙏</p>
<p>Je lis tout personnellement et je vous réponds sous <strong>48 heures ouvrées</strong>.</p>
<p>Si votre sujet est pressé, vous pouvez aussi réserver directement un créneau de 30 minutes — c'est offert, et souvent plus rapide qu'un échange par e-mail :</p>
${BTN(RDV, 'Réserver un échange (30 min)')}
<p>À très vite,<br><strong>Aurélia</strong></p>`)
    });
  } catch (err) {
    console.error('accuse de reception', err);
  }

  return res.status(200).json({ ok: true });
};
