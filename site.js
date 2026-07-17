// OZ Coaching — interactions communes
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
      const el = e.target, target = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
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

  // Quiz d'orientation (accueil) → résultat personnalisé + capture e-mail
  const quiz = document.getElementById('quiz');
  if (quiz) {
    const WEBHOOK = 'https://n8n.srv1136474.hstgr.cloud/webhook/oz-coaching-lead';
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
          etudiant:  { t: 'Cap sur votre premier emploi 🎓', d: 'Projet pro, candidature, entretiens : l’accompagnement particuliers est fait pour vous — et vos tarifs sont pensés pour les étudiants.', o: '⭐ Recommandé pour vous : le Pack Décollage — CV + LinkedIn + simulation d’entretien, 3 séances, 220 €. Le plus choisi.', href: 'particuliers.html', cta: 'Voir l’accompagnement particuliers', form: 'Votre plan d’action « premier emploi » en 5 étapes, par e-mail :' },
          actif:     { t: 'Donnons un nouvel élan à votre carrière 🚀', d: 'Reconversion, évolution, quête de sens : on clarifie votre cap avec l’Ikigai et l’œil de la recruteuse.', o: '⭐ Recommandé pour vous : Cap sur 3 mois — 8 séances + suivi continu, du projet pro à la signature, 600 € (payable en 3 fois).', href: 'particuliers.html', cta: 'Voir l’accompagnement particuliers', form: 'Votre plan d’action « nouveau cap » en 5 étapes, par e-mail :' },
          ecole:     { t: 'Boostons l’employabilité de vos étudiants 🏫', d: 'Ateliers, MOOCs, podcasts, conseil Career Center : découvrez les interventions pensées pour les écoles.', o: '💡 De l’atelier ponctuel au cycle annuel : chaque intervention est construite sur mesure, sur devis.', href: 'ecoles.html', cta: 'Découvrir l’offre écoles', form: 'Recevez le catalogue des interventions écoles, par e-mail :' },
          entreprise:{ t: 'Révélons le potentiel de vos équipes 💼', d: 'Coaching collaborateurs, conférences RH, marque employeur : des formats concrets pour votre organisation.', o: '💡 Coaching individuel, conférences, ateliers IA & recrutement : formats et devis adaptés à votre organisation.', href: 'entreprises.html', cta: 'Découvrir l’offre entreprises', form: 'Recevez la plaquette entreprises + exemples de missions, par e-mail :' }
        }[profile] || { t: 'Parlons-en de vive voix', d: 'Le plus simple : un échange découverte gratuit de 30 minutes.', o: '', href: 'contact.html', cta: 'Réserver un échange', form: 'Recevez les conseils d’Aurélia par e-mail :' };
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
    if (qf) qf.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (qf.website.value) return; // honeypot anti-spam
      const btn = qf.querySelector('button');
      btn.disabled = true; btn.textContent = 'Envoi en cours…';
      try {
        await fetch(WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: 'quiz', profil: profile, prenom: qf.prenom.value.trim(), email: qf.email.value.trim(), page: location.href })
        });
        qf.hidden = true;
        document.getElementById('q-sent').hidden = false;
      } catch {
        btn.disabled = false; btn.textContent = 'Réessayer l’envoi';
      }
    });
  }

  // Formulaires : petit état d'envoi
  document.querySelectorAll('form[data-net]').forEach(f => {
    f.addEventListener('submit', () => {
      const b = f.querySelector('button[type=submit]');
      if (b) { b.textContent = 'Envoi en cours…'; b.disabled = true; }
    });
  });
});
