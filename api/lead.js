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

const dans = jours => new Date(Date.now() + jours * 86400000).toISOString();

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
