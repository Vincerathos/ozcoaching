/* ============================================================
   OZ Coaching v3 — grille + animations (partagé)
   ============================================================ */

/* ---- toggle grille : bouton + touche G ---- */
var btn=document.getElementById('gridToggle');
function setGrid(on){document.body.classList.toggle('grid-on',on);
  if(btn){btn.setAttribute('aria-pressed',on?'true':'false');
    var l=btn.querySelector('.lbl'); if(l) l.textContent=on?'Masquer la grille':'Voir la grille';}}
if(btn) btn.addEventListener('click',function(){setGrid(!document.body.classList.contains('grid-on'));});
document.addEventListener('keydown',function(e){
  if((e.key==='g'||e.key==='G')&&!e.metaKey&&!e.ctrlKey&&!e.altKey){setGrid(!document.body.classList.contains('grid-on'));}});

/* ---- colonnes numérotées dans chaque overlay ---- */
document.querySelectorAll('.guides .cols').forEach(function(h){
  var n=getComputedStyle(document.documentElement).getPropertyValue('--cols').trim()||'12';
  for(var i=1;i<=parseInt(n,10);i++){var c=document.createElement('div');c.className='col';
    var s=document.createElement('span');s.textContent=i;c.appendChild(s);h.appendChild(c);}});

/* ---- reveal au scroll (fade + montée) ---- */
(function(){
  var els=[].slice.call(document.querySelectorAll('.rv'));
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    els.forEach(function(el){el.classList.add('in');}); return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){io.observe(el);});
})();

/* ---- compteurs qui grimpent ---- */
(function(){
  var nums=[].slice.call(document.querySelectorAll('[data-count]'));
  if(!nums.length) return;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function fmt(n){return n.toLocaleString('fr-FR');}
  function run(el){
    var target=parseFloat(el.getAttribute('data-count'))||0;
    var pre=el.getAttribute('data-prefix')||'';
    var suf=el.getAttribute('data-suffix')||'';
    if(reduce){el.textContent=pre+fmt(target)+suf;return;}
    var dur=1500,start=null;
    function step(ts){ if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1),eased=1-Math.pow(1-p,3);
      el.textContent=pre+fmt(Math.round(target*eased))+suf;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if(!('IntersectionObserver' in window)){nums.forEach(run);return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ run(en.target); io.unobserve(en.target); } });
  },{threshold:.5});
  nums.forEach(function(el){io.observe(el);});
})();

/* ---- alignement optique de l'encre (titres display) ---- */
(function(){
  var cvs=document.createElement('canvas'),ctx=cvs.getContext('2d');
  var sel='.masthead, .numeral, .shead h2';
  function align(){
    document.querySelectorAll(sel).forEach(function(el){
      el.style.marginLeft='0px';
      var cs=getComputedStyle(el),ch=(el.textContent||'').trim().charAt(0); if(!ch) return;
      if(cs.textTransform==='uppercase') ch=ch.toUpperCase();
      ctx.font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;ctx.textAlign='left';
      var abl=ctx.measureText(ch).actualBoundingBoxLeft;
      if(isFinite(abl)) el.style.marginLeft=abl.toFixed(2)+'px';
    });
  }
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(align);}
  align();
  var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(align,120);});
})();
