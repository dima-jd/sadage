'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover)');
  document.querySelectorAll('.nav-item').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    let wanted = false;
    function stop() { wanted = false; video.pause(); card.classList.remove('video-playing'); if (video.readyState) video.currentTime = 0; }
    async function play() {
      if (reduced.matches || document.hidden) return;
      wanted = true; video.muted = true;
      if (!video.hasAttribute('src')) video.src = video.dataset.src;
      try { await video.play(); if (wanted) card.classList.add('video-playing'); else video.pause(); } catch (_) { card.classList.remove('video-playing'); }
    }
    card.addEventListener('mouseenter', () => { if (hover.matches) play(); });
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focus', () => { if (hover.matches) play(); });
    card.addEventListener('blur', stop);
    video.addEventListener('error', stop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    reduced.addEventListener('change', () => { if (reduced.matches) stop(); });
  });
})();
