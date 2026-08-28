# Perfection-loop polish 3

This round repairs release candidate `41299fc997a1f6295df4d78ae191a6f58777b1d7` against review `c3f7a3d9962983d4e4c9e8e06abdd4113022b66c`, and rechecks every earlier review and polish finding. Product repairs are in `c2e06a2f4166b5a45ed50e5bd6a205f55b49e1ea` and the expanded regression checks are in `c5b2ce681fe39eef5abeaa2057c5668eb26007d9`.

Evidence paths:

- Phone first screen: `.factory/evidence/polish-3-live-mobile-home.png`
- Desktop demo assets: `.factory/evidence/polish-3-live-desktop-demo-assets.png`
- Cold URL verifier: `.factory/evidence/polish-3-live/verify.json`
- Acceptance origin: <https://client-offboarding-kit.sociobot.in>

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Replaced the ambiguous account fact with the truthful commercial fact “No purchase required”; added the registered `no-purchase-required` claim and a real create-and-export test with no payment request. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/` shows all three facts before the form. |
| F-3-2 | Added explicit product-first titles for all six demo stages and updated OG/Twitter titles with them. | Test: `every demo route uses a product-first title and matching share metadata`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo` and `/demo?stage=assets`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Claim commands build their own `dist/` through `pretest:claims`. | Test: all 13 exact claim commands from a clean clone; image: `polish-3-live-mobile-home.png`; live: `/demo`. |
| F-2-2 | Reset, request bodies/URLs, full backup equality, and exported-receipt import are all exercised by the claim tests. | Tests: `@claim:demo-isolation`, `@claim:private-network`, `@claim:backup-roundtrip`, `@claim:acknowledgement-receipt`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-2-3 | Sample asset links use stable GitHub, Netlify, and Cloudflare Registrar URLs. | Test: `sample provider links resolve without dead ends`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=assets`. |
| F-2-4 | The fact row is directly below sample entry and stays fully visible at 390 px; its commercial fact now states no purchase is required. | Test: `390px layout has no overflow and keeps the complete first screen visible`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-2-5 | Navigation, banner, footer, record, form, and legal targets meet the 44 px baseline. | Test: `390px touch targets meet the 44px baseline on every route`; image: `polish-3-live-mobile-home.png`; live: `/`, `/privacy/`, `/terms/`, `/404.html`, and demo stages. |
| F-2-6 | The 404 has OG/Twitter metadata and the sitemap lists all packet routes. | Tests: `metadata, shared links, and the styled 404 are complete`, config sitemap test; image: `polish-3-live-desktop-demo-assets.png`; live: `/404.html`. |
| F-2-7 | Preview and process headings name their purpose. | Test: `landing headings and workflow actions name their destinations`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-2-8 | Every stage action names its destination or source stage. | Test: `landing headings and workflow actions name their destinations`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=assets`. |
| F-2-9 | README presents practical browser-storage, test, and delivery outcomes before implementation terms. | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-mobile-home.png`; live: `/` and repository README. |

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Landing h1 names the job, names freelance developers and studios, puts sample first, and keeps creation after both passphrase fields. | Test: `390px layout has no overflow and keeps the complete first screen visible`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-2 | `/demo` and `?demo=1` seed the realistic Northstar packet in `demo:closeout-kit-v1` with banner, Reset, and exit. | Test: `@claim:demo-isolation`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-3 | Claims registry has 13 entries and exactly one tagged browser test per entry. | Test: clean-clone registry check and all exact claim commands; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-4 | Removed the unavailable Studio checkout and price offer; the complete workflow now truthfully states no purchase is required. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-5 | Added styled 404 content, host response override, and recovery links. | Tests: config 404 test and `metadata, shared links, and the styled 404 are complete`; image: `polish-3-live-desktop-demo-assets.png`; live: `/not-a-real-route`. |
| F-1-6 | Added stage URLs, history, reload restoration, focused h1s, route announcements, and route metadata. | Tests: `stage URLs restore state, titles, history, focus, and announcements`, `every demo route uses a product-first title and matching share metadata`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=assets`. |
| F-1-7 | Added CSP, anti-framing, permissions, nosniff, and referrer headers in deploy configuration. | Test: `sets security policies as response headers`; image: `polish-3-live/verify.json`; live: response headers on `/`. |
| F-1-8 | Hashed assets are one-year immutable; service worker is no-store. | Test: `sets immutable caching only for hashed assets`; image: `polish-3-live/verify.json`; live: `/assets/main-*.js` and `/sw.js`. |
| F-1-9 | Web manifest has the required MIME configuration. | Test: `sets the manifest MIME type and real 404 response`; image: `polish-3-live/verify.json`; live: `/manifest.webmanifest`. |
| F-1-10 | Secret validation preserves entered asset data, describes the error, and focuses the invalid field. | Test: `@claim:credential-rejection`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=assets`. |
| F-1-11 | Root and route titles/h1s are descriptive; demo titles now use the product-first pattern. | Tests: `stage URLs restore state, titles, history, focus, and announcements`, `every demo route uses a product-first title and matching share metadata`; image: `polish-3-live-mobile-home.png`; live: `/`, `/demo`. |
| F-1-12 | Added per-route canonical, OG/Twitter, SVG favicon, Apple icon, and social art. | Test: `metadata, shared links, and the styled 404 are complete`; image: `polish-3-live/verify.json`; live: `/`, `/privacy/`, `/terms/`, `/404.html`. |
| F-1-13 | Shared header/footer now provide skip link, Home/Demo/Privacy/Terms, product line, Param Factory credit, and build ID. | Test: `metadata, shared links, and the styled 404 are complete`; image: `polish-3-live-mobile-home.png`; live: `/`, `/privacy/`, `/terms/`, `/404.html`. |
| F-1-14 | Added filled preview, three-step process, literal limits, and removed unavailable paid copy. | Tests: `landing headings and workflow actions name their destinations`, `@claim:workflow-boundaries`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-15 | README and demo contract document entry, sample, reset, and isolated namespace. | Test: `@claim:demo-isolation`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-16 | Exported client form creates a matching acknowledgement receipt that imports into the packet. | Test: `@claim:acknowledgement-receipt`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=acknowledgement`. |
| F-1-17 | Replaced the departure slogan with literal client-handoff wording. | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-18 | Replaced ambiguous device wording with precise browser-storage wording. | Test: `@claim:private-network`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-19 | Removed the non-verbal inactive Studio price action. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-20 | Replaced implementation jargon with audience-specific tool wording. | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-21 | Replaced the credential metaphor with direct password-manager guidance. | Test: `@claim:credential-rejection`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=assets`. |
| F-1-22 | Renamed the sequence “Six packet stages.” | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-desktop-demo-assets.png`; live: `/`. |
| F-1-23 | Uses “Complete the packet in six stages.” | Test: `landing headings and workflow actions name their destinations`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-24 | Footer states the tested encryption outcome. | Test: `@claim:encrypted-storage`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-25 | Removed the Studio mood dialog. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-26 | README opens in plain browser-app language for the intended audience. | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-mobile-home.png`; live: repository README. |
| F-1-27 | README names the packet inputs and output directly. | Test: `@claim:packet-export`; image: `polish-3-live-desktop-demo-assets.png`; live: repository README. |
| F-1-28 | Terminology is standardized around assets, owners, access tasks, support dates, and acknowledgement. | Evidence: `.factory/copy-audit.md` terminology table; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-29 | README leads with encryption outcome before browser-storage detail. | Test: `@claim:encrypted-storage`; image: `polish-3-live-mobile-home.png`; live: `/privacy/`. |
| F-1-30 | Export controls name the purpose of each downloaded file. | Tests: `@claim:packet-export`, `@claim:backup-roundtrip`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=export`. |
| F-1-31 | Removed inactive billing/API copy and license runtime code. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-32 | Uses “original service” consistently for outside systems. | Test: `@claim:workflow-boundaries`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=access-tasks`. |
| F-1-33 | Split the README test copy into short practical sentences. | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-mobile-home.png`; live: repository README. |
| F-1-34 | Standardized app, packet, stage, access task, original service, and acknowledgement receipt. | Evidence: `.factory/copy-audit.md` terminology table; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-35 | Removed the unmeasurable title slogan. | Test: `metadata, shared links, and the styled 404 are complete`; image: `polish-3-live/verify.json`; live: `/`. |
| F-1-36 | Removed unsupported “secure” marketing copy; export and secret rejection are separately tested. | Tests: `@claim:packet-export`, `@claim:credential-rejection`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-37 | Demo and client HTML packet include all required packet sections. | Test: `@claim:packet-export`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=export`. |
| F-1-38 | Browser-storage and recovery copy is scoped and request-tested. | Tests: `@claim:private-network`, `@claim:recovery-boundary`; image: `polish-3-live-mobile-home.png`; live: `/privacy/`. |
| F-1-39 | Stored envelope contains ciphertext, never sample plaintext or passphrase. | Test: `@claim:encrypted-storage`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-40 | Demo remains account-free and isolated. | Test: `@claim:private-network`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-41 | Offline claim is precise and tested after the first visit. | Test: `@claim:offline-reload`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=export`. |
| F-1-42 | No-analytics/account statement is request-tested. | Test: `@claim:private-network`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-43 | Generated-art disclosure, shipped file, prompt, and provenance remain recorded. | Test: `@claim:art-provenance`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-44 | Removed unavailable one-time price claim. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-45 | Removed unverified paid entitlements. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-46 | Removed “No subscription” marketing claim. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-47 | Removed merchant/refund claim while checkout is unavailable. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-48 | Access tasks cannot complete before original-service confirmation. | Test: `@claim:access-confirmation`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=access-tasks`. |
| F-1-49 | Common secret patterns are rejected without losing valid form data. | Test: `@claim:credential-rejection`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=assets`. |
| F-1-50 | Passphrase stays out of stored plaintext and network requests; recovery is unavailable. | Tests: `@claim:encrypted-storage`, `@claim:private-network`, `@claim:recovery-boundary`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-51 | Encrypted backups restore full data and offline export works. | Tests: `@claim:backup-roundtrip`, `@claim:offline-reload`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo?stage=export`. |
| F-1-52 | Removed inactive paid-license claim. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-53 | Limitations are literal and registered as a claim. | Test: `@claim:workflow-boundaries`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-54 | Removed environment/backend marketing claim; README has only actionable local instructions. | Evidence: `.factory/copy-audit.md`; image: `polish-3-live-mobile-home.png`; live: repository README. |
| F-1-55 | `npm test` covers unit/config, build, browser, accessibility, mobile, export, privacy, and offline behavior. | Test: clean-clone `npm test` (12 unit/config, 21 browser); image: `polish-3-live/verify.json`; live: `/`. |
| F-1-56 | Playwright remains pinned to 1.58.2. | Test: clean-clone `npm ci`; image: `polish-3-live/verify.json`; live: `/`. |
| F-1-57 | Build creates `dist/index.html` at its root. | Test: clean-clone `npm run build`; image: `polish-3-live/verify.json`; live: `/`. |
| F-1-58 | PWA manifest and service worker build and deliver correctly. | Tests: config delivery tests and `@claim:offline-reload`; image: `polish-3-live/verify.json`; live: `/manifest.webmanifest`, `/sw.js`. |
| F-1-59 | Sample use remains account-free and analytics-free. | Test: `@claim:private-network`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-60 | Every demo request is same-origin GET-only with no body or packet text. | Test: `@claim:private-network`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-61 | Inactive license verification behavior is absent. | Test: `@claim:no-purchase-required`; image: `polish-3-live-mobile-home.png`; live: `/`. |
| F-1-62 | Wrong passphrase cannot unlock a packet and triggers no recovery request. | Test: `@claim:recovery-boundary`; image: `polish-3-live-desktop-demo-assets.png`; live: `/demo`. |
| F-1-63 | Node 20+ is declared and clean verification ran on Node 22.23.2. | Test: clean-clone `npm ci` and `npm test`; image: `polish-3-live/verify.json`; live: `/`. |

## Final acceptance evidence

- Fresh clone at `c5b2ce681fe39eef5abeaa2057c5668eb26007d9`: `npm ci`, all 13 exact `.factory/claims.json` commands from an empty `dist/`, `npm test`, and `npm run build` pass.
- `npm test` passes 12 unit/config tests and 21 Chromium tests. Its AxeBuilder coverage now audits root, Privacy, Terms, 404, and every demo stage with zero serious or critical violations.
- `verify-url.sh` cold check records a title, `lang=en`, one h1, main landmark, all image alt attributes, named buttons, and no console errors.
- The `@axe-core/cli` ChromeDriver runner cannot launch the preinstalled Playwright browser because the bundled driver is version 152 while the browser is 145; the product’s Playwright AxeBuilder suite is the executed accessibility verifier.
