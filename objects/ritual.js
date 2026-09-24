'use strict';
(() => {
  const form = document.querySelector('#ritual-form');
  const review = document.querySelector('#review');
  const send = document.querySelector('#send');
  const payment = document.querySelector('#donate');
  const paymentStatus = document.createElement('p');
  paymentStatus.className = 'connection-note';
  payment.parentElement.before(paymentStatus);
  const config = window.SADAGE_BTCPAY || {};
  function paymentUrl(donation) {
    try {
      const url = new URL(donation ? config.donationUrl : config.initiationUrl);
      // Never point a payment action at the project's marketing site or demo.
      if (url.protocol !== 'https:' || url.username || url.password || /(^|\.)btcpayserver\.org$/i.test(url.hostname)) return null;
      return url.href;
    } catch (_) { return null; }
  }
  function updatePayment() {
    const donation = form.elements.gesture.value === 'donation';
    const url = paymentUrl(donation);
    payment.hidden = !url;
    if (url) payment.href = url;
    else payment.removeAttribute('href');
    payment.textContent = language === 'uk'
      ? (donation ? 'Підтримати через Stripe ↗' : 'Ініціація · 1 BTC через BTCPay ↗')
      : (donation ? 'Support with Stripe ↗' : 'Initiation · 1 BTC with BTCPay ↗');
    paymentStatus.textContent = language === 'uk'
      ? (url ? 'Stripe відкриється окремо. Обери суму підтримки та перевір валюту перед оплатою. Потім повернися та надішли свій запит.' : 'Приймання BTC через BTCPay ще не активовано. Ти можеш надіслати свій намір без оплати.')
      : (url ? 'Stripe opens separately. Choose your support amount and check the currency before paying. Then return and send your request.' : 'Receiving BTC through BTCPay is not active yet. You can send your intention without paying.');
    const note = document.querySelector('#btc-fields .connection-note');
    note.textContent = language === 'uk'
      ? (paymentUrl(false) ? 'Ініціація — 1 BTC через BTCPay Server. Платіж відкриється після перегляду запиту.' : 'BTC-ініціація через BTCPay Server ще не відкрита. Ти можеш надіслати SadAge свій намір без оплати.')
      : (paymentUrl(false) ? 'Initiation — 1 BTC through BTCPay Server. Payment opens after reviewing your request.' : 'BTC initiation through BTCPay Server is not open yet. You can send your intention to SadAge without paying.');
  }
  let language = 'en';
  function translate(next) {
    language = next === 'uk' ? 'uk' : 'en';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-uk]').forEach(element => { element.textContent = element.dataset[language]; });
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    document.title = language === 'uk' ? 'Об’єкти / Ритуальний запит — SadAge' : 'Objects / Ritual Request — SadAge';
    const description = language === 'uk' ? 'Це не замовлення. Це жест. Запрошення взяти участь у ритуалі SadAge.' : 'This is not an order. This is a gesture. Take part in a SadAge ritual.';
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:title"]').content = document.title;
    try { localStorage.setItem('sadage-objects-language', language); } catch (_) { /* Storage is optional. */ }
    updatePayment();
    if (review.open) buildReview();
  }
  const requested = new URLSearchParams(location.search).get('lang');
  let saved;
  try { saved = localStorage.getItem('sadage-objects-language'); } catch (_) { /* Use English. */ }
  translate(requested === 'ua' || requested === 'uk' ? 'uk' : requested === 'en' ? 'en' : saved || 'en');
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => translate(button.dataset.lang)));
  function updateGesture() {
    if (!config.initiationUrl) form.querySelector('[value=donation]').checked = true;
    const donation = form.elements.gesture.value === 'donation';
    document.querySelector('#donation-fields').hidden = !donation;
    form.elements.story.disabled = !donation;
    form.elements.story.required = donation;
    document.querySelector('#btc-fields').hidden = donation;
    form.elements.tx.disabled = donation;
    updatePayment();
  }
  form.querySelectorAll('[name="gesture"]').forEach(input => input.addEventListener('change', updateGesture));
  updateGesture();
  // The existing WhatsApp intake requires the visitor to send explicitly.
  // Never represent a request or payment as received without server verification.
  function buildReview() {
    const uk = language === 'uk';
    const donation = form.elements.gesture.value === 'donation';
    const lines = [uk ? 'SadAge / Ритуальний запит' : 'SadAge / Ritual Request',
      (uk ? 'Жест: ' : 'Gesture: ') + (donation ? (uk ? 'Донат + особиста історія' : 'Donation + personal story') : (uk ? 'Ініціація: 1 BTC — через BTCPay' : 'Initiation: 1 BTC — through BTCPay')),
      (uk ? 'Чому ти хочеш це?\n' : 'Why do you want this?\n') + form.elements.why.value.trim(),
      (uk ? 'Що залишиться після тебе?\n' : 'What will remain after you?\n') + form.elements.trace.value.trim()];
    if (donation) lines.push((uk ? 'Особиста історія:\n' : 'Personal story:\n') + form.elements.story.value.trim());
    if (!donation && form.elements.tx.value.trim()) lines.push('TX hash: ' + form.elements.tx.value.trim());
    lines.push(uk ? 'Я розумію: це може ніколи не бути створено. Жест не гарантує предмету чи відповіді.' : 'I understand: this may never be created. A gesture guarantees neither an object nor a response.');
    const message = lines.join('\n\n');
    document.querySelector('#review-text').textContent = message;
    send.href = 'https://wa.me/380952059105?text=' + encodeURIComponent(message);
    updatePayment();
  }
  form.querySelectorAll('textarea').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const input of form.querySelectorAll('textarea:enabled')) input.setCustomValidity(input.required && !input.value.trim() ? (language === 'uk' ? 'Залиш кілька слів.' : 'Leave a few words.') : '');
    if (!form.reportValidity()) return;
    buildReview();
    review.showModal();
  });
  document.querySelector('.close-review').addEventListener('click', () => review.close());
})();
