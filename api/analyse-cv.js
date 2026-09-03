// « L'œil de la recruteuse » — premier filtre IA sur un CV.
//
// Remplace le workflow n8n. Le navigateur envoie le texte extrait du PDF ; la
// clé Anthropic reste ici, côté serveur.
//
// Variable d'environnement requise : ANTHROPIC_API_KEY (réglages Vercel).
//
// Si cette fonction échoue ou n'est pas configurée, le site retombe de lui-même
// sur l'audit humain par Aurélia : ne jamais renvoyer une analyse approximative
// pour « sauver » l'appel, ce serait précisément ce qu'elle refuse.

const MODELE = 'claude-sonnet-5';

const SYSTEME = `Tu es Aurélia Grino, fondatrice d'OZ Coaching. Tu as 17 ans d'expérience dont sept en cabinet de recrutement (France puis recruteuse tech à Sydney), puis quatre ans en Career Center de Grande École. Tu as trié des centaines de candidatures et mené plus de 1000 entretiens.

On te soumet le texte brut d'un CV. Tu l'analyses comme tu le faisais en cabinet : en 6 secondes tu sais si tu continues ou si tu passes au suivant. Ici, tu prends le temps d'expliquer pourquoi.

Règles de ton :
- Tu vouvoies la personne.
- Tu es directe et concrète, jamais complaisante, mais toujours bienveillante : ton but est qu'elle progresse, pas qu'elle se sente jugée.
- Chaque remarque cite un élément PRÉCIS du CV (un intitulé, un chiffre, une formulation). Jamais de conseil générique qu'on pourrait servir à n'importe qui.
- Pas de jargon RH creux.

Ce que tu regardes : la clarté du positionnement dès les premières lignes, la présence de résultats chiffrés plutôt que de listes de tâches, les verbes d'action, les mots creux (« dynamique », « motivé », « rigoureux »...), la cohérence et les trous de parcours, la lisibilité de la structure, et l'adéquation au poste visé s'il est indiqué.

Tu réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown, exactement dans cette forme :
{
  "score": <entier 8 à 96>,
  "verdict": { "t": "<titre court et franc, avec un emoji>", "d": "<2 à 3 phrases qui expliquent le score>" },
  "forces": ["<3 à 5 points forts précis>"],
  "alertes": ["<2 à 5 choses qui ferment des portes>"],
  "conseils": ["<2 à 4 corrections actionnables dès aujourd'hui>"]
}

Barème : 80+ = tu t'arrêtais dessus en cabinet. 60-79 = bonne base, il manque les preuves. 40-59 = ressemble à des centaines d'autres. Moins de 40 = ne passe pas le tri, à reconstruire.`;

// Le modèle glisse parfois une virgule finale ou une clôture markdown malgré la
// consigne : on nettoie avant de parser plutôt que de perdre l'analyse.
function nettoyer(s) {
  return s
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .replace(/,(\s*[}\]])/g, '$1')
    .trim();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erreur: 'methode_non_autorisee' });
  }

  const cle = process.env.ANTHROPIC_API_KEY;
  if (!cle) return res.status(503).json({ erreur: 'non_configure' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const texte = (b.texte || '').toString().slice(0, 12000).trim();
  const cible = (b.cible || '').toString().slice(0, 200).trim();

  if (texte.length < 120) return res.status(400).json({ erreur: 'texte_trop_court' });

  const utilisateur = (cible ? `Poste visé par la personne : ${cible}\n\n` : '')
    + `Texte du CV :\n"""\n${texte}\n"""`;

  let reponse;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': cle,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODELE,
        max_tokens: 2000,
        system: SYSTEME,
        messages: [{ role: 'user', content: utilisateur }]
      })
    });
    if (!r.ok) {
      const detail = (await r.text().catch(() => '')).slice(0, 400);
      console.error('anthropic ' + r.status, detail);
      // Le statut renvoyé par le fournisseur est remonté tel quel : il dit
      // immédiatement s'il s'agit d'une clé refusée (401), d'une requête
      // invalide (400) ou d'un quota (429). Aucun secret n'y transite.
      let message = '';
      try { message = (JSON.parse(detail).error || {}).message || ''; } catch (e) { message = detail; }
      return res.status(502).json({ erreur: 'analyse_indisponible', amont: r.status, message: message.slice(0, 200) });
    }
    reponse = await r.json();
  } catch (err) {
    console.error('appel anthropic', err);
    return res.status(502).json({ erreur: 'analyse_indisponible' });
  }

  // La réponse peut contenir plusieurs blocs (raisonnement, texte) : on ne
  // garde que le texte.
  const brut = (reponse.content || [])
    .filter(c => c && c.type === 'text')
    .map(c => c.text)
    .join('')
    .trim();

  let analyse;
  try {
    analyse = JSON.parse(nettoyer(brut));
  } catch (err) {
    console.error('json illisible', brut.slice(0, 300));
    return res.status(502).json({ erreur: 'analyse_illisible' });
  }

  if (!analyse || !analyse.verdict || typeof analyse.score !== 'number') {
    return res.status(502).json({ erreur: 'analyse_incomplete' });
  }

  return res.status(200).json(analyse);
};
