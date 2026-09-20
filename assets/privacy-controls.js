(() => {
  'use strict';
  const key = 'sadage-analytics-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && Date.now() - saved.time < lifetime) choice = saved.accepted; } catch (_) {}
  window.gtag = window.gtag || function () {};
  window.addEventListener('storage', event => {
    if (event.key === key) location.reload();
  });
  function start() {
    document.querySelectorAll('script[data-consent="analytics"]').forEach(original => {
      const script = document.createElement('script');
      if (original.dataset.src) { script.src = original.dataset.src; script.async = true; }
      else script.textContent = original.textContent;
      original.replaceWith(script);
    });
  }
  function clearCookies() {
    document.cookie.split(';').forEach(part => {
      const name = part.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) return;
      ['', location.hostname, '.sadage.com'].forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  const panel = document.createElement('section');
  panel.className = 'privacy-panel'; panel.setAttribute('aria-label', 'Analytics preferences');
  panel.innerHTML = '<p>Allow analytics? Google Analytics measures visits; Microsoft Clarity helps us understand page use. Optional tracking stays off unless you accept. <a href="/cookie-policy/">Cookie policy</a></p><div><button type="button" data-choice="no">Reject analytics</button><button type="button" data-choice="yes">Accept analytics</button></div>';
  panel.hidden = choice !== null;
  document.body.append(panel);
  document.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); }));
  panel.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const accepted = button.dataset.choice === 'yes';
    try { localStorage.setItem(key, JSON.stringify({accepted, time: Date.now()})); } catch (_) {}
    panel.hidden = true;
    if (accepted && choice !== true) start();
    if (!accepted) { clearCookies(); if (choice === true) location.reload(); }
    choice = accepted;
  }));
  if (choice === true) start();
})();
