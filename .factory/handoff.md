# Review 2 handoff

## Outcome

Adversarial first-read review 2 is complete. Verdict: **FAIL**.

No product code was modified. The review found one blocking clean-clone claim-runner failure and eight major/minor findings covering claim-test scope, dead sample links, mobile first-screen facts, touch targets, metadata/sitemap coverage, headings, workflow button labels, and README jargon.

## Files

- `.factory/review-2.md` — full cold-read, copy, demo, claims, history, structure, accessibility, crawl, and missed-leverage review.
- `.factory/handoff.md` — this handoff.

## Verification performed

- Opened the live root cold in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Entered the sample in one click; inspected filled data, banner, Reset, Start for real, IndexedDB names, and request traffic.
- Confirmed offline service-worker reload and stage restoration.
- Executed the exported acknowledgement form, downloaded its receipt, and imported that exact file.
- Crawled root, legal, 404, and every demo stage link.
- Checked route titles, h1 counts, metadata, canonical links, history, focus, announcer, headers, manifest MIME, and caching.
- Ran axe on root, all six demo stages, Privacy, Terms, and 404 at phone and desktop sizes: no serious/critical violations.
- Ran `/opt/fleet/lib/verify-url.sh` against production: PASS with no console errors.
- Cloned the repository locally, ran `npm ci`, then ran the first exact registered claim command before any build: FAIL because `dist/` was absent.
- Ran `npm run build`, then all 12 registered claim filters: PASS.
- Ran `npm test`: PASS — 10 unit/config tests, production build, and 16 Chromium tests.

## Known gaps / next steps

Resolve F-2-1 through F-2-9 in `.factory/review-2.md`, deploy, and repeat the whole adversarial review. F-2-1 is blocking. The current product remains buildable; review-only Markdown changes were made.
