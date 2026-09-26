'use strict';
(() => {
  const viewer = document.querySelector('#viewer');
  const empty = document.querySelector('#empty-state');
  const position = document.querySelector('#position');
  const albumList = document.querySelector('#album-list');
  const grid = document.querySelector('#grid-view');
  const gridTitle = document.querySelector('#grid-title');
  const photoGrid = document.querySelector('#photo-grid');
  const menu = document.querySelector('.site-menu');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  let albums = [], activeAlbum = 0, slides = [], current = 0;
  let moving = false, pointerStart = null, touchStart = null, suppressClickUntil = 0;

  function announce() {
    const album = albums[activeAlbum];
    position.textContent = slides.length
      ? `${album.name}. Image ${current + 1} of ${slides.length}.`
      : `${album.name}. No photographs yet.`;
  }

  function showSelectedPhoto(index) {
    if (!slides[index].src) slides[index].src = slides[index].dataset.src;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
      slide.style.transform = '';
    });
    current = index;
    announce();
  }

  function selectAlbum(index, updateHash = true) {
    if (moving) return;
    activeAlbum = index;
    const album = albums[index];
    albumList.querySelectorAll('.album-button').forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    slides = album.photos.map((image, i) => {
      const slide = document.createElement('img');
      slide.className = 'slide';
      slide.dataset.src = image.src;
      if (i === 0) slide.src = image.src;
      slide.alt = image.alt;
      slide.draggable = false;
      slide.decoding = 'async';
      slide.hidden = i !== 0;
      return slide;
    });
    empty.hidden = slides.length > 0;
    viewer.replaceChildren(empty, ...slides);
    current = 0;
    announce();
    grid.hidden = true;
    if (updateHash) history.replaceState(null, '', `#${encodeURIComponent(album.number)}`);
  }

  async function move(direction = 1) {
    if (moving || slides.length < 2 || !grid.hidden) return;
    moving = true;
    const next = (current + direction + slides.length) % slides.length;
    const outgoing = slides[current], incoming = slides[next];
    if (!incoming.src) incoming.src = incoming.dataset.src;
    try { await incoming.decode(); } catch (_) { moving = false; return; }
    incoming.hidden = false;
    if (!reduced.matches) {
      // Keep the original 1000 ms half-cosine slideshow transition.
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
    announce();
    moving = false;
  }

  function closeGrid() {
    grid.hidden = true;
    viewer.focus({ preventScroll: true });
  }

  function openGrid() {
    if (!mobile.matches || moving || !slides.length) return;
    gridTitle.textContent = `${albums[activeAlbum].number} — ${albums[activeAlbum].name}`;
    photoGrid.replaceChildren();
    albums[activeAlbum].photos.forEach((image, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `View image ${index + 1} of ${slides.length}: ${image.alt}`);
      if (index === current) button.setAttribute('aria-current', 'true');
      const thumb = document.createElement('img');
      thumb.src = image.src;
      thumb.alt = '';
      thumb.loading = 'lazy';
      button.append(thumb);
      button.addEventListener('click', () => { showSelectedPhoto(index); closeGrid(); });
      photoGrid.append(button);
    });
    grid.hidden = false;
    document.querySelector('#close-grid').focus({ preventScroll: true });
  }

  fetch('/people/albums.json')
    .then(response => { if (!response.ok) throw new Error('Album manifest unavailable'); return response.json(); })
    .then(data => {
      if (!Array.isArray(data) || !data.length) throw new Error('No albums configured');
      albums = data.filter(album => album && typeof album.number === 'string' && typeof album.name === 'string')
        .map(album => ({ ...album, photos: Array.isArray(album.photos) ? album.photos.filter(image => image && image.src && image.alt) : [] }));
      if (!albums.length) throw new Error('No valid albums configured');
      albums.forEach((album, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'album-button';
        button.setAttribute('aria-label', `Album ${album.number}: ${album.name}`);
        const number = document.createElement('span');
        number.className = 'album-number';
        number.textContent = album.number;
        const name = document.createElement('span');
        name.className = 'album-name';
        name.textContent = album.name;
        button.append(number, name);
        button.addEventListener('click', () => selectAlbum(index));
        albumList.append(button);
      });
      const requested = decodeURIComponent(location.hash.slice(1));
      selectAlbum(Math.max(0, albums.findIndex(album => album.number === requested)), false);
    })
    .catch(() => { empty.textContent = 'Archive unavailable.'; });

  viewer.addEventListener('click', () => {
    if (performance.now() >= suppressClickUntil) move();
  });
  viewer.addEventListener('pointerdown', event => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  viewer.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const x = event.clientX - pointerStart.x, y = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y)) {
      suppressClickUntil = performance.now() + 500;
      move(x < 0 ? 1 : -1);
    }
  });
  viewer.addEventListener('pointercancel', () => { pointerStart = null; });
  viewer.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  viewer.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const x = touch.clientX - touchStart.x, y = touch.clientY - touchStart.y;
    touchStart = null;
    if (mobile.matches && y < -65 && Math.abs(y) > Math.abs(x)) {
      suppressClickUntil = performance.now() + 500;
      openGrid();
    }
  }, { passive: true });
  viewer.addEventListener('touchcancel', () => { touchStart = null; });
  document.querySelector('#close-grid').addEventListener('click', closeGrid);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!grid.hidden) closeGrid();
      else if (menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
      return;
    }
    if (!grid.hidden || menu.open || !albums.length) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  window.addEventListener('hashchange', () => {
    const requested = decodeURIComponent(location.hash.slice(1));
    const index = albums.findIndex(album => album.number === requested);
    if (index !== -1) selectAlbum(index, false);
  });
  mobile.addEventListener('change', () => { if (!mobile.matches && !grid.hidden) closeGrid(); });
})();
