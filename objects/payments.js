'use strict';
// Public BTCPay Point of Sale app URLs only. No API keys or wallet secrets.
// Configure a fixed 1 BTC app and a separate custom-amount donation app.
// Leave empty until the owner's store and receiving wallet are verified.
window.SADAGE_BTCPAY = Object.freeze({
  initiationUrl: 'https://pay.sadage.com/apps/2NdF3szjUR8Yu6ugN37eJnRfKRiZ/pos',
  donationUrl: 'https://pay.sadage.com/apps/2LnnHEEQQxJxHe535R9T1fzKcwFi/pos'
});
