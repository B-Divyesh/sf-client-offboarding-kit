# Perfection-loop polish 2

Release candidate `24f7c3ba4b72bd6d176f9a39200e7d340e1e412c` was repaired against review commit `4a8f079111fdab5425e790aea5177f11a9af9aa3`.

The live acceptance origin is <https://client-offboarding-kit.sociobot.in>. Screenshots are `.factory/evidence/polish-2-live-mobile-home.png` and `.factory/evidence/polish-2-live-desktop-demo-assets.png`.

## Round 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Added `pretest:claims`, so every registered command builds `dist/` before Playwright starts. | All 12 exact `.factory/claims.json` commands passed after `npm ci` in a fresh clone with no `dist/`. |
| F-2-2 | Reset is exercised after an edit; privacy inspects every request URL, method, and body; backup restore deep-compares the full decrypted packet; the downloaded client form now produces the exact receipt imported by the app. | `@claim:demo-isolation`, `@claim:private-network`, `@claim:backup-roundtrip`, `@claim:acknowledgement-receipt`; all pass locally and live. |
| F-2-3 | Replaced three fictional 404 links with stable public GitHub, Netlify, and Cloudflare Registrar provider pages. | `sample provider links resolve without dead ends`; live `/demo?stage=assets`; desktop screenshot. |
| F-2-4 | Moved all three facts directly below the sample action and tightened the phone composition without removing copy. | `390px layout has no overflow and keeps the complete first screen visible`; live mobile screenshot; live `/`. |
| F-2-5 | Gave header, footer, banner, record, legal, summary, small-button, and checkbox-label targets at least 44 px. | `390px touch targets meet the 44px baseline on every route`; live suite checks root, legal, 404, and six demo stages. |
| F-2-6 | Added 404 Open Graph/Twitter metadata and all six packet routes to the sitemap. | `metadata, shared links, and the styled 404 are complete`; config tests `lists every public app route in the sitemap` and `gives the 404 page complete sharing metadata`; live 404 returns HTTP 404. |
| F-2-7 | Replaced the vague h2s with “Preview a filled client packet” and “Create and send a packet in three steps.” | `landing headings and workflow actions name their destinations`; live `/`; mobile screenshot. |
| F-2-8 | Replaced every generic Back/Continue action with the source or destination stage name. | `landing headings and workflow actions name their destinations`; all six live demo stages. |
| F-2-9 | Rewrote README technical prose to lead with browser storage, browser tests, offline use, and hosting outcomes before implementation terms. | `.factory/copy-audit.md`; no sentence exceeds 22 words and no non-literal banned term remains. |

## Round 1 cumulative recheck

Every earlier fix was inspected in the current source and exercised again on the deployed 1.2.0 build.

