'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let entryTimer;
  setTimeout(() => {
    document.body.classList.remove('ritual-waiting');
    entryTimer = setTimeout(() => { document.querySelector('#space').classList.add('frame-shown'); started=true; schedule(); }, 1200);
  }, 2000);
  const steps = [
    ['You offer a gesture','Ти подаєш жест'],
    ['We remain silent or respond','Ми мовчимо або відповідаємо'],
    ['An object emerges, or not','Річ виникає, або ні'],
    ['This is not a purchase. It is an event.','Це не покупка. Це подія.']
  ];
  let step = 0, origin, dragged = false;
  const stage = document.querySelector('.step-stage');
  const previous = document.querySelector('#previous-step');
  const next = document.querySelector('#next-step');
  const howNext = document.querySelector('#how .frame-next');
  howNext.hidden = true;
  function changeStep(direction) {
    step = Math.max(0, Math.min(3, step + direction));
    const label = document.querySelector('#ritual-step');
    label.dataset.en = steps[step][0]; label.dataset.uk = steps[step][1];
    label.textContent = steps[step][document.documentElement.lang === 'uk' ? 1 : 0];
    document.querySelector('.step-count').textContent = `0${step + 1} / 04`;
    previous.disabled = step === 0; next.disabled = step === 3;
    howNext.hidden = step !== 3;
    if (!reduced.matches) label.animate([{opacity:0,transform:'translateX(15px)'},{opacity:1,transform:'none'}],{duration:900});
  }
  previous.addEventListener('click', () => changeStep(-1)); next.addEventListener('click', () => changeStep(1));
  stage.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); changeStep(event.key === 'ArrowLeft' ? -1 : 1); } });
  stage.addEventListener('pointerdown', event => { dragged = false; origin = event.clientX; stage.setPointerCapture(event.pointerId); });
  stage.addEventListener('pointerup', event => { if (origin !== undefined && Math.abs(event.clientX-origin)>45) { dragged=true; changeStep(event.clientX<origin?1:-1); } origin=undefined; });
  stage.addEventListener('pointercancel', () => { origin=undefined; });
  let transitioning = false;
  async function showFrame(button) {
    if (transitioning || !document.querySelector('#space').classList.contains('frame-shown')) return;
    transitioning = true; stopped=true; clearTimeout(idleTimer); clearTimeout(fadeTimer);
    const current = button.closest('.story-frame');
    const target = document.getElementById(button.dataset.next);
    if (!reduced.matches) await current.animate([{opacity:1},{opacity:0}],{duration:600,fill:'forwards'}).finished;
    current.hidden = true; target.hidden = false; button.setAttribute('aria-expanded','true');
    target.classList.add('frame-shown'); target.setAttribute('tabindex','-1');
    window.scrollTo({top:0,behavior:'instant'}); target.focus({preventScroll:true});
    if (!reduced.matches) target.animate([{opacity:0},{opacity:1}],{duration:1200});
    if (target.id === 'ritual') {
      document.body.classList.add('form-open');
      document.querySelectorAll('.why-section,.records').forEach(section => {section.hidden=false;});
    }
    transitioning=false;
  }
  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showFrame(button)));
  document.querySelectorAll('.story-frame').forEach(frame => frame.addEventListener('click', event => {
    if (event.target.closest('button,a,input,textarea,select') || transitioning) return;
    if (dragged) {dragged=false;return;}
    if (frame.id === 'how' && step < 3) {changeStep(1);return;}
    showFrame(frame.querySelector('[data-next]'));
  }));
  const artifact = document.querySelector('.artifact-reveal');
  let imageTimer;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) imageTimer = setTimeout(() => {artifact.classList.add('visible'); observer.disconnect();},2000);
      else clearTimeout(imageTimer);
    });
  },{threshold:.25});
  observer.observe(artifact);
  const idle = document.querySelector('#space .story-quote');
  const phrases = [
    ['We do not want you to do something. We want you to be.','Ми не хочемо, щоб ти щось зробив. Ми хочемо, щоб ти був.'],
    ['You can stay here.','Ти можеш залишитися тут.'],
    ['Silence is part of the ritual.','Тиша — це частина ритуалу.']
  ];
  let idleTimer, fadeTimer, phrase=0, started=false, stopped=false;
  function schedule() {
    clearTimeout(idleTimer);
    if (stopped || document.hidden) return;
    idleTimer=setTimeout(() => {
      idle.style.opacity='0';
      fadeTimer=setTimeout(() => {phrase=(phrase+1)%phrases.length; idle.dataset.en=phrases[phrase][0]; idle.dataset.uk=phrases[phrase][1]; idle.textContent=phrases[phrase][document.documentElement.lang==='uk'?1:0]; idle.style.opacity='1'; schedule();},reduced.matches?0:1200);
    },9000);
  }

  document.addEventListener('click', event => {clearTimeout(fadeTimer);idle.style.opacity='1';if(event.target.closest('[data-next]')) stopped=true;if(started)schedule();});
  document.addEventListener('visibilitychange', () => {clearTimeout(idleTimer);clearTimeout(fadeTimer);idle.style.opacity='1';if(started&&!document.hidden)schedule();});
})();
