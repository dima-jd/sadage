# Objects / Ritual Request

Static bilingual page at `/objects/`. EN/UA buttons preserve form values; `?lang=en`, `?lang=uk` and `?lang=ua` select a language. Only language preference is persisted, never personal answers or transaction references.

## Available now

- Required reflection fields, donation story, explicit acknowledgment and accessible review dialog.
- BTCPay Server payment handoff for both initiation and donations, configured in `objects/payments.js`. Payment actions remain hidden until public store app URLs are supplied. The separate `/support/` page remains unchanged.
- Explicit WhatsApp handoff to the existing SadAge contact. Opening WhatsApp is not treated as delivery.
- BTC intention with optional 64-character transaction hash for manual review. No receiving address or crypto provider was present in the repository.
- Ritual records section with an honest unavailable state for the personal archive.

## Required before full activation

Deploy the owner's BTCPay instance, create the SadAge store and connect the owner's receiving wallet. Create a reusable Point of Sale app offering the fixed 1 BTC initiation and a separate custom-amount donation app. Configure the amounts/currency in BTCPay, not just the website copy. Copy the public View App URLs into `initiationUrl` and `donationUrl` in `objects/payments.js`. Do not use the BTCPay marketing website, demo, or a single payment request shared across participants.

Before activation, verify the actual receiving wallet and app configuration with the owner, then test invoice creation and payment status on a test setup. The site does not automatically open payment URLs or send personal stories to BTCPay. Opening the payment app does not imply payment or receipt of the ritual request.

A hosted app alone cannot persist ritual requests or maintain personal archives on this static site. Add a backend for request persistence and provider webhook verification before showing received/paid states. Do not put provider secrets in this static repository.

Official setup references: https://docs.btcpayserver.org/Deployment/ and https://docs.btcpayserver.org/Apps/.

A transaction hash is public: use it as a lookup reference, never as the sole credential for private stories or personal archives. Authenticated archives should show only owner-confirmed artifacts and a real edition count for “you are one of X” / “ти — один із X”.

After actual request receipt, the intended acknowledgment copy is:

- EN: “Request recorded. SadAge is watching. If a response comes — it will appear. If not — you have already done the essential thing: you stopped.”
- UA: “Запит зафіксовано. SadAge спостерігає. Якщо відповідь прийде — вона з’явиться. Якщо ні — ти вже зробив головне: зупинився.”
- Short EN: “We received your signal.”
- Short UA: “Ми отримали твій сигнал.”

Until receipt can be verified, the dialog correctly says the request is ready but nothing has been sent. Do not replace it with an automatic success message after a link click.

## BTCPay deployment status — 2026-09-20

The owner's Electrum public key is connected. The owner verified the first receiving address before confirmation. No private keys were imported.

Configured and saved bilingual public apps:
- Fixed 1 BTC initiation: https://pay.sadage.com/apps/2NdF3szjUR8Yu6ugN37eJnRfKRiZ/pos
- Custom-amount BTC donation: https://pay.sadage.com/apps/2LnnHEEQQxJxHe535R9T1fzKcwFi/pos

Payment links remain disabled in payments.js pending full Bitcoin synchronization and invoice validation. Both apps reject zero-amount invoices. Personal stories continue through the ritual form's explicit WhatsApp handoff.

Before launch: verify synchronization, test invoice amount/currency and receiving addresses, disable public account registration, inspect/remove the temporary sadage-admin-setup HTTPS IP restriction and persist the intended firewall rules. The temporary firewall restriction was added during initial server setup; verify its actual current state before changing it. Website changes are local and have not been published.

The owner requested connecting the apps before synchronization completes. Both URLs are now configured in payments.js; EN/UA payment notices disclose the pending synchronization. Invoice verification and public launch checks above remain outstanding.
