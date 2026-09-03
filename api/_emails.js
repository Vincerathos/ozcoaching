// Construction des 4 e-mails de la séquence OZ Coaching.
//
// Porté depuis le workflow n8n devenu inaccessible, à contenu rédactionnel
// identique. Le préfixe « _ » empêche Vercel d'exposer ce fichier comme route :
// il n'est appelé que par api/lead.js.
//
// Les liens pointaient vers ozcoaching.fr — un domaine qui appartient à un autre
// coach. Ils sont corrigés ici vers oz-coaching.fr.

const SITE = 'https://www.oz-coaching.fr';

// Adresse publique d'Aurélia : sert de reply_to sur les e-mails envoyés aux
// visiteurs, et de destination par défaut des notifications internes.
const CONTACT = 'aurelia.grino.ozcoaching@gmail.com';

// Où arrivent les notifications internes (nouveau lead, message de contact).
// Poser EMAIL_NOTIFICATIONS dans les réglages Vercel les détourne vers une autre
// boîte — le temps de valider la chaîne sans écrire chez la cliente. Retirer la
// variable les renvoie chez Aurélia : aucun code à modifier pour basculer.
const NOTIF = (process.env.EMAIL_NOTIFICATIONS || '').trim() || CONTACT;
const NOTIF_DETOURNEE = NOTIF !== CONTACT;

// Bandeau rappelant que la notification est détournée, pour qu'un e-mail de
// test ne puisse pas être pris pour un vrai lead.
const BANDEAU_TEST = NOTIF_DETOURNEE
  ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px"><tr><td style="background:#FDF6E9;border:1.5px solid #E7CE9C;border-radius:12px;padding:12px 16px;font-size:13px;line-height:1.55;color:#5E4611">
      ⚠️ <strong>Notification détournée.</strong> <code style="font-size:12px">EMAIL_NOTIFICATIONS</code> est renseignée&nbsp;: cet e-mail arrive ici au lieu de la boîte d'Aurélia. Retirer la variable dans Vercel pour rétablir.
    </td></tr></table>`
  : '';

const RDV = SITE + '/contact.html#rdv';
const PLAQUETTES = {
  ecoles: SITE + '/brochures/OZ-Coaching-Ecoles-superieures.pdf',
  carriere: SITE + '/brochures/OZ-Coaching-Accompagnement-carriere.pdf'
};
const UNSUB = 'mailto:' + CONTACT + '?subject=' + encodeURIComponent('Se désinscrire');

const esc = s => ('' + (s == null ? '' : s))
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const BTN = (url, txt) => `<p style="text-align:center;margin:28px 0"><a href="${url}" style="background:#0097B2;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;padding:15px 34px;border-radius:40px;display:inline-block">${txt}</a></p>`;

const wrap = (preheader, corps) => `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#F6F4F0;font-family:Arial,Helvetica,sans-serif;color:#231F20"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F4F0;padding:24px 12px"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:20px;border:1px solid #E4E2DD;overflow:hidden"><tr><td style="padding:30px 40px 6px 40px;text-align:center"><span style="font-size:24px;font-weight:bold;color:#231F20">Oz Coaching</span><br><span style="font-size:11px;letter-spacing:2px;color:#004956">RÉVÉLATRICE DES TALENTS DE DEMAIN</span></td></tr><tr><td style="padding:18px 40px 8px 40px;font-size:15.5px;line-height:1.7;color:#3A3B3C">${corps}</td></tr><tr><td style="padding:22px 40px 26px 40px;font-size:12px;color:#8A8F91;border-top:1px solid #E9E7E2;text-align:center">Aurélia Grino — ingénierie pédagogique &amp; employabilité · accompagnement carrière<br>Montpellier, Nîmes &amp; visio · <a href="https://www.linkedin.com/in/aureliagrino/" style="color:#0097B2">LinkedIn</a> · <a href="${UNSUB}" style="color:#8A8F91">Se désinscrire</a></td></tr></table></td></tr></table></body></html>`;

