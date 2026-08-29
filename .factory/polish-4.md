# Perfection-loop polish 4

Release candidate `eb3ee257418771a273cc265a25e7d018f862eb73` was repaired against review commit `c6da3c681e64398241d51fa3aedcdab77577f995`.

Product repair commit: `25b522fa11b03cfc329a3ed84dc161d75dbd700f`.

Acceptance origin: <https://client-offboarding-kit.sociobot.in>

Evidence shorthand used below:

- **HOME:** `.factory/evidence/polish-4-live/screenshot-mobile.png`
- **DEMO:** `.factory/evidence/polish-4-live/demo-assets-mobile.png`
- **REAL:** `.factory/evidence/polish-4-live/real-assets-mobile.png`
- **404:** `.factory/evidence/polish-4-live/404-mobile.png`
- **LEGAL:** `.factory/evidence/polish-4-live/privacy-mobile.png` and `terms-mobile.png`
- Machine-readable route evidence: `.factory/evidence/polish-4-live/real-route-metadata.json`
- Delivery evidence: `.factory/evidence/polish-4-live/delivery.json`

## Review 4 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Replaced all six real packet titles with the required product-first job descriptions. Added a regression that creates a real encrypted packet, reloads and unlocks every deep link, and checks title, canonical, `og:url`, Open Graph title, Twitter title, h1, and focus. | Test `every real packet route uses a product-first title and matching route metadata`; REAL; machine-readable route evidence; live `/packet/engagement` through `/packet/export`. |

## Review 3 cumulative findings

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-3-1 | The first screen states “No purchase required,” and the complete real create/export flow has no billing step or request. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-3-2 | Every demo stage retains its product-first title and matching share metadata. | `every demo route uses a product-first title and matching share metadata`; DEMO; live `/demo` and all `?stage=` URLs. |

## Review 2 cumulative findings

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-2-1 | `pretest:claims` builds `dist/`, so every exact registry command runs from a clean clone without prior setup. | All 13 exact commands passed in `/tmp/client-offboarding-kit-polish-4.M5c4pF/repo`; HOME; live `/demo`. |
| F-2-2 | Claim tests exercise Reset, inspect request URLs/methods/bodies, deep-compare restored data, and import the receipt produced by the exported client form. | `@claim:demo-isolation`, `@claim:private-network`, `@claim:backup-roundtrip`, `@claim:acknowledgement-receipt`; DEMO; live `/demo`. |
| F-2-3 | Sample assets use reachable GitHub, Netlify, and Cloudflare Registrar pages. | `sample provider links resolve without dead ends`; DEMO; live `/demo?stage=assets`. |
| F-2-4 | Privacy, price, and offline facts remain above the 390 × 844 fold. | `390px layout has no overflow and keeps the complete first screen visible`; HOME; live `/`. |
| F-2-5 | Navigation, footer, demo, record, form, and legal touch targets retain the 44 px minimum. | `390px touch targets meet the 44px baseline on every route`; HOME/DEMO/404/LEGAL; all cited live routes. |
| F-2-6 | The styled 404 has full share metadata, and the sitemap contains every public stage URL. | `metadata, shared links, and the styled 404 are complete`; config sitemap/404 tests; 404; live `/not-a-real-route` returns 404. |
| F-2-7 | Landing h2s still name the filled preview and three-step process directly. | `landing headings and workflow actions name their destinations`; HOME; live `/`. |
| F-2-8 | Every stage action names its source or destination instead of saying Back or Continue. | `landing headings and workflow actions name their destinations`; DEMO; live all demo stages. |
| F-2-9 | README continues to put practical outcomes before browser-storage, browser-test, and hosting terms. | `.factory/copy-audit.md`; HOME; live product plus repository README. |

## Review 1 cumulative findings

