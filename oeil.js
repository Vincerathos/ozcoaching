// OZ Coaching — L'œil de la recruteuse : moteur d'analyse (100 % client, aucun envoi réseau sauf rapport email)
(() => {
  const WEBHOOK = 'https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead';

  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const VAGUES = ['dynamique','motive','motivee','rigoureux','rigoureuse','serieux','serieuse','polyvalent','polyvalente','passionne','passionnee','curieux','curieuse','autonome','proactif','proactive','force de proposition','esprit d\'equipe','gout du challenge','bon relationnel','implique','impliquee','volontaire','perseverant','perseverante','travailleur','travailleuse','determine','determinee'];
  const ACTIONS = ['pilote','developpe','cree','manage','augmente','reduit','lance','concu','anime','forme','negocie','gere','accompagne','optimise','recrute','deploye','structure','construit','obtenu','decroche','encadre','coordonne','realise','livre','ameliore','transforme','fonde','double','triple','signe','vendu','converti','fidelise','automatise','organise'];
  const AIDE = ["j'aide", "j'accompagne", 'je forme', 'je permets', 'mon objectif', 'ma mission'];

  function analyser(texte, mode) {
    const t = norm(texte);
    const forces = [], alertes = [], conseils = [];
    let score = 50;
    const mots = t.split(/\s+/).filter(Boolean);

    // Chiffres & résultats
    const chiffres = (texte.match(/\d+ ?(%|€|k€|ans|clients?|projets?|personnes?|collaborateurs?|recrutements?|sites?)?/g) || []).filter(m => /\d/.test(m));
    if (chiffres.length >= 2) { score += 14; forces.push("Vous chiffrez : " + chiffres.slice(0,3).join(', ') + "… Les chiffres arrêtent l'œil du recruteur — c'est exactement ce qu'il faut."); }
    else if (chiffres.length === 1) { score += 7; forces.push("Un chiffre (" + chiffres[0].trim() + ") — bien. Un deuxième résultat mesurable doublerait l'impact."); }
    else { score -= 12; alertes.push("Aucun chiffre. Sans résultat mesurable (%, €, années, volumes), votre texte affirme sans prouver — et l'œil glisse."); }

    // Mots creux
    const creux = VAGUES.filter(v => t.includes(v));
    if (creux.length === 0) { score += 8; forces.push("Zéro adjectif bateau (« dynamique », « motivé »…). Rare, et très bon signe : vous montrez au lieu de déclarer."); }
    else if (creux.length <= 2) { score -= 6; alertes.push("Mots creux détectés : « " + creux.join(' », « ') + " ». Tout le monde les écrit, personne ne les lit. Remplacez-les par un fait."); }
    else { score -= 14; alertes.push(creux.length + " mots creux (« " + creux.slice(0,3).join(' », « ') + " »…). Ce vocabulaire est celui de 90 % des candidatures que je triais — il vous rend invisible."); }

    // Verbes d'action
    const verbes = ACTIONS.filter(v => new RegExp('\\b' + v + 'e?s?\\b').test(t));
    if (verbes.length >= 2) { score += 10; forces.push("Des verbes d'action (" + verbes.slice(0,3).join(', ') + "…) : on visualise ce que vous avez fait, pas ce que vous « êtes »."); }
    else if (verbes.length === 0 && mode === 'accroche') { score -= 8; alertes.push("Pas de verbe d'action. « Piloté, développé, réduit, lancé »… c'est le squelette d'une accroche qui embarque."); }

    // MAJUSCULES criardes
    const capsWords = (texte.match(/\b[A-ZÀ-Ü]{4,}\b/g) || []).filter(w => !['HTML','CDI','CDD','SIRE'].includes(w));
    if (capsWords.length > 2) { score -= 6; alertes.push("Beaucoup de MAJUSCULES (" + capsWords.slice(0,3).join(', ') + "…). À l'écran, ça crie — et crier n'a jamais convaincu un recruteur."); }

    // Emojis
    const emojis = (texte.match(/\p{Extended_Pictographic}/gu) || []).length;
    if (emojis > 4) { score -= 5; conseils.push(emojis + " emojis, c'est un feu d'artifice. 1 ou 2 maximum : l'emoji souligne, il ne remplace pas le fond."); }

    if (mode === 'titre') {
      // Longueur idéale titre : 40–120
      if (texte.length < 25) { score -= 12; alertes.push("Titre trop court (" + texte.length + " caractères). Un intitulé de poste seul ne dit ni pour qui, ni avec quel résultat. Visez 40 à 120 caractères."); }
      else if (texte.length <= 130) { score += 8; forces.push("Bonne longueur (" + texte.length + " caractères) : assez pour dire votre valeur, assez court pour être lu en entier dans les résultats de recherche."); }
      else { score -= 6; conseils.push("Un peu long (" + texte.length + " caractères) : LinkedIn coupe le titre dans les résultats de recherche. L'essentiel doit tenir dans les ~65 premiers caractères."); }

      // Structure en segments
      const segs = texte.split(/\s*[|·•–—]\s*/).filter(s => s.trim().length > 2);
      if (segs.length >= 2 && segs.length <= 4) { score += 8; forces.push("Structure claire en " + segs.length + " segments : métier + valeur + preuve, c'est la grammaire des bons titres."); }
      else if (segs.length === 1 && texte.length > 50) { conseils.push("Tout est dans une seule phrase. Découpez avec des « | » : Métier | Ce que vous apportez | Une preuve chiffrée."); }

      // Proposition de valeur
      if (AIDE.some(a => t.includes(a))) { score += 8; forces.push("Vous parlez du bénéfice pour l'autre (« j'aide… », « j'accompagne… ») : c'est ce qui différencie un titre d'une étiquette."); }
      else { conseils.push("Astuce de recruteuse : ajoutez qui vous aidez et à quoi. « J'aide [cible] à [résultat] » transforme un intitulé en promesse."); }

      // Recherche active
      if (/(recherche active|a l'ecoute|en recherche|open to work|disponible immediatement)/.test(t)) { score -= 10; alertes.push("« En recherche » dans le titre : vous annoncez un besoin, pas une valeur. Le badge LinkedIn suffit — le titre, lui, doit vendre."); }

      // Etudiant seul
      if (/\betudiant/.test(t) && !AIDE.some(a => t.includes(a)) && chiffres.length === 0) { conseils.push("« Étudiant·e » n'est pas un métier : précisez le métier visé. « Futur·e chef de projet — en recherche d'alternance marketing » change tout."); }
    } else {
      // Accroche
      if (texte.length < 200) { score -= 10; alertes.push("Accroche courte (" + texte.length + " caractères). En dessous de ~200, on n'a ni contexte, ni preuve, ni envie. Visez 400 à 1500 caractères."); }
      else if (texte.length <= 1800) { score += 8; forces.push("Bonne densité (" + texte.length + " caractères) : assez de matière pour raconter, sans noyer le lecteur."); }
      else { conseils.push("Long (" + texte.length + " caractères) : au-delà de ~1800, seuls les 3 premières lignes seront lues. Mettez le meilleur en haut."); }

      // Phrases interminables
      const phrases = texte.split(/[.!?\n]+/).map(p => p.trim()).filter(p => p.split(/\s+/).length > 3);
      const longues = phrases.filter(p => p.split(/\s+/).length > 32);
      if (longues.length > 0) { score -= 6; alertes.push(longues.length + " phrase(s) de plus de 32 mots. Une accroche se lit sur téléphone entre deux stations de métro : phrases courtes, une idée par phrase."); }
      else if (phrases.length > 2) { score += 5; forces.push("Phrases courtes et rythmées : ça se lit tout seul, et sur mobile c'est décisif."); }

      // Je équilibré
      const jeCount = (t.match(/\bje\b|\bj'/g) || []).length;
      if (jeCount === 0 && texte.length > 250) { conseils.push("Aucun « je » : l'accroche gagne à être incarnée. C'est votre histoire, assumez la première personne."); }
      else if (jeCount > 12) { conseils.push(jeCount + " « je » — pensez à retourner la caméra : que gagne l'entreprise ou le client à travailler avec vous ?"); }

      // CTA final
      if (/(contact|echangeons|parlons|discutons|ecrivez|appelez|rencontrons)/.test(t)) { score += 6; forces.push("Vous terminez par une invitation au contact : la porte est ouverte, le recruteur n'a plus qu'à entrer."); }
      else { conseils.push("Pas d'appel à l'action final. Une dernière ligne « Parlons-en : [mail] » multiplie les prises de contact."); }
    }

    score = Math.max(8, Math.min(96, score));

    let verdict;
    if (score >= 80) verdict = { t: "L'œil approuve 👁️✨", d: "Franchement ? Si ce texte passait sur mon écran en cabinet, je m'arrêtais. Il reste " + (alertes.length + conseils.length) + " détail(s) à polir ci-dessous — et vous jouez dans la cour des profils qu'on appelle." };
    else if (score >= 60) verdict = { t: "Bonne base — l'œil s'attarde, mais ne s'arrête pas encore", d: "Le fond est là. Ce qui manque, ce sont les preuves qui transforment « intéressant » en « je le/la contacte ». Les corrections ci-dessous sont à votre portée dès aujourd'hui." };
    else if (score >= 40) verdict = { t: "Peut (beaucoup) mieux faire", d: "En l'état, votre texte ressemble à des centaines d'autres que j'ai triés — et le tri, c'est 6 secondes par profil. La bonne nouvelle : les alertes ci-dessous sont précises, corrigez-les une par une." };
    else verdict = { t: "Alerte rouge de la recruteuse 🚨", d: "Sans détour, parce que c'est comme ça que je vous suis utile : ce texte ne passe pas le tri. Rien d'irrécupérable — mais il faut le reconstruire, pas le retoucher. Commencez par les alertes ci-dessous." };

    return { score, forces, alertes, conseils, verdict };
  }

  // ---- UI ----
  document.addEventListener('DOMContentLoaded', () => {
    const box = document.getElementById('oeil-box');
    if (!box) return;
    const txt = document.getElementById('oeil-txt');
    const count = document.getElementById('oeil-count');
    const res = document.getElementById('oeil-res');
    let mode = 'titre', lastAnalyse = null;

    document.querySelectorAll('.mode-switch button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.mode-switch button').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-selected', 'true');
      mode = b.dataset.mode;
      txt.placeholder = mode === 'titre'
        ? 'Ex. « Chef de projet digital | J\'aide les PME à doubler leur visibilité en ligne | 40+ sites livrés »'
        : 'Collez ici votre section « À propos » LinkedIn ou l\'accroche en haut de votre CV…';
    }));

    txt.addEventListener('input', () => { count.textContent = txt.value.length.toLocaleString('fr-FR') + ' caractère' + (txt.value.length > 1 ? 's' : ''); });

    const rendre = (liste, el, type, icone) => {
      el.innerHTML = '';
      if (!liste.length) {
        const d = document.createElement('div');
        d.className = 'finding f-' + type;
        d.innerHTML = '<span class="fi">' + icone + '</span><span>' + (type === 'alerte' ? 'Rien à signaler — et venant d\'une recruteuse, c\'est un compliment.' : 'Pas encore — mais les corrections ci-contre vont vite changer ça.') + '</span>';
        el.appendChild(d);
        return;
      }
      liste.forEach(f => {
        const d = document.createElement('div');
        d.className = 'finding f-' + type;
        const s = document.createElement('span'); s.className = 'fi'; s.textContent = icone;
        const p = document.createElement('span'); p.textContent = f;
        d.append(s, p);
        el.appendChild(d);
      });
    };

    document.getElementById('oeil-go').addEventListener('click', () => {
      const v = txt.value.trim();
      if (v.length < 10) { txt.focus(); txt.style.borderColor = '#C0392B'; setTimeout(() => txt.style.borderColor = '', 1200); return; }
      box.classList.add('scanning');
      setTimeout(() => {
        box.classList.remove('scanning');
        const a = lastAnalyse = analyser(v, mode);
        res.hidden = false;
        rendre(a.forces, document.getElementById('list-forces'), 'force', '✓');
        rendre(a.alertes, document.getElementById('list-alertes'), 'alerte', '!');
        const cb = document.getElementById('conseils-bloc');
        cb.style.display = a.conseils.length ? '' : 'none';
        rendre(a.conseils, document.getElementById('list-conseils'), 'conseil', '💡');
        document.getElementById('verdict-t').textContent = a.verdict.t;
        document.getElementById('verdict-d').textContent = a.verdict.d;
        // Jauge
        const arc = document.getElementById('gauge-arc');
        arc.style.stroke = a.score >= 60 ? 'var(--ocean)' : a.score >= 40 ? 'var(--sun)' : '#C0392B';
        requestAnimationFrame(() => { arc.style.strokeDashoffset = 515 - 515 * a.score / 100; });
        const val = document.getElementById('gauge-val');
        const t0 = performance.now();
        const tick = now => { const p = Math.min((now - t0) / 1200, 1); val.textContent = Math.round(a.score * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
        setTimeout(() => { val.textContent = a.score; }, 1400); // filet si rAF est suspendu (onglet en arrière-plan)
        res.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1500);
    });

    // Envoi du rapport
    document.getElementById('oeil-form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const f = ev.target;
      if (f.website.value) return; // honeypot
      const btn = f.querySelector('button');
      btn.disabled = true; btn.textContent = 'Envoi en cours…';
      try {
        await fetch(WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'outil',
            prenom: f.prenom.value.trim(),
            email: f.email.value.trim(),
            mode, texte: txt.value.trim(),
            score: lastAnalyse?.score, verdict: lastAnalyse?.verdict.t,
            forces: lastAnalyse?.forces, alertes: lastAnalyse?.alertes, conseils: lastAnalyse?.conseils,
            page: location.href
          })
        });
        f.hidden = true;
        document.getElementById('oeil-sent').hidden = false;
      } catch {
        btn.disabled = false; btn.textContent = 'Réessayer l\'envoi';
      }
    });
  });
})();
