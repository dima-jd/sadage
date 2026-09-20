'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover)');
  const background = document.createElement('video');
  background.className = 'touch-preview';
  background.muted = true; background.loop = true; background.playsInline = true;
  background.preload = 'none'; background.setAttribute('aria-hidden','true');
  document.body.append(background);
  let active = null, version = 0;
  function clearTouch() {
    version++; active?.classList.remove('touch-selected'); active = null;
    background.pause(); document.body.classList.remove('touch-preview-active');
  }
  async function preview(card, source) {
    clearTouch(); active = card; card.classList.add('touch-selected');
    const request = version;
    background.src = source; background.muted = true;
    document.body.classList.add('touch-preview-active');
    try { await background.play(); if (request !== version && !active) background.pause(); }
    catch (_) { if (request === version) document.body.classList.remove('touch-preview-active'); }
  }
  document.querySelectorAll('.nav-item').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    let wanted = false, touch = false;
    function stop() { wanted = false; video.pause(); card.classList.remove('video-playing'); if (video.readyState) video.currentTime = 0; }
    async function play() {
      if (reduced.matches || document.hidden) return;
      wanted = true; video.muted = true;
      if (!video.hasAttribute('src')) video.src = video.dataset.src;
      try { await video.play(); if (wanted) card.classList.add('video-playing'); else video.pause(); } catch (_) { card.classList.remove('video-playing'); }
    }
    card.addEventListener('pointerdown', event => { touch = event.pointerType === 'touch' || event.pointerType === 'pen'; });
    card.addEventListener('click', event => {
      if (event.detail === 0 || (!touch && hover.matches)) return;
      if (active === card) return;
      event.preventDefault(); stop(); preview(card, video.dataset.src);
    });
    card.addEventListener('mouseenter', () => { if (hover.matches && !touch) play(); });
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focus', () => { if (hover.matches && !touch) play(); });
    card.addEventListener('blur', stop);
    video.addEventListener('error', stop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    reduced.addEventListener('change', () => { if (reduced.matches) stop(); });
  });
  document.addEventListener('click', event => { if (!event.target.closest('.nav-item')) clearTouch(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') clearTouch(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTouch(); });
  window.addEventListener('pagehide', clearTouch);
  window.addEventListener('pageshow', clearTouch);
})();