| Finding | Current change/state | Current evidence |
| --- | --- | --- |
| F-1-1 | Job-first h1, named audience, sample action, and correctly ordered passphrase controls remain. | `390px layout…`; live `/`; mobile screenshot. |
| F-1-2 | `/demo` and `?demo=1` seed a filled isolated packet with banner, reset, and exit. | `@claim:demo-isolation`; live `/demo`; desktop screenshot. |
| F-1-3 | Twelve claims each have exactly one unique tagged browser test. | Tag-count check and all exact fresh-clone claim commands. |
| F-1-4 | Unavailable Studio pricing, checkout, and license offer remain absent. | Paid-copy source scan; live link crawl. |
| F-1-5 | Unknown routes and `/404.html` use the designed recovery page and return 404. | `metadata…styled 404`; live HTTP checks. |
| F-1-6 | Six stage URLs retain history, reload, focus, titles, and announcement. | `stage URLs restore state, titles, history, focus, and announcements`; live `/demo?stage=assets`. |
| F-1-7 | Restrictive CSP, anti-framing, permissions, nosniff, and referrer policies remain configured. | Config tests and live response headers. |
| F-1-8 | Hashed assets retain one-year immutable caching; service worker is no-store. | Config tests and live asset headers. |
| F-1-9 | Manifest retains `application/manifest+json`. | Config test and live manifest header. |
| F-1-10 | Secret rejection preserves valid asset fields and focuses the bad field. | `@claim:credential-rejection`; live demo. |
| F-1-11 | Root and stage titles/h1s stay descriptive and route-specific. | `stage URLs…`; `metadata…`; live root and stages. |
| F-1-12 | Canonical, OG/Twitter, SVG favicon, Apple icon, and product social image remain. | `metadata…`; live root/legal/404 crawl. |
| F-1-13 | Shared header/footer, skip link, one-liner, factory credit, and build ID remain everywhere. | `metadata…shared links`; live root/legal/404. |
| F-1-14 | Preview, three-step process, limits/privacy section, and honest no-paid-offer state remain. | `landing headings…`; `@claim:workflow-boundaries`; live `/`. |
| F-1-15 | README and demo documentation retain URL, sample, reset, and namespace details. | `.factory/demo.md`; `@claim:demo-isolation`. |
| F-1-16 | Client form creates a receipt that the matching packet imports. | `@claim:acknowledgement-receipt`; live end-to-end form execution. |
| F-1-17 | Header remains the literal “Client handoff packets.” | Copy audit; live screenshot. |
| F-1-18 | Browser-storage status remains precise. | `@claim:private-network`; live demo. |
| F-1-19 | Non-verbal Studio price action remains absent. | Paid-copy source scan; live root. |
| F-1-20 | Audience-specific tool wording remains. | Copy audit; live mobile screenshot. |
| F-1-21 | Credential guidance remains direct and literal. | `@claim:credential-rejection`; live assets stage. |
| F-1-22 | “Packet stages” remains the sequence name. | Copy audit; live demo rail. |
| F-1-23 | “Complete the packet in six stages” remains. | Copy audit; live root. |
| F-1-24 | Footer retains the tested encrypted-storage statement. | `@claim:encrypted-storage`; live footer. |
| F-1-25 | Studio mood dialog remains absent. | Paid-copy source scan; live root. |
| F-1-26 | README opens in plain browser-app language. | Copy audit. |
| F-1-27 | README directly names packet contents. | `@claim:packet-export`; copy audit. |
| F-1-28 | Assets, owners, access tasks, support dates, and acknowledgement stay consistent. | Copy audit terminology; live demo. |
| F-1-29 | Encryption outcome precedes IndexedDB technical detail. | `@claim:encrypted-storage`; README/privacy. |
| F-1-30 | Export labels explain the purpose of each file. | `@claim:packet-export`; `@claim:backup-roundtrip`; live export stage. |
| F-1-31 | Billing/API copy and runtime license module remain absent. | Source scan and production bundle. |
| F-1-32 | “Original service” remains the one external-system term. | Copy audit; `@claim:workflow-boundaries`. |
| F-1-33 | README test description remains split into short sentences. | Copy audit. |
| F-1-34 | App, packet, stage, access task, original service, and acknowledgement receipt remain standardized. | Copy audit terminology table. |
| F-1-35 | Unmeasurable title slogan remains absent. | Metadata test; live `<title>`. |
| F-1-36 | “Secure” remains absent from marketing metadata; export and secret rejection stay separate. | `@claim:packet-export`; `@claim:credential-rejection`. |
| F-1-37 | Demo and exported HTML contain every packet section. | `@claim:packet-export`; live demo. |
| F-1-38 | Browser-storage and recovery wording remains scoped. | `@claim:private-network`; `@claim:recovery-boundary`. |
| F-1-39 | Stored demo envelope remains ciphertext without sample plaintext or passphrase. | `@claim:encrypted-storage`; live IndexedDB check. |
| F-1-40 | Complete demo still requires no account. | `@claim:private-network`; live `/demo`. |
| F-1-41 | First-visit offline claim survives offline reload and export. | `@claim:offline-reload`; live suite. |
| F-1-42 | No-analytics/account claim remains registered and request-tested. | `@claim:private-network`; live suite. |
| F-1-43 | Generated-art disclosure, prompt, shipped art, and provenance remain. | `@claim:art-provenance`; live footer/art URL. |
| F-1-44 | Unavailable one-time price claim remains absent. | Paid-copy source scan; live root. |
| F-1-45 | Unverified paid entitlements remain absent. | Paid-copy source scan; live root. |
| F-1-46 | “No subscription” remains absent. | Paid-copy source scan; live root. |
| F-1-47 | Merchant/refund copy remains absent without checkout. | Paid-copy source scan; live root. |
| F-1-48 | An access task remains blocked until its original-service check. | `@claim:access-confirmation`; live demo. |
| F-1-49 | Secret patterns remain rejected across forms without losing valid asset fields. | `@claim:credential-rejection`; unit security tests. |
| F-1-50 | Passphrase remains absent from stored plaintext and every request. | `@claim:encrypted-storage`; `@claim:private-network`. |
| F-1-51 | Backup import restores the complete packet and offline export still works. | Deep `@claim:backup-roundtrip`; `@claim:offline-reload`. |
| F-1-52 | Paid-license claim remains absent. | Paid-copy source scan; live root. |
| F-1-53 | Workflow boundaries remain literal and registered. | `@claim:workflow-boundaries`; live limits section. |
| F-1-54 | Environment/backend marketing claim remains absent. | README audit. |
| F-1-55 | `npm test` continues to cover unit, build, browser, axe, mobile, export, privacy, and offline behavior. | Final clean-clone `npm test`. |
| F-1-56 | Playwright remains exactly pinned to 1.58.2. | Package and lock inspection; clean `npm ci`. |
| F-1-57 | Production build still creates root `dist/index.html`. | `npm run build`; clean-clone test. |
| F-1-58 | Service worker and manifest continue to build and deliver correctly. | Config tests; live offline and manifest checks. |
| F-1-59 | Account-free and analytics-free sample use remains registered. | `@claim:private-network`; live full flow. |
| F-1-60 | Every demo request remains same-origin GET-only with no packet content in URL or body. | Strengthened `@claim:private-network`; live suite. |
| F-1-61 | Inactive license verification remains absent. | Source/bundle scan; live request log. |
| F-1-62 | Wrong passphrase cannot open a packet and no recovery request exists. | `@claim:recovery-boundary`; live suite. |
| F-1-63 | Node 20+ remains declared and clean verification uses Node 22. | `engines.node`; fresh-clone install/test. |

## Shared acceptance evidence

- Clean clone: `npm ci`, all 12 exact claim commands, `npm test`, and `npm run build` pass.
- Live browser suite: all claim, routing, accessibility, privacy, offline, link, phone-layout, and touch-target tests pass against the custom domain.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, title/lang/main/one h1/alt/button names pass, with no console errors.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 0 ms.
- Production payload: JS 46.84 KB raw / 15.65 KB gzip; CSS 19.44 KB raw / 5.06 KB gzip.
- Live delivery: all product/legal/stage routes return 200; unknown paths and `/404.html` return 404; CSP, anti-framing, permissions, manifest MIME, immutable asset caching, and service-worker no-store are present.
