# SadAge editorial pages

The ten new routes are static HTML, with shared styles in `assets/editorial.css` and interactions in `assets/editorial.js`. They need no build step. The homepage links to every page. The original store and catalog are unchanged.

## Replacing preview content

- **People** (`people/index.html`): replace each gallery button's image `src`, `alt`, `data-gallery-src`, `data-caption`, and visible caption. Both layouts and the full-screen horizontal viewer use the same entries. The current images are explicitly labeled garment stand-ins. Adjust the displayed count when adding entries. Float coordinates (`--x`, `--y`) can be changed for composition.
- **Newspaper** (`newspaper/index.html`): replace the sample articles and short notes, date, topic, byline, images and issue number. Full text lives inside each article's `details`. Keep the `data-topic` value aligned with filter buttons. Remove the draft labels only after editorial approval.
- **Process** (`process/index.html`): replace the finished-piece illustrations with workshop photos and update captions. Add films to `assets/process-films.json`: `[{"title":"Printing a piece","src":"/media/process-01.mp4","poster":"/media/process-01.jpg","captions":"/media/process-01.vtt","description":"A short description","transcript":"Spoken content and meaningful sound descriptions."}]`. Native video controls support mobile, seeking and full screen. No source is requested until real film entries exist. Use WebVTT captions; provide an accessible transcript.
- **Support** (`support/index.html`): confirm the draft explanation of fund use. The existing live Stripe link was verified against product `prod_VHcwlJpBRlwMbF` (Support Sad Age). It is a custom-amount, one-time USD payment. No new Stripe resources were created.
- **Sad World** (`sad-world/index.html`): replace preview images, captions, observation text and topic labels. Image buttons open the same full-screen viewer as People.
- **Objects** (`objects/index.html`): replace the forthcoming cards when products exist. No prices, stock or checkout are invented. Existing print cards lead to the print archive.
- **Open Call** (`open-call/index.html`): review proposed collaboration terms before removing the draft label. Current copy commits to no fee, deadline or license transfer.
- **Contact** (`contact/index.html`): uses Instagram and WhatsApp already present in SadAge's About/Print Room pages. No invented email or studio address.
- **Survey** (`survey/index.html`): all questions optional. Review builds a WhatsApp draft for the existing contact. Nothing is sent automatically. Empty responses do not enable sending; clearing or changing answers resets the preview. No answers are saved in local storage or sent to a server. A future independent survey inbox needs a backend integration.
- **Game** (`game/index.html`): a static Lost & Found introduction. Playable functionality is deferred at the owner’s request.

Use repository-root-relative URLs for media. For each photograph, provide accurate alt text and any necessary credits/permissions before publication. Existing placeholders are real catalog images, not documentary claims about people or production.

## Preview

Serve the repository as a static site. All links use directory routes (`/people/`, `/newspaper/`, etc.). Check at desktop and phone widths. No package installation or framework is needed.