// ---------------------------------------------------------------------------
// Gabarit des notifications internes (nouveau lead, message de contact).
// Les clients mail ignorent les feuilles de style et la mise en page moderne :
// tout passe par des tables et du style en ligne, comme pour les e-mails
// visiteurs. Largeur bornée à 600 px, mais fluide en dessous pour le mobile.
// ---------------------------------------------------------------------------
const PETROLE = '#004956';
const CYAN = '#0097B2';

// Bouton d'action principal (répondre à la personne).
const BTN_INTERNE = (url, txt) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 6px"><tr><td style="background:${CYAN};border-radius:40px"><a href="${url}" style="display:inline-block;padding:13px 30px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">${txt}</a></td></tr></table>`;

// Encart d'information (badge, bloc citation…).
const ENCART = (corps, fond, bordure) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr><td style="background:${fond};border-left:4px solid ${bordure};border-radius:0 12px 12px 0;padding:14px 18px;font-size:14.5px;line-height:1.6;color:#3A3B3C">${corps}</td></tr></table>`;

function wrapInterne(surtitre, titre, corps) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F6F4F0;font-family:Arial,Helvetica,sans-serif;color:#231F20">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F4F0;padding:26px 12px">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;border:1px solid #E4E2DD;overflow:hidden">
      <tr><td style="background:${PETROLE};padding:22px 34px">
        <span style="font-size:10.5px;letter-spacing:2.4px;color:#8FD3E0;text-transform:uppercase">${esc(surtitre)}</span><br>
        <span style="font-size:21px;font-weight:bold;color:#ffffff;line-height:1.35">${esc(titre)}</span>
      </td></tr>
      <tr><td style="padding:28px 34px 30px 34px">${corps}</td></tr>
      <tr><td style="padding:18px 34px 24px 34px;border-top:1px solid #E9E7E2;font-size:12px;line-height:1.6;color:#8A8F91;text-align:center">
        Notification automatique du site <a href="${SITE}" style="color:${CYAN};text-decoration:none">oz-coaching.fr</a><br>
        Répondez à ce message : votre réponse partira directement à la personne.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const liste = (arr, coul, ico) => (arr && arr.length
  ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + arr.map(x =>
      `<tr><td style="padding:8px 12px;background:${coul};border-radius:10px;font-size:14px;line-height:1.6">${ico} ${esc(x)}</td></tr><tr><td style="height:8px"></td></tr>`
    ).join('') + '</table>'
  : '');

function construireEmails(b) {
  const prenom = ((b.prenom || '').trim()) || 'Bonjour';
  const email = (b.email || '').trim();
  const SOURCES = ['quiz', 'cv', 'doc', 'outil'];
  const source = SOURCES.includes(b.source) ? b.source : 'outil';
  const profil = b.profil || '';
  const doc = b.doc || '';
  const orga = (b.organisation || '').trim();
  // Un lead « école » est B2B : le discours et la séquence diffèrent du B2C carrière.
  const b2b = profil === 'ecole' || doc === 'ecoles';

  // ===== EMAIL 1 — immédiat, dépend de la source =====
  let e1s, e1h;
  if (source === 'cv') {
    e1s = `${prenom}, votre CV est bien arrivé sous l'œil de la recruteuse 👁️`;
    e1h = wrap(`Bien reçu — votre audit CV personnalisé arrive sous 48h.`, `
<p>${esc(prenom)},</p>
<p>Votre CV est bien arrivé — merci de votre confiance 🙏</p>
<p>Je le passe au crible avec mon œil de recruteuse : structure, résultats mis en avant, ce qui accroche et ce qui fait fermer une porte. <strong>Vous recevez votre audit personnalisé sous 48h ouvrées.</strong></p>
<p>En attendant, une question qui fait 80 % du travail : reprenez la première demi-page de votre CV et demandez-vous <em>« qu'est-ce qu'un recruteur pressé retient de moi en 6 secondes ? »</em>. Si la réponse n'est pas nette, on tient déjà votre premier chantier.</p>
<p>Et si vous voulez qu'on en parle de vive voix, mon échange découverte est offert :</p>
${BTN(RDV, 'Réserver mon échange offert (30 min)')}
<p>À très vite,<br><strong>Aurélia</strong></p>`);
  } else if (source === 'outil') {
    const score = b.score != null ? b.score : '—';
    e1s = `${prenom}, votre rapport de la recruteuse est là (score : ${score}/100)`;
    const CHECKLIST = [`Un intitulé de métier clair dès le titre (pas juste « étudiant » ou « en recherche »)`, `Une photo pro : lumière, sourire, fond neutre — 14× plus de vues de profil`, `Une bannière LinkedIn qui dit votre domaine (pas la bannière bleue par défaut)`, `Un titre qui vend une valeur, pas un statut`, `Vos coordonnées visibles en 2 secondes sur le CV`, `Une URL LinkedIn personnalisée (linkedin.com/in/prenom-nom)`, `Une accroche dont les 3 premières lignes donnent envie de cliquer « voir plus »`, `Au moins 2 résultats chiffrés (%, €, volumes, délais)`, `Des dates cohérentes, sans trous inexpliqués`, `Zéro faute — je stoppais ma lecture à la deuxième`, `Au moins 2 recommandations reçues récentes`, `Une activité visible (posts, commentaires) dans les 30 derniers jours`];
    e1h = wrap(`Votre analyse détaillée + la checklist des 12 détails que je regardais en cabinet.`, `
<p>${esc(prenom)},</p>
<p>Merci d'avoir testé <strong>L'œil de la recruteuse</strong> 👁️ Voici votre rapport complet.</p>
<p style="text-align:center;margin:24px 0"><span style="display:inline-block;background:#E2F1F5;border-radius:16px;padding:18px 34px"><span style="font-size:40px;font-weight:bold;color:#0097B2">${esc(score)}/100</span><br><span style="font-size:14px;color:#004956">${esc(b.verdict || '')}</span></span></p>
<p><strong>✅ Ce qui accroche l'œil :</strong></p>${liste(b.forces, '#EFF6F8', '✓')}
<p><strong>🚨 Ce qui ferme des portes :</strong></p>${liste(b.alertes, '#F7E3DC', '!')}
${b.conseils && b.conseils.length ? '<p><strong>💡 Mes conseils :</strong></p>' + liste(b.conseils, '#E2F1F5', '💡') : ''}
<p style="margin-top:26px"><strong>🎁 En bonus — la checklist de la recruteuse :</strong> les 12 détails que je vérifiais avant même de regarder vos diplômes.</p>${liste(CHECKLIST, '#F6F4F0', '▫️')}
<p>Un score, c'est un diagnostic. Pour corriger en profondeur — CV, LinkedIn, pitch, entretien — le plus efficace reste 30 minutes de vive voix. C'est offert, sans engagement.</p>
${BTN(RDV, 'Réserver mon échange offert (30 min)')}
<p>À très vite,<br><strong>Aurélia</strong></p>`);
  } else if (source === 'doc') {
    if (doc === 'ecoles') {
      e1s = `${prenom}, votre plaquette accompagnement écoles`;
      e1h = wrap(`Les formats, les thématiques et les modalités d'intervention.`, `
<p>${esc(prenom)},</p>
<p>Merci de votre intérêt${orga ? ` pour ${esc(orga)}` : ''} 🏫</p>
<p>Voici l'essentiel de ce que je propose aux écoles supérieures :</p>
${liste([`Ateliers de techniques de recherche d'emploi, du Bac au Bac+5`, `MOOCs et capsules vidéo sur les clés de l'alternance`, `Bootcamps d'été : décrocher une alternance en 4 semaines avant septembre`, `Accompagnement des rentrées décalées et des opportunités tardives`, `Outils de suivi tripartite, pour que le contrat aille à son terme`, `Conseil Career Center et accompagnement des indicateurs Qualiopi`], '#EFF6F8', '▫️')}
<p>Formats en présentiel, distanciel ou blended learning, de 1h30 à deux journées selon vos objectifs. <strong>Chaque intervention est construite sur mesure et chiffrée sur devis.</strong></p>
<p>Le plus simple pour avancer : 30 minutes pour poser vos enjeux — vos taux de placement, vos échéances Qualiopi, vos rentrées décalées.</p>
${BTN(PLAQUETTES.ecoles, '📄 Télécharger la plaquette (PDF)')}
<p style="text-align:center"><a href="${RDV}" style="color:#0097B2">— ou réserver directement un rendez-vous stratégique →</a></p>
<p>À très vite,<br><strong>Aurélia</strong></p>`);
    } else if (doc === 'blog') {
      e1s = `${prenom}, c'est noté — vous serez prévenu·e`;
      e1h = wrap(`Vous serez prévenu·e dès la sortie des premiers articles.`, `
<p>${esc(prenom)},</p>
<p>C'est noté : vous serez prévenu·e dès la publication des premiers articles sur l'employabilité, l'alternance et l'orientation professionnelle.</p>
<p>En attendant, je publie régulièrement sur LinkedIn — conseils candidature, coulisses du recrutement et actualités de l'alternance :</p>
${BTN('https://www.linkedin.com/in/aureliagrino/', 'Me suivre sur LinkedIn')}
<p>À très vite,<br><strong>Aurélia</strong></p>`);
    } else {
      e1s = `${prenom}, votre documentation accompagnement carrière`;
      e1h = wrap(`Le détail des accompagnements et le déroulé du parcours Ikigaï.`, `
<p>${esc(prenom)},</p>
<p>Merci de votre intérêt 🙏 Voici ce que l'on peut construire ensemble :</p>
${liste([`Personal branding et profil LinkedIn qui reflètent votre valeur réelle`, `Réseau professionnel activé, par une démarche de networking proactive`, `Mobilité interne préparée et compétences valorisées`, `Entretien de recrutement ou de promotion, préparé avec l'œil de la recruteuse`, `Stratégie de carrière claire, avec un plan d'action réaliste`, `Transitions : repositionnement, reconversion, seconde partie de carrière`], '#EFF6F8', '▫️')}
<p><strong>Et ma méthode signature, le parcours Ikigaï</strong> — cinq séances progressives : ce qui vous fait vibrer, vos talents, votre impact, du potentiel au projet, puis votre plan d'action formalisé en feuille de route.</p>
<p>Chaque accompagnement est pensé au cas par cas et <strong>chiffré sur devis personnalisé</strong>, après un premier échange où l'on fait le point ensemble. Cet échange est offert.</p>
${BTN(RDV, 'Réserver mon premier échange (30 min)')}
<p style="text-align:center"><a href="${PLAQUETTES.carriere}" style="color:#0097B2">📄 Télécharger la documentation (PDF)</a></p>
<p>À très vite,<br><strong>Aurélia</strong></p>`);
    }
  } else {
    // source = quiz
    const PLANS = {
      ecole: { s: `Interventions OZ Coaching pour vos apprenants`, t: `Boostons l'employabilité de vos apprenants 🏫`, p: [`Ateliers de techniques de recherche d'emploi, du Bac au Bac+5.`, `MOOCs et capsules vidéo : vos contenus employabilité, disponibles toute l'année.`, `Bootcamps d'été : décrocher une alternance en quatre semaines avant septembre.`, `Outils de suivi tripartite, pour que le contrat aille à son terme.`, `Conseil Career Center et accompagnement de vos indicateurs Qualiopi.`] },
      actif: { s: `${prenom}, votre plan d'action « nouvel élan » en 5 étapes`, t: `Donnons un nouvel élan à votre carrière 🚀`, p: [`Posez le bilan : ce qui vous nourrit, ce qui vous épuise.`, `Cartographiez vos compétences transférables — vous en avez plus que vous ne le croyez.`, `Construisez votre récit : pourquoi ce cap, pourquoi maintenant, pourquoi vous.`, `Alignez LinkedIn : titre, accroche, preuves chiffrées.`, `Activez le réseau : 10 échanges avec des gens qui font le métier visé, avant toute candidature.`] },
      sens: { s: `${prenom}, remettre du sens dans son parcours — par où commencer`, t: `Le parcours Ikigaï, ma méthode signature 🌱`, p: [`Ce qui vous fait vibrer : vos sources de motivation, vos valeurs, ce qui vous met en énergie.`, `Vos talents : vos forces, vos compétences clés, votre singularité professionnelle.`, `Votre impact : ce que vous apportez aux autres, et où vous vous épanouissez.`, `Du potentiel au projet : des pistes concrètes et réalistes, au regard du marché.`, `Votre Ikigaï et votre plan d'action, formalisé en feuille de route.`] },
      etudiant: { s: `${prenom}, vos premiers réflexes pour décrocher votre alternance`, t: `Cap sur votre alternance ou votre premier emploi 🎓`, p: [`Clarifiez votre cible : un métier + un secteur + une zone. « Ouvert à tout » = invisible pour tout le monde.`, `Reconstruisez votre CV sur une page, orienté résultats : chaque expérience = 1 action + 1 chiffre.`, `Alignez LinkedIn : photo pro, titre avec le métier visé, accroche qui raconte votre projet.`, `Ciblez 20 entreprises et contactez 5 personnes par semaine — le marché caché embauche plus que les annonces.`, `Préparez 3 histoires STAR : elles répondent à 80 % des questions d'entretien.`] }
    };
    const plan = PLANS[profil] || PLANS.actif;
    e1s = plan.s;
    e1h = wrap(`Votre plan d'action par Aurélia — et la première étape à faire dès aujourd'hui.`, `
<p>${esc(prenom)},</p>
<p><strong>${plan.t}</strong></p>
<p>Comme promis, voici l'essentiel. ${b2b ? `Des formats concrets, éprouvés dans plus de 10 établissements.` : `Les 5 étapes que je ferais à votre place, dans cet ordre.`}</p>
${liste(plan.p.map((x, i) => (i + 1) + '. ' + x), '#EFF6F8', '')}
<p>${b2b ? `Chaque intervention est construite sur mesure et chiffrée sur devis. Le plus simple pour en parler : 30 minutes de visio, sans engagement.` : `L'étape 1 se fait dès aujourd'hui. Et si vous voulez gagner des semaines sur les suivantes, parlons-en de vive voix — c'est offert.`}</p>
${BTN(RDV, b2b ? 'Réserver un rendez-vous stratégique' : 'Réserver mon échange offert (30 min)')}
<p>À très vite,<br><strong>Aurélia</strong></p>`);
  }

  // ===== EMAIL 2 (J+2) — l'histoire =====
  const e2s = b2b ? `Pourquoi je travaille à trois niveaux, pas seulement avec les apprenants` : `${prenom}, pourquoi j'ai changé de côté de la table`;
  const e2h = b2b ? wrap(`L'employabilité ne se joue pas qu'en atelier — elle se joue à trois.`, `
<p>${esc(prenom)},</p>
<p>Une conviction, forgée sur le terrain : <strong>l'employabilité se mesure au nombre de contrats signés à temps, et surtout à ceux qui vont à leur terme.</strong></p>
<p>Or un contrat qui s'arrête en cours de route, ce n'est presque jamais la faute de l'apprenant seul. C'est un maillon qui a lâché quelque part : un projet pro flou au départ, un maître d'apprentissage qui n'a pas été outillé pour accueillir, ou un suivi qui s'est arrêté après la signature.</p>
<p>C'est pour ça que je travaille à trois niveaux à la fois : <strong>l'apprenant</strong>, <strong>le maître d'apprentissage</strong> et <strong>l'école</strong> qui les met en relation. C'est ce qui change vos indicateurs — taux de placement, taux d'abandon, et les résultats attendus par Qualiopi.</p>
<p>Mon parcours : sept ans en cabinet de recrutement, quatre ans en Career Center de Grande École, puis le conseil auprès des établissements. <strong>Plus de 5000 apprenants accompagnés et 1000 entretiens tripartites menés</strong> à ce jour.</p>
<p>À très vite,<br><strong>Aurélia</strong></p>`) : wrap(`17 ans à regarder des parcours — et ce que ça m'a appris.`, `
<p>${esc(prenom)},</p>
<p>Pendant sept ans, en cabinet de recrutement, j'ai trié des centaines de candidatures et mené plus de 1000 entretiens. France, puis international.</p>
<p>Et un truc me dérangeait de plus en plus : <strong>des gens brillants passaient à la trappe</strong> — pas par manque de talent, mais parce que personne ne leur avait montré comment le rendre visible. Un CV qui raconte des tâches au lieu de résultats. Un entretien où l'on récite au lieu de raconter.</p>
<p>C'est pour ça que je suis passée de l'autre côté de la table. Depuis, ce sont <strong>plus de 5000 personnes</strong> accompagnées — étudiants, jeunes professionnels, salariés, managers — et mon ADN n'a pas changé : l'œil de la recruteuse, la méthode d'une pédagogue.</p>
<p>Un conseil à appliquer dès aujourd'hui : reprenez la première ligne de votre CV ou de votre profil LinkedIn, et posez-vous une seule question — <em>« est-ce qu'un recruteur pressé comprend en 6 secondes ce que je peux lui apporter ? »</em>. Si la réponse est non, vous savez quoi retravailler.</p>
<p>À très vite,<br><strong>Aurélia</strong></p>`);

  // ===== EMAIL 3 (J+5) — preuve sociale =====
  const e3s = b2b ? `Ce que ça change concrètement, côté école` : `${prenom}, « est-ce que le coaching, ça marche vraiment ? »`;
  const e3h = b2b ? wrap(`E-portfolio, MOOCs, livrets tuteur : ce que ça donne en vrai.`, `
<p>${esc(prenom)},</p>
<p>Plutôt qu'un discours, quelques réalisations menées avec des établissements :</p>
${liste([`Un e-portfolio où l'étudiant analyse et formule lui-même ses compétences — développé dans le cadre d'un appel à projets financé par le ministère de l'Enseignement Supérieur.`, `Deux MOOCs enregistrés en studio, avec QCM et exercices : « Décrochez votre alternance » et « Décrochez un emploi dans le No-Code ».`, `Des livrets alternant et tuteur entreprise, pour sécuriser le parcours des deux côtés.`, `Des podcasts sur les enjeux emploi, du script à l'enregistrement.`, `Des bootcamps d'été et un accompagnement des rentrées décalées.`], '#EFF6F8', '▫️')}
<p>Ces formats ne sortent pas d'un catalogue : ils sont conçus à partir de vos besoins réels, de votre calendrier et de vos indicateurs.</p>
<p>Si vous avez une échéance en vue — une rentrée, un audit Qualiopi, une promo dont le taux de placement inquiète — c'est le bon moment pour en parler.</p>
${BTN(RDV, 'Réserver un rendez-vous stratégique')}
<p>À très vite,<br><strong>Aurélia</strong></p>`) : wrap(`La question que tout le monde se pose — et deux réponses honnêtes.`, `
<p>${esc(prenom)},</p>
<p>C'est LA question qu'on me pose — et elle est légitime. Alors plutôt que d'y répondre moi-même, je laisse la parole :</p>
<p style="background:#F6F4F0;border-left:4px solid #0097B2;border-radius:0 12px 12px 0;padding:14px 18px;font-style:italic">« Grâce à ses conseils en personal branding et en recrutement, j'ai gagné en clarté et en confiance. »<br><span style="font-style:normal;font-size:13px;color:#004956">— Mallory, directrice générale</span></p>
<p style="background:#F6F4F0;border-left:4px solid #0097B2;border-radius:0 12px 12px 0;padding:14px 18px;font-style:italic">« Ses compétences de coaching et son réseau de qualité vous apporteront des résultats tangibles et significatifs. »<br><span style="font-style:normal;font-size:13px;color:#004956">— Jean, assistant manager Digital &amp; IA</span></p>
<p>Et pour être honnête sur les deux objections que j'entends le plus :</p>
<p><strong>« Je n'ai pas le temps. »</strong> C'est justement le point : chercher ou évoluer sans méthode, c'est des mois d'efforts dans le vide. La méthode fait gagner le temps qu'elle coûte, plusieurs fois.</p>
<p><strong>« Je ne sais pas encore ce que je veux. »</strong> C'est un très bon point de départ, pas un obstacle. On en discute lors du premier échange, et on regarde ensemble quel accompagnement vous correspond.</p>
<p>Le plus simple pour savoir si ça peut marcher <em>pour vous</em> : 30 minutes de vive voix. Offertes, sans engagement — et vous repartez avec des conseils, quoi qu'il arrive.</p>
${BTN(RDV, 'Réserver mon échange offert')}
<p>À très vite,<br><strong>Aurélia</strong></p>`);

  // ===== EMAIL 4 (J+9) — invitation finale =====
  const e4s = b2b ? `${prenom}, on en parle 30 minutes ?` : `${prenom}, on s'y met ?`;
  const e4h = b2b ? wrap(`30 minutes pour poser vos enjeux employabilité.`, `
<p>${esc(prenom)},</p>
<p>Dernier message de ma part (promis — pas de relance automatique à l'infini, je détestais ça côté recrutement aussi).</p>
<p>Si l'employabilité de vos apprenants est un sujet cette année, voici comment on démarre :</p>
<p style="background:#EFF6F8;border-radius:14px;padding:16px 20px"><strong>1. Un rendez-vous stratégique — offert.</strong> 30 minutes pour poser vos enjeux : taux de placement, rentrées décalées, indicateurs Qualiopi, fidélisation de vos entreprises partenaires.</p>
<p style="background:#EFF6F8;border-radius:14px;padding:16px 20px"><strong>2. Une proposition sur mesure.</strong> Format, durée, volume et devis adaptés à votre calendrier — de l'atelier ponctuel au cycle annuel.</p>
<p style="background:#EFF6F8;border-radius:14px;padding:16px 20px"><strong>3. On déroule.</strong> Et je reste présente à chaque étape, jusqu'au bilan.</p>
${BTN(RDV, 'Réserver mes 30 minutes')}
<p>Et si ce n'est pas le moment, aucun souci — gardez mes messages sous le coude, et revenez quand ce sera le vôtre.</p>
<p>Bonne route,<br><strong>Aurélia</strong></p>`) : wrap(`30 minutes offertes pour poser votre situation — et repartir avec un plan.`, `
<p>${esc(prenom)},</p>
<p>Dernier message de ma part (promis — pas de harcèlement, je détestais ça côté recrutement aussi 😄).</p>
<p>Si votre projet mérite mieux que le statu quo, voici comment on démarre :</p>
<p style="background:#EFF6F8;border-radius:14px;padding:16px 20px"><strong>1. L'échange découverte — offert.</strong> 30 minutes en visio ou autour d'un café : votre situation, vos blocages, et déjà des premiers conseils.</p>
<p style="background:#EFF6F8;border-radius:14px;padding:16px 20px"><strong>2. Un accompagnement pensé pour vous.</strong> Personal branding, stratégie de carrière, préparation d'entretien, transition — ou le parcours Ikigaï si c'est de sens qu'il s'agit. Chiffré sur devis personnalisé, après notre échange.</p>
<p style="background:#EFF6F8;border-radius:14px;padding:16px 20px"><strong>3. Un plan d'action concret.</strong> Clair, réaliste, et suivi jusqu'au bout.</p>
${BTN(RDV, 'Je réserve mes 30 minutes offertes')}
<p>Et si ce n'est pas le moment, aucun souci — gardez mes messages précédents sous le coude, et revenez quand ce sera le vôtre.</p>
<p>Bonne route,<br><strong>Aurélia</strong></p>`);

  return { email, prenom, source, profil, doc, orga, b2b, e1s, e1h, e2s, e2h, e3s, e3h, e4s, e4h };
}

// ---------------------------------------------------------------------------
// Notification interne : le récapitulatif qu'Aurélia reçoit à chaque lead.
// Vit ici, avec les autres contenus d'e-mails, plutôt que dans le gestionnaire
// de requête : c'est de la rédaction, et c'est ainsi testable sans rien envoyer.
// ---------------------------------------------------------------------------
// Libellés de l'objet de l'e-mail (« Nouveau lead … »).
const LIBELLES = {
  outil: "de l'outil « L'œil »",
  quiz: 'du quiz',
  cv: '— CV importé',
  doc: '— demande de documentation'
};

// Les mêmes valeurs, lisibles telles quelles dans le tableau récapitulatif :
// « — demande de documentation » ou « ecoles » n'y voulaient rien dire.
const ORIGINES = {
  outil: "Outil « L'œil de la recruteuse »",
  quiz: "Quiz d'orientation",
  cv: 'Import de CV',
  doc: 'Demande de documentation'
};
const DOCS = {
  ecoles: 'Plaquette écoles supérieures',
  carriere: 'Documentation accompagnement carrière',
  blog: 'Alerte nouveaux articles'
};
const PROFILS = {
  ecole: 'Représente une école',
  actif: 'En poste, cherche un nouvel élan',
  sens: 'En quête de sens',
  etudiant: 'Étudiant ou jeune diplômé'
};

// Récapitulatif envoyé à Aurélia : ce qu'elle doit savoir pour rappeler la
// personne, y compris ce que la séquence automatique va lui écrire ensuite.
function notificationLead(b, e) {
  const ligne = (l, v) => v
    ? `<tr><td style="padding:7px 16px 7px 0;color:#8A8F91;font-size:13px;white-space:nowrap;vertical-align:top">${l}</td><td style="padding:7px 0;font-size:14.5px;color:#231F20"><strong>${esc(v)}</strong></td></tr>`
    : '';
  const bloc = (titre, arr, fond, bordure) => (arr && arr.length)
    ? `<p style="margin:22px 0 8px;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#8A8F91">${titre}</p>` +
      ENCART(arr.map((x, i) => `<span style="display:block;margin-top:${i ? '8px' : '0'}">• ${esc(x)}</span>`).join(''), fond, bordure)
    : '';

  // Le score mérite d'être vu immédiatement : c'est ce qui oriente la relance.
  const score = b.score != null
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px"><tr><td style="background:#E2F1F5;border-radius:14px;padding:14px 24px;text-align:center">
        <span style="font-size:32px;font-weight:bold;color:${CYAN};line-height:1">${esc(b.score)}<span style="font-size:16px;color:#004956">/100</span></span>
        ${b.verdict ? `<br><span style="font-size:13px;color:#004956">${esc(b.verdict)}</span>` : ''}
      </td></tr></table>`
    : '';

  return `${BANDEAU_TEST}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px">
    <tr><td style="background:${e.b2b ? '#EFF6F8' : '#FDF6E9'};border-radius:12px;padding:14px 18px;font-size:15.5px;color:#3A3B3C">
      <strong>${e.b2b ? '🏫 Lead école (B2B)' : '💼 Lead particulier'}</strong>
    </td></tr>
  </table>
  ${score}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    ${ligne('Prénom', e.prenom)}
    ${ligne('E-mail', e.email)}
    ${ligne('Origine', ORIGINES[e.source] || e.source)}
    ${ligne('Profil', PROFILS[e.profil] || e.profil)}
    ${ligne('Document', DOCS[e.doc] || e.doc)}
    ${ligne('Établissement', e.orga)}
    ${ligne('Page', b.page)}
  </table>
  ${bloc('Points forts relevés', b.forces, '#EFF6F8', CYAN)}
  ${bloc('Alertes relevées', b.alertes, '#FBEEE9', '#C4643F')}
  ${BTN_INTERNE('mailto:' + esc(e.email), 'Écrire à ' + esc(e.prenom))}
  <p style="margin:22px 0 0;padding-top:16px;border-top:1px solid #E9E7E2;font-size:12.5px;line-height:1.6;color:#8A8F91;text-align:center">
    ${e.prenom} vient de recevoir son e-mail, et recevra automatiquement trois relances à J+2, J+5 et J+9.
  </p>`;
}

module.exports = {
  construireEmails, CONTACT, SITE,
  NOTIF, NOTIF_DETOURNEE, BANDEAU_TEST,
  wrapInterne, BTN_INTERNE, ENCART, esc, CYAN, PETROLE,
  wrap, BTN, RDV,
  notificationLead, LIBELLES
};