| Finding | Current change/state | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen has the job-first h1, named audience, sample action, next-step note, three facts, and passphrase action in the required order. | `390px layout has no overflow and keeps the complete first screen visible`; HOME; live `/`. |
| F-1-2 | `/demo` and `?demo=1` open seeded Northstar data in `demo:closeout-kit-v1`; Reset reseeds it and Start for real deletes it without touching real data. | `@claim:demo-isolation`; DEMO; live `/demo` and `/?demo=1`. |
| F-1-3 | `.factory/claims.json` has 13 unique claims and exactly one matching tag and executable command per claim. | `maps every registered product claim to exactly one tagged browser test`; all exact claim commands; DEMO; live `/demo`. |
| F-1-4 | The dead Studio checkout and all unsupported paid claims remain removed; the real workflow needs no purchase. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-5 | Unknown routes and `/404.html` return the designed recovery page with HTTP 404. | `metadata, shared links, and the styled 404 are complete`; delivery evidence; 404; live `/not-a-real-route`. |
| F-1-6 | Six stage URLs support deep links, reload, history, focused h1s, and announcements. | `stage URLs restore state, titles, history, focus, and announcements` plus the new real-route test; REAL; live packet/demo stages. |
| F-1-7 | CSP, `frame-ancestors 'none'`, frame denial, nosniff, referrer, and permissions headers remain deployed. | `sets security policies as response headers`; delivery evidence; HOME; live `/`. |
| F-1-8 | Hashed assets use one-year immutable caching while `sw.js` uses no-store. | `sets immutable caching only for hashed assets`; delivery evidence; HOME; live hashed JS and `/sw.js`. |
| F-1-9 | The manifest is served as `application/manifest+json`. | `sets the manifest MIME type and real 404 response`; delivery evidence; HOME; live `/manifest.webmanifest`. |
| F-1-10 | Credential rejection keeps valid asset values, binds the error, and focuses the invalid note. | `@claim:credential-rejection`; DEMO; live `/demo?stage=assets`. |
| F-1-11 | Root and all real/demo stages now use descriptive job titles and h1s; real stages are product-first in round 4. | real/demo title tests; HOME/REAL; live `/` and all packet stages. |
| F-1-12 | Canonical, Open Graph, Twitter, SVG favicon, Apple icon, and product social art remain on public routes. | `metadata, shared links, and the styled 404 are complete` plus real/demo title tests; HOME/REAL/LEGAL; live public routes. |
| F-1-13 | Shared header/footer provide Home, Demo, Privacy, Terms, skip link, one-line product description, factory credit, and build 1.2.2. | `metadata, shared links, and the styled 404 are complete`; HOME/LEGAL/404; live public routes. |
| F-1-14 | Landing order retains filled preview, three-step instructions, literal privacy/limits, and no unavailable paid section. | landing heading test and `@claim:workflow-boundaries`; HOME; live `/`. |
| F-1-15 | README and `.factory/demo.md` document demo URLs, sample contents, reset, exit, and isolated storage. | `@claim:demo-isolation`; DEMO; live `/demo`. |
| F-1-16 | The client form creates a receipt file that the matching packet validates and imports. | `@claim:acknowledgement-receipt`; DEMO; live `/demo?stage=acknowledgement`. |
| F-1-17 | The header uses literal “Client handoff packets”; the departure slogan remains absent. | `.factory/copy-audit.md`; HOME; live `/`. |
| F-1-18 | Status text precisely says packet data stays in this browser. | `@claim:private-network`; HOME; live `/`. |
| F-1-19 | The non-verbal Studio price action remains absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-20 | The first-screen label names freelancers and studios instead of implementation jargon. | copy audit; HOME; live `/`. |
| F-1-21 | Credential guidance is literal and points to a password manager. | `@claim:credential-rejection`; HOME/DEMO; live `/` and assets stage. |
| F-1-22 | “Six packet stages” remains the sequence name. | landing heading test; HOME; live `/`. |
| F-1-23 | “Complete the packet in six stages” remains the section heading. | landing heading test; HOME; live `/`. |
| F-1-24 | The footer states the exact tested encrypted-storage outcome. | `@claim:encrypted-storage`; HOME; live `/`. |
| F-1-25 | The Studio mood dialog remains absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-26 | README opens with plain browser-app language and the intended audience. | `.factory/copy-audit.md`; HOME; live product plus README. |
| F-1-27 | README directly names packet inputs and output. | `@claim:packet-export`; DEMO; live export stage plus README. |
| F-1-28 | README and UI use assets, owners, access tasks, support dates, and acknowledgement. | copy terminology audit and `@claim:access-confirmation`; DEMO; live demo stages. |
| F-1-29 | Encryption outcome comes before the technical browser-storage detail. | `@claim:encrypted-storage`; HOME/LEGAL; live `/privacy/`. |
| F-1-30 | Export actions name the client HTML, print/PDF, encrypted backup, and acknowledgement form outcomes. | `@claim:packet-export`, `@claim:backup-roundtrip`, `@claim:acknowledgement-receipt`; DEMO; live export/acknowledgement stages. |
| F-1-31 | Billing and license API copy/code remain absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-32 | “Original service” remains the consistent term for hosting, domain, CMS, and account systems. | `@claim:workflow-boundaries`; HOME/DEMO; live `/` and access-task stage. |
| F-1-33 | README test information remains split into short sentences. | `.factory/copy-audit.md`; HOME; repository README. |
| F-1-34 | App, packet, stage, access task, original service, and acknowledgement receipt remain the sole core terms. | terminology table in `.factory/copy-audit.md`; HOME/DEMO; live site. |
| F-1-35 | The unmeasurable title slogan remains absent. | route metadata tests; HOME; live `/`. |
| F-1-36 | Unsupported “secure” marketing copy remains absent; export and credential rejection are tested separately. | `@claim:packet-export` and `@claim:credential-rejection`; HOME/DEMO; live `/`. |
| F-1-37 | The sample and downloaded client HTML contain engagement, assets, access tasks, support, and acknowledgement. | `@claim:packet-export`; DEMO; live `/demo?stage=export`. |
| F-1-38 | Browser-data and recovery statements remain narrowly scoped and request-tested. | `@claim:private-network` and `@claim:recovery-boundary`; HOME/LEGAL; live `/privacy/`. |
| F-1-39 | Stored sample data remains an AES-GCM envelope without sample plaintext or passphrase. | `@claim:encrypted-storage`; DEMO; live `/demo`. |
| F-1-40 | The full sample remains usable without an account. | `@claim:private-network`; DEMO; live `/demo`. |
| F-1-41 | Offline-after-first-visit behavior reloads and exports the sample without network access. | `@claim:offline-reload`; DEMO; live `/demo?stage=export`. |
| F-1-42 | No-analytics behavior is enforced by the same-origin, GET-only, empty-body request audit. | `@claim:private-network`; DEMO; live `/demo`. |
| F-1-43 | Generated artwork disclosure, shipped file, prompt, and provenance remain present. | `@claim:art-provenance`; HOME; live `/art/harbor-closeout-960.avif`. |
| F-1-44 | The unavailable one-time-price offer remains absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-45 | Unverified paid entitlements remain absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-46 | “No subscription” remains absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-47 | Merchant/refund copy remains absent while no checkout is offered. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-48 | Access tasks cannot be completed until the original-service checkbox is confirmed. | `@claim:access-confirmation`; DEMO; live `/demo?stage=access-tasks`. |
| F-1-49 | Common secret patterns are rejected across forms without saving or clearing valid values. | `@claim:credential-rejection` plus model tests; DEMO; live assets/access/support stages. |
| F-1-50 | Passphrases remain absent from stored plaintext and network requests, with no recovery endpoint. | `@claim:encrypted-storage`, `@claim:private-network`, `@claim:recovery-boundary`; DEMO; live `/demo`. |
| F-1-51 | Encrypted backup import restores every packet field; offline reload/export also succeeds. | `@claim:backup-roundtrip` and `@claim:offline-reload`; DEMO; live export stage. |
| F-1-52 | Paid-license copy remains absent. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-53 | The landing, terms, and README state the workflow boundaries literally. | `@claim:workflow-boundaries`; HOME/LEGAL; live `/` and `/terms/`. |
| F-1-54 | The unsupported environment/backend marketing claim remains absent. | README audit and clean-clone `npm ci`; HOME; live product plus README. |
| F-1-55 | The complete suite covers unit/config, build, browser, Axe, mobile, export, privacy, claims, and offline behavior. | Clean-clone `npm test`: 14 unit/config and 22 Chromium checks; HOME; live suite also 22/22. |
| F-1-56 | Playwright remains pinned exactly to 1.58.2 in package and lock files. | Clean-clone `npm ci`; HOME; live browser suite. |
| F-1-57 | Production build produces `dist/index.html`. | Clean-clone `npm run build`; HOME; live `/`. |
| F-1-58 | Manifest/service worker build and delivery remain tested; service-worker cache version is now v5. | config delivery tests and `@claim:offline-reload`; delivery evidence; DEMO; live manifest/SW. |
| F-1-59 | Account-free and analytics-free sample use remains registered and tested. | `@claim:private-network`; DEMO; live `/demo`. |
| F-1-60 | Every demo request remains same-origin GET-only with no body or packet content. | `@claim:private-network`; DEMO; live `/demo`. |
| F-1-61 | Inactive license verification remains absent from copy, source, and requests. | `@claim:no-purchase-required`; HOME; live `/`. |
| F-1-62 | A wrong passphrase cannot decrypt a packet and triggers no recovery request. | `@claim:recovery-boundary`; HOME/DEMO; live `/`. |
| F-1-63 | Node 20+ remains declared; clean verification ran on Node 22. | config/package inspection and clean-clone `npm ci`; HOME; live build output. |

## Final verification

- Clean clone: `npm ci`, every one of the 13 exact `.factory/claims.json` commands, `npm test`, and `npm run build` passed.
- Local aggregate: 14 unit/config checks and 22 Chromium checks passed; all 13 claims passed.
- Live aggregate: all 22 Chromium checks passed against the deployed origin.
- Accessibility: Playwright AxeBuilder found zero serious or critical violations on root, legal, 404, and all demo stages. Keyboard focus, landmarks, h1 count, mobile layout, and 44 px targets passed.
- Privacy/offline: the live request audit found only same-origin GETs with empty bodies; isolated demo storage, reset/exit, offline reload, and offline export passed.
- Live routing: all expected app/legal routes returned 200; unknown routes and `/404.html` returned 404.
- Live delivery: manifest MIME, CSP, frame denial, permissions, immutable hashed assets, and no-store service worker passed.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Production payload: JavaScript 47.21 KB raw / 15.70 KB gzip; CSS 19.44 KB raw / 5.06 KB gzip.

No review finding remains open.
