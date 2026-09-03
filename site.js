// OZ Coaching — interactions communes
// L'URL de capture vient UNIQUEMENT de config.js : aucune valeur de repli en dur.
// Un repli coderait une destination que personne ne controle plus (cf. l'ancienne
// instance n8n) et y enverrait des donnees personnelles a l'insu de tous.
// Si elle est vide, les formulaires basculent sur le contact par e-mail.
const OZ_WEBHOOK = (window.OZ_CONFIG && window.OZ_CONFIG.webhook) || '';

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) burger.addEventListener('click', () => links.classList.toggle('open'));

  // Révélation au défilement
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .14 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // Compteurs animés
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseInt(el.dataset.count, 10);
      const t0 = performance.now(), dur = 1400;
      el.firstChild.nodeValue = target.toLocaleString('fr-FR'); // valeur correcte même si rAF est gelé
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.firstChild.nodeValue = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  // Repli affiché quand aucune destination de capture n'est configurée :
  // mieux vaut orienter vers l'e-mail que faire échouer l'envoi en silence.
  function contactDirect(form) {
    const mail = (window.OZ_CONFIG && window.OZ_CONFIG.emailContact) || '';
    const p = document.createElement('p');
    p.style.cssText = 'margin-top:16px;background:#FDF6E9;border:1.5px solid #E7CE9C;color:#5E4611;' +
      'border-radius:14px;padding:14px 18px;font-size:14.5px;line-height:1.6';
    p.innerHTML = 'Le formulaire est momentanément indisponible. Écrivez directement à ' +
      '<a href="mailto:' + mail + '" style="color:#0097B2;font-weight:500">' + mail + '</a>, ' +
      'Aurélia vous répond en personne.';
    form.hidden = true;
    form.parentNode.insertBefore(p, form.nextSibling);
  }

  // Envoi générique vers le webhook (capture de lead)
  async function envoyerLead(form, payload, sentId) {
    if (form.website && form.website.value) return; // honeypot
    if (!OZ_WEBHOOK) return contactDirect(form);
    const btn = form.querySelector('button[type=submit]');
    const label = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }
    try {
      const r = await fetch(OZ_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ page: location.href }, payload))
      });
      if (!r.ok) throw new Error('envoi');
      form.hidden = true;
      const sent = document.getElementById(sentId);
      if (sent) sent.hidden = false;
    } catch {
      // Deuxième échec : inutile de faire tourner la personne en rond,
      // on lui donne l'adresse directe.
      if (form.dataset.echec) return contactDirect(form);
      form.dataset.echec = '1';
      if (btn) { btn.disabled = false; btn.textContent = 'Réessayer l’envoi'; }
    }
  }

  // Quiz d'orientation (accueil) → résultat personnalisé + capture e-mail
  const quiz = document.getElementById('quiz');
  if (quiz) {
    const panes = quiz.querySelectorAll('.q-pane');
    let profile = null;
    quiz.addEventListener('click', ev => {
      const b = ev.target.closest('[data-q]');
      if (!b) return;
      const [step, val] = b.dataset.q.split(':');
      if (step === '1') profile = val;
      const next = b.dataset.next;
      panes.forEach(p => p.hidden = p.dataset.pane !== next);
      if (next === 'end') {
        const res = {
          ecole: {
            t: 'Boostons l’employabilité de vos apprenants 🏫',
            d: 'Ateliers, MOOCs, bootcamps alternance, suivi tripartite, conseil Career Center et Qualiopi : découvrez les interventions pensées pour les écoles supérieures.',
            o: '💡 Chaque intervention est construite sur mesure, du format court à la journée complète — du Bac au Bac+5, en présentiel, distanciel ou blended.',
            href: 'ecoles.html', cta: 'Découvrez l’accompagnement écoles →',
            form: 'Recevez la plaquette accompagnement écoles :'
          },
          actif: {
            t: 'Donnons un nouvel élan à votre carrière 🚀',
            d: 'Évolution, mobilité interne, repositionnement : on clarifie votre cap, on valorise votre expertise et on construit une stratégie de carrière à votre image.',
            o: '💡 Personal branding, LinkedIn, réseau, entretiens, plan d’action : chaque accompagnement est chiffré sur devis personnalisé, après un premier échange.',
            href: 'carriere.html', cta: 'Découvrez l’accompagnement carrière →',
            form: 'Recevez votre plan d’action en 5 étapes, par e-mail :'
          },
          sens: {
            t: 'Remettons du sens dans votre parcours 🌱',
            d: 'Le parcours Ikigaï, ma méthode signature : cinq séances progressives pour aligner vos aspirations professionnelles avec votre style de vie.',
            o: '💡 De l’exploration de vos motivations jusqu’à un plan d’action formalisé en feuille de route — avec des exercices entre chaque séance.',
            href: 'carriere.html#ikigai', cta: 'Découvrir le parcours Ikigaï →',
            form: 'Recevez la présentation du parcours Ikigaï :'
          },
          etudiant: {
            t: 'Cap sur votre alternance ou votre premier emploi 🎓',
            d: 'J’interviens surtout auprès des écoles, pour leurs apprenants — mais si vous cherchez seul·e, commencez par passer votre CV et votre profil LinkedIn sous l’œil de la recruteuse, c’est gratuit.',
            o: '💡 Vous êtes dans une école partenaire ? Parlez-en à votre Career Center. Sinon, écrivez-moi : on regarde ensemble ce qui est possible.',
            href: 'oeil-recruteuse.html', cta: 'Tester mon profil gratuitement 👁️',
            form: 'Recevez mes conseils candidature par e-mail :'
          }
        }[profile] || {
          t: 'Parlons-en de vive voix',
          d: 'Le plus simple : un échange de 30 minutes, offert et sans engagement.',
          o: '', href: 'contact.html', cta: 'Réserver un échange',
          form: 'Recevez les conseils d’Aurélia par e-mail :'
        };
        quiz.querySelector('#q-title').textContent = res.t;
        quiz.querySelector('#q-desc').textContent = res.d;
        const off = quiz.querySelector('#q-offre');
        if (off) { off.textContent = res.o; off.hidden = !res.o; }
        const a = quiz.querySelector('#q-cta');
        a.textContent = res.cta; a.href = res.href;
        const ft = quiz.querySelector('#q-form-titre');
        if (ft) ft.textContent = res.form;
      }
    });
    const qf = document.getElementById('q-form');
    if (qf) qf.addEventListener('submit', ev => {
      ev.preventDefault();
      envoyerLead(qf, { source: 'quiz', profil: profile, prenom: qf.prenom.value.trim(), email: qf.email.value.trim() }, 'q-sent');
    });
  }

  // Formulaires « documentation » (plaquette écoles, doc carrière, alerte blog)
  // Le PDF part aussi par e-mail, mais on le donne immédiatement : un visiteur qui
  // a rempli le formulaire ne doit pas attendre sa boîte mail pour l'obtenir.
  const PLAQUETTES = {
    ecoles: 'brochures/OZ-Coaching-Ecoles-superieures.pdf',
    carriere: 'brochures/OZ-Coaching-Accompagnement-carriere.pdf'
  };
  const docForm = document.getElementById('doc-form');
  if (docForm) docForm.addEventListener('submit', async ev => {
    ev.preventDefault();
    const doc = docForm.dataset.doc || 'general';
    await envoyerLead(docForm, {
      source: 'doc',
      doc,
      prenom: docForm.prenom.value.trim(),
      email: docForm.email.value.trim(),
      organisation: docForm.organisation ? docForm.organisation.value.trim() : ''
    }, 'doc-sent');
    const pdf = PLAQUETTES[doc];
    if (pdf && docForm.hidden) {           // hidden => l'envoi a réussi
      const a = document.createElement('a');
      a.href = pdf; a.download = pdf.split('/').pop();
      document.body.appendChild(a); a.click(); a.remove();
    }
  });

  // Contact : routage école / particulier
  const routeBtns = document.querySelectorAll('.route-btn');
  if (routeBtns.length) {
    const hidden = document.getElementById('f-profil-hidden');
    const champEcole = document.getElementById('champ-ecole');
    routeBtns.forEach(b => b.addEventListener('click', () => {
      routeBtns.forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const ecole = b.dataset.route === 'ecole';
      if (hidden) hidden.value = ecole ? 'Une école' : 'Un particulier';
      if (champEcole) champEcole.hidden = !ecole;
    }));
  }

  // Formulaires : petit état d'envoi
  document.querySelectorAll('form[data-net]').forEach(f => {
    f.addEventListener('submit', () => {
      const b = f.querySelector('button[type=submit]');
      if (b) { b.textContent = 'Envoi en cours…'; b.disabled = true; }
    });
  });

  // Formulaire de contact → e-mail à Aurélia + accusé de réception au visiteur.
  const contact = document.getElementById('contact-form');
  if (contact) {
    contact.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (contact.website && contact.website.value) return; // honeypot
      const btn = contact.querySelector('button[type=submit]');
      const label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }
      const d = new FormData(contact);
      try {
        const r = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: d.get('nom'), email: d.get('email'), message: d.get('message'),
            profil: d.get('profil'), organisation: d.get('organisation'),
            website: d.get('website')
          })
        });
        if (!r.ok) throw new Error('envoi');
        contact.hidden = true;
        const ok = document.getElementById('contact-sent');
        if (ok) { ok.hidden = false; ok.classList.add('in'); }
      } catch {
        if (contact.dataset.echec) return contactDirect(contact);
        contact.dataset.echec = '1';
        if (btn) { btn.disabled = false; btn.textContent = label; }
      }
    });
  }
});

// Prise de RDV : Google Agenda (creneaux publies par Aurelia). L'URL vient
// de config.js. Si elle est vide, on affiche un repli utile plutot qu'un vide.
window.ozInitAgenda = function () {
  const hote = document.getElementById('oz-agenda');
  if (!hote) return;
  const cfg = window.OZ_CONFIG || {};
  if (!cfg.agenda) {
    hote.innerHTML = '<p style="padding:28px 32px;color:var(--muted)">Le calendrier arrive. En attendant, ecrivez a ' +
      '<a href="mailto:' + (cfg.emailContact || '') + '" style="color:var(--ocean)">' + (cfg.emailContact || '') + '</a>.</p>';
    return;
  }
  const cadre = document.createElement('iframe');
  cadre.src = cfg.agenda + '?gv=true';
  cadre.style.cssText = 'border:0;width:100%;height:660px;display:block';
  cadre.setAttribute('frameborder', '0');
  cadre.title = 'Reserver un echange de 30 minutes avec Aurelia Grino';
  hote.appendChild(cadre);
};
document.addEventListener('DOMContentLoaded', window.ozInitAgenda);
