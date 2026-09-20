'use strict';
(() => {
  const viewer = document.querySelector('.viewer');
  const slides = [...viewer.querySelectorAll('.slide')];
  const position = document.querySelector('#position');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, moving = false, start = null, suppressClick = false;
  async function move(direction = 1) {
    if (moving || slides.length < 2) return;
    moving = true;
    const next = (current + direction + slides.length) % slides.length;
    const outgoing = slides[current], incoming = slides[next];
    try { await incoming.decode(); } catch (_) { moving = false; return; }
    incoming.hidden = false;
    if (!reduced.matches) {
      // jQuery's reference "swing" curve is a half-cosine over 1000 ms.
      await new Promise(resolve => {
        let began;
        function frame(now) {
          began ??= now;
          const progress = Math.min((now - began) / 1000, 1);
          const eased = (1 - Math.cos(Math.PI * progress)) / 2;
          outgoing.style.transform = `translateX(${-direction * eased * 100}%)`;
          incoming.style.transform = `translateX(${direction * (1 - eased) * 100}%)`;
          if (progress < 1) requestAnimationFrame(frame); else resolve();
        }
        incoming.style.transform = `translateX(${direction * 100}%)`;
        requestAnimationFrame(frame);
      });
    }
    outgoing.hidden = true;
    outgoing.style.transform = incoming.style.transform = '';
    current = next;
    position.textContent = `Image ${current + 1} of ${slides.length}. Archive study.`;
    moving = false;
  }
  viewer.addEventListener('click', () => { if (suppressClick) { suppressClick = false; return; } move(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
  });
  viewer.addEventListener('pointerdown', event => { start = {x:event.clientX,y:event.clientY}; suppressClick = false; });
  viewer.addEventListener('pointerup', event => {
    if (!start) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    start = null;
    if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y)) { suppressClick = true; move(x < 0 ? 1 : -1); }
  });
  viewer.addEventListener('pointercancel', () => { start = null; });
})();
