// OZ Coaching — L'œil de la recruteuse
// Deux parcours : (A) analyse de texte 100 % côté navigateur ; (B) upload CV PDF.
(() => {
  const WEBHOOK = 'https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead';

  // ↓↓↓ SEAM CLAUDE — pour brancher l'analyse IA du CV, colle ici l'URL de l'endpoint.
  // Il reçoit { texte, cible } et doit renvoyer { score, verdict:{t,d}, forces:[], alertes:[], conseils:[] }.
  // Tant que c'est vide, la voie PDF capture le CV et déclenche un audit humain via n8n.
  const CV_ANALYZE_ENDPOINT = '';

  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const VAGUES = ['dynamique','motive','motivee','rigoureux','rigoureuse','serieux','serieuse','polyvalent','polyvalente','passionne','passionnee','curieux','curieuse','autonome','proactif','proactive','force de proposition','esprit d\'equipe','gout du challenge','bon relationnel','implique','impliquee','volontaire','perseverant','perseverante','travailleur','travailleuse','determine','determinee'];
  const ACTIONS = ['pilote','developpe','cree','manage','augmente','reduit','lance','concu','anime','forme','negocie','gere','accompagne','optimise','recrute','deploye','structure','construit','obtenu','decroche','encadre','coordonne','realise','livre','ameliore','transforme','fonde','double','triple','signe','vendu','converti','fidelise','automatise','organise'];
  const AIDE = ["j'aide", "j'accompagne", 'je forme', 'je permets', 'mon objectif', 'ma mission'];

  function analyser(texte, mode) {
    const t = norm(texte);
    const forces = [], alertes = [], conseils = [];
    let score = 50;

    const chiffres = (texte.match(/\d+ ?(%|€|k€|ans|clients?|projets?|personnes?|collaborateurs?|recrutements?|sites?)?/g) || []).filter(m => /\d/.test(m));
    if (chiffres.length >= 2) { score += 14; forces.push("Vous chiffrez : " + chiffres.slice(0,3).join(', ') + "… Les chiffres arrêtent l'œil du recruteur — c'est exactement ce qu'il faut."); }
    else if (chiffres.length === 1) { score += 7; forces.push("Un chiffre (" + chiffres[0].trim() + ") — bien. Un deuxième résultat mesurable doublerait l'impact."); }
    else { score -= 12; alertes.push("Aucun chiffre. Sans résultat mesurable (%, €, années, volumes), votre texte affirme sans prouver — et l'œil glisse."); }

    const creux = VAGUES.filter(v => t.includes(v));
    if (creux.length === 0) { score += 8; forces.push("Zéro adjectif bateau (« dynamique », « motivé »…). Rare, et très bon signe : vous montrez au lieu de déclarer."); }
    else if (creux.length <= 2) { score -= 6; alertes.push("Mots creux détectés : « " + creux.join(' », « ') + " ». Tout le monde les écrit, personne ne les lit. Remplacez-les par un fait."); }
    else { score -= 14; alertes.push(creux.length + " mots creux (« " + creux.slice(0,3).join(' », « ') + " »…). Ce vocabulaire est celui de 90 % des candidatures que je triais — il vous rend invisible."); }

    const verbes = ACTIONS.filter(v => new RegExp('\\b' + v + 'e?s?\\b').test(t));
    if (verbes.length >= 2) { score += 10; forces.push("Des verbes d'action (" + verbes.slice(0,3).join(', ') + "…) : on visualise ce que vous avez fait, pas ce que vous « êtes »."); }
    else if (verbes.length === 0 && mode === 'accroche') { score -= 8; alertes.push("Pas de verbe d'action. « Piloté, développé, réduit, lancé »… c'est le squelette d'une accroche qui embarque."); }

    const capsWords = (texte.match(/\b[A-ZÀ-Ü]{4,}\b/g) || []).filter(w => !['HTML','CDI','CDD','SIRE'].includes(w));
    if (capsWords.length > 2) { score -= 6; alertes.push("Beaucoup de MAJUSCULES (" + capsWords.slice(0,3).join(', ') + "…). À l'écran, ça crie — et crier n'a jamais convaincu un recruteur."); }

    const emojis = (texte.match(/\p{Extended_Pictographic}/gu) || []).length;
    if (emojis > 4) { score -= 5; conseils.push(emojis + " emojis, c'est un feu d'artifice. 1 ou 2 maximum : l'emoji souligne, il ne remplace pas le fond."); }

    if (mode === 'titre') {
      if (texte.length < 25) { score -= 12; alertes.push("Titre trop court (" + texte.length + " caractères). Un intitulé de poste seul ne dit ni pour qui, ni avec quel résultat. Visez 40 à 120 caractères."); }
      else if (texte.length <= 130) { score += 8; forces.push("Bonne longueur (" + texte.length + " caractères) : assez pour dire votre valeur, assez court pour être lu en entier dans les résultats de recherche."); }
      else { score -= 6; conseils.push("Un peu long (" + texte.length + " caractères) : LinkedIn coupe le titre dans les résultats de recherche. L'essentiel doit tenir dans les ~65 premiers caractères."); }

      const segs = texte.split(/\s*[|·•–—]\s*/).filter(s => s.trim().length > 2);
      if (segs.length >= 2 && segs.length <= 4) { score += 8; forces.push("Structure claire en " + segs.length + " segments : métier + valeur + preuve, c'est la grammaire des bons titres."); }
      else if (segs.length === 1 && texte.length > 50) { conseils.push("Tout est dans une seule phrase. Découpez avec des « | » : Métier | Ce que vous apportez | Une preuve chiffrée."); }

      if (AIDE.some(a => t.includes(a))) { score += 8; forces.push("Vous parlez du bénéfice pour l'autre (« j'aide… », « j'accompagne… ») : c'est ce qui différencie un titre d'une étiquette."); }
      else { conseils.push("Astuce de recruteuse : ajoutez qui vous aidez et à quoi. « J'aide [cible] à [résultat] » transforme un intitulé en promesse."); }

      if (/(recherche active|a l'ecoute|en recherche|open to work|disponible immediatement)/.test(t)) { score -= 10; alertes.push("« En recherche » dans le titre : vous annoncez un besoin, pas une valeur. Le badge LinkedIn suffit — le titre, lui, doit vendre."); }

      if (/\betudiant/.test(t) && !AIDE.some(a => t.includes(a)) && chiffres.length === 0) { conseils.push("« Étudiant·e » n'est pas un métier : précisez le métier visé. « Futur·e chef de projet — en recherche d'alternance marketing » change tout."); }
    } else {
      if (texte.length < 200) { score -= 10; alertes.push("Accroche courte (" + texte.length + " caractères). En dessous de ~200, on n'a ni contexte, ni preuve, ni envie. Visez 400 à 1500 caractères."); }
      else if (texte.length <= 1800) { score += 8; forces.push("Bonne densité (" + texte.length + " caractères) : assez de matière pour raconter, sans noyer le lecteur."); }
      else { conseils.push("Long (" + texte.length + " caractères) : au-delà de ~1800, seuls les 3 premières lignes seront lues. Mettez le meilleur en haut."); }

      const phrases = texte.split(/[.!?\n]+/).map(p => p.trim()).filter(p => p.split(/\s+/).length > 3);
      const longues = phrases.filter(p => p.split(/\s+/).length > 32);
      if (longues.length > 0) { score -= 6; alertes.push(longues.length + " phrase(s) de plus de 32 mots. Une accroche se lit sur téléphone entre deux stations de métro : phrases courtes, une idée par phrase."); }
      else if (phrases.length > 2) { score += 5; forces.push("Phrases courtes et rythmées : ça se lit tout seul, et sur mobile c'est décisif."); }

      const jeCount = (t.match(/\bje\b|\bj'/g) || []).length;
      if (jeCount === 0 && texte.length > 250) { conseils.push("Aucun « je » : l'accroche gagne à être incarnée. C'est votre histoire, assumez la première personne."); }
      else if (jeCount > 12) { conseils.push(jeCount + " « je » — pensez à retourner la caméra : que gagne l'entreprise ou le client à travailler avec vous ?"); }

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

  // ---- PDF : chargement paresseux de pdf.js + extraction du texte ----
  let pdfjsPromise = null;
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error('pdfjs-load'));
      document.head.appendChild(s);
    });
    return pdfjsPromise;
  }

  async function extractPdfText(file) {
    const pdfjsLib = await loadPdfJs();
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let txt = '';
    const nPages = Math.min(pdf.numPages, 8);
    for (let i = 1; i <= nPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      txt += content.items.map(it => it.str).join(' ') + '\n';
    }
    return txt.replace(/[ \t]+/g, ' ').trim();
  }

  // Analyse IA du CV (branchée quand CV_ANALYZE_ENDPOINT est renseigné)
  async function analyserCV(texte, cible) {
    if (!CV_ANALYZE_ENDPOINT) return null;
    const r = await fetch(CV_ANALYZE_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texte, cible })
    });
    if (!r.ok) throw new Error('cv-endpoint');
    return await r.json();
  }

  // ---- UI ----
  document.addEventListener('DOMContentLoaded', () => {
    const box = document.getElementById('oeil-box');
    if (!box) return;
    const res = document.getElementById('oeil-res');
    const cvPending = document.getElementById('cv-pending');
    // Contexte partagé : ce qui sera envoyé au webhook selon le parcours
    const ctx = { source: 'outil', mode: 'titre', texte: '', cible: '', analyse: null };

    const escHtml = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
    const statusMsg = (color, txt) => '<span style="color:' + color + '">' + txt + '</span>';

    const rendre = (liste, el, type, icone) => {
      el.innerHTML = '';
      if (!liste || !liste.length) {
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

    function afficherResultat(a) {
      ctx.analyse = a;
      if (cvPending) cvPending.hidden = true;
      res.hidden = false;
      rendre(a.forces, document.getElementById('list-forces'), 'force', '✓');
      rendre(a.alertes, document.getElementById('list-alertes'), 'alerte', '!');
      const cb = document.getElementById('conseils-bloc');
      cb.style.display = (a.conseils && a.conseils.length) ? '' : 'none';
      rendre(a.conseils, document.getElementById('list-conseils'), 'conseil', '💡');
      document.getElementById('verdict-t').textContent = a.verdict.t;
      document.getElementById('verdict-d').textContent = a.verdict.d;
      const arc = document.getElementById('gauge-arc');
      arc.style.stroke = a.score >= 60 ? 'var(--ocean)' : a.score >= 40 ? 'var(--sun)' : '#C0392B';
      requestAnimationFrame(() => { arc.style.strokeDashoffset = 515 - 515 * a.score / 100; });
      const val = document.getElementById('gauge-val');
      val.textContent = a.score; // valeur correcte d'emblée (filet si rAF/timers gelés en arrière-plan)
      const t0 = performance.now();
      const tick = now => { const p = Math.min((now - t0) / 1200, 1); val.textContent = Math.round(a.score * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- Sélecteur de parcours ----
    const pathBtns = document.querySelectorAll('.path-btn');
    const paneEcrire = document.getElementById('path-ecrire');
    const panePdf = document.getElementById('path-pdf');
    pathBtns.forEach(b => b.addEventListener('click', () => {
      pathBtns.forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const p = b.dataset.path;
      paneEcrire.hidden = p !== 'ecrire';
      panePdf.hidden = p !== 'pdf';
      res.hidden = true;
      if (cvPending) cvPending.hidden = true;
    }));

    // ---- Parcours : J'écris ----
    const txt = document.getElementById('oeil-txt');
    const count = document.getElementById('oeil-count');
    let mode = 'titre';

    document.querySelectorAll('.mode-switch button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.mode-switch button').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-selected', 'true');
      mode = b.dataset.mode;
      txt.placeholder = mode === 'titre'
        ? 'Ex. « Chef de projet digital | J\'aide les PME à doubler leur visibilité en ligne | 40+ sites livrés »'
        : 'Collez ici votre section « À propos » LinkedIn ou l\'accroche en haut de votre CV…';
    }));

    txt.addEventListener('input', () => { count.textContent = txt.value.length.toLocaleString('fr-FR') + ' caractère' + (txt.value.length > 1 ? 's' : ''); });

    document.getElementById('oeil-go').addEventListener('click', () => {
      const v = txt.value.trim();
      if (v.length < 10) { txt.focus(); txt.style.borderColor = '#C0392B'; setTimeout(() => txt.style.borderColor = '', 1200); return; }
      box.classList.add('scanning');
      setTimeout(() => {
        box.classList.remove('scanning');
        ctx.source = 'outil'; ctx.mode = mode; ctx.texte = v;
        afficherResultat(analyser(v, mode));
      }, 1500);
    });

    // ---- Parcours : J'importe un PDF ----
    const drop = document.getElementById('cv-drop');
    const fileInput = document.getElementById('cv-file');
    const cvStatus = document.getElementById('cv-status');
    const cvCible = document.getElementById('cv-cible');

    if (drop) {
      drop.addEventListener('click', () => fileInput.click());
      drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('drag'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });
    }

    async function handleFile(file) {
      cvStatus.hidden = false;
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        cvStatus.innerHTML = statusMsg('#C0392B', '⚠️ Ce fichier n\'est pas un PDF. Exportez votre CV en PDF, ou passez par « J\'écris mon texte ».');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        cvStatus.innerHTML = statusMsg('#C0392B', '⚠️ PDF trop lourd (8 Mo maximum).');
        return;
      }
      cvStatus.innerHTML = statusMsg('var(--muted)', '📄 ' + escHtml(file.name) + ' — lecture en cours…');
      box.classList.add('scanning');
      let texte;
      try {
        texte = await extractPdfText(file);
      } catch (e) {
        box.classList.remove('scanning');
        cvStatus.innerHTML = statusMsg('#C0392B', '⚠️ Impossible de lire ce PDF. Réessayez, ou collez votre texte via « J\'écris mon texte ».');
        return;
      }
      box.classList.remove('scanning');
      const words = texte.split(/\s+/).filter(Boolean).length;
      if (texte.length < 120 || words < 40) {
        cvStatus.innerHTML = statusMsg('#8a6420', '⚠️ Je n\'arrive pas à lire le texte de ce PDF (souvent : un CV exporté en image, ou en colonnes qui se mélangent). Deux options : collez votre texte via « J\'écris mon texte », ou réservez directement un <a href="contact.html#rdv" style="color:var(--ocean)">échange offert</a>.');
        return;
      }
      cvStatus.innerHTML = statusMsg('#245E3C', '✓ CV lu — ' + words.toLocaleString('fr-FR') + ' mots détectés.');
      ctx.source = 'cv'; ctx.texte = texte.slice(0, 8000); ctx.cible = cvCible.value.trim(); ctx.analyse = null;

      // Si l'analyse IA est branchée → résultat instantané ; sinon → capture (audit humain).
      try {
        const a = await analyserCV(ctx.texte, ctx.cible);
        if (a) { afficherResultat(a); return; }
      } catch (e) { /* endpoint indisponible → on bascule sur la capture */ }
      res.hidden = true;
      cvPending.hidden = false;
      cvPending.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---- Capture e-mail (les deux formulaires partagent le même contexte) ----
    function buildPayload(f) {
      const a = ctx.analyse;
      const p = {
        source: ctx.source,
        prenom: f.prenom.value.trim(),
        email: f.email.value.trim(),
        texte: ctx.texte,
        score: a ? a.score : undefined,
        verdict: a ? a.verdict.t : undefined,
        forces: a ? a.forces : undefined,
        alertes: a ? a.alertes : undefined,
        conseils: a ? a.conseils : undefined,
        page: location.href
      };
      if (ctx.source === 'cv') p.cible = ctx.cible; else p.mode = ctx.mode;
      return p;
    }

    function wireForm(formId, sentId) {
      const f = document.getElementById(formId);
      if (!f) return;
      f.addEventListener('submit', async ev => {
        ev.preventDefault();
        if (f.website.value) return; // honeypot
        const btn = f.querySelector('button[type=submit]');
        btn.disabled = true; btn.textContent = 'Envoi en cours…';
        try {
          await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(f)) });
          f.hidden = true;
          document.getElementById(sentId).hidden = false;
        } catch {
          btn.disabled = false; btn.textContent = 'Réessayer l\'envoi';
        }
      });
    }
    wireForm('oeil-form', 'oeil-sent');
    wireForm('cv-form', 'cv-sent');
  });
})();
