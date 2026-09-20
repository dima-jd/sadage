# Meta Second page cards

Edit `meta-second/page-cards.json` to change the cards:

- `title`: page name displayed over the image.
- `text`: optional text displayed beneath the title; use `\n` for a line break.
- `href`: destination page, such as `/sad-print-room/` or a full HTTPS URL.
- `image`: image path or HTTPS URL, cropped to fill the whole card.
- `enabled`: set to `false` to hide a card.

The initial cards link to existing Print Room and About pages. Replace these entries or add entries when new pages are ready. Text is edited in this file, not by visitors on the public page.

One card appears after every nine visible products, including after filtering or searching. Cards cycle through the configured list. They do not affect product counts, product order, checkout, or product detail views. Fewer than nine products show no page card. An empty list disables page cards; a missing or invalid configuration does not block the product grid.

This change lives on `feature/meta-second-page-cards`. The original remains on `main`; nothing is merged or deployed by this branch change.
