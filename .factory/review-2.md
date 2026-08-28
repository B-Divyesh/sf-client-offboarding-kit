# Adversarial first-read review 2 — Closeout Kit

**Verdict: FAIL**  
**Reviewed:** 28 August 2026 UTC  
**Live URL:** <https://client-offboarding-kit.sociobot.in>  
**Candidate:** `24f7c3ba4b72bd6d176f9a39200e7d340e1e412c`

One blocking claim-test failure and eight additional findings remain. PASS requires zero findings and no untested claim.

## Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900. Nothing was scrolled or clicked before recording this result.

| Question | First-read answer | Result |
| --- | --- | --- |
| What does this do? | It builds a client closeout packet. | Clear from “Build a client closeout packet.” |
| For whom? | Freelance developers and web studios finishing client projects. | Clear from the sentence below the h1. |
| What should I click first? | “Try it with sample data.” | Clear and visible at both sizes. |

The required three questions are answerable, so the cold read is not blocking. At 390 × 844, however, all three fact lines are below the fold. The last visible content is the partly clipped “Create your packet” button. This is F-2-4.

## Findings

### Blocking

#### F-2-1 — The exact claim command fails from a clean clone

- **Location/quote:** every `.factory/claims.json` entry uses `npm run test:claims -- --grep @claim:<id>`. `package.json` defines `test:claims` as `playwright test --project=chromium --grep @claim`, while Playwright starts `vite preview` without first building `dist/`.
- **Evidence:** in a fresh local clone, after only `npm ci`, the first exact command timed out twice waiting for “Create a packet passphrase.” No `dist/` existed, so the preview did not render the app. This is a failing listed claim test and is blocking by the review contract.
- **Concrete fix:** make the registered command self-contained, for example with `pretest:claims: npm run build`, or make the Playwright web server build before previewing. Delete `dist/`, run every exact command in `.factory/claims.json`, and require all of them to pass without a preparatory manual build.

### Major

#### F-2-2 — Four advertised outcomes are not fully asserted by their tagged tests

- **Locations/quotes:** README: “Reset demo restores the sample”; claim `private-network`: “packet content stays in the browser”; claim `backup-roundtrip`: “restore a packet”; claim `acknowledgement-receipt`: “A client can create … a receipt file.”
- **Evidence:** `@claim:demo-isolation` never clicks Reset. `@claim:private-network` checks only that request origins match and does not inspect URLs or bodies for packet data. `@claim:backup-roundtrip` compares only the project name after import. `@claim:acknowledgement-receipt` looks for button text in the exported form, then imports a hand-written fixture instead of submitting the exported form and downloading its result.
- **Why it matters:** a passing tag can conceal a broken reset, leaked same-origin payload, partial restore, or unusable client form. “Every statement above maps to a tagged browser test” is therefore too broad.
- **Concrete fix:** extend the four existing uniquely tagged tests: click Reset after an edit; inspect every URL and request body for seeded packet/passphrase text; deep-compare every restored section; and run the exported form, download its receipt, then import that exact file. Keep one tag per claim.
- **Independent observation:** the live reset, same-origin GET-only request log, and complete acknowledgement round trip worked in this review. This finding is about the required durable claim proof, not a reproduced product failure.

#### F-2-3 — The demo contains three dead “Open original service” links

- **Location:** `/demo?stage=assets`; the Northstar sample links to `https://github.com/example/northstar-site`, `https://example.com/northstar-hosting`, and `https://example.com/northstar-domain`.
- **Evidence:** all three returned HTTP 404 during the live crawl.
- **Why it matters:** the demo presents these links as usable records. A first-time visitor who follows the sample reaches an error, and the site contract allows no dead links.
- **Concrete fix:** use stable, public, non-sensitive 200 URLs that demonstrate the service type, or render sample-only addresses as inert labelled examples rather than links. Add every seeded link to the crawl test.

#### F-2-4 — The mandatory three plain facts are below the phone first screen

- **Location:** root at 390 × 844. “Encrypted before saving,” “No account needed,” and “Works offline after the first visit” begin below the viewport.
- **Evidence:** the screenshot and element bounds place the primary action at 430 px, the passphrase form from 574 px, “Create your packet” at 812 px, and the fact list after it.
- **Why it matters:** the first-screen contract requires the headline, audience sentence, primary action, and three short privacy/offline/price facts in one screen. The current form consumes the remaining viewport before the facts.
- **Concrete fix:** place the three facts immediately below the sample action and before the passphrase form. Keep all three visible at 390 × 844 without hiding or shrinking essential copy.

#### F-2-5 — Many mobile touch targets are smaller than 44 px

- **Location/evidence:** at 390 px, header links measure about 19 px high; footer links 20–21 px; the brand 26–30 px; demo “Open original service” links 15 px; Reset and Start buttons 40 px. These occur on root, legal, 404, and demo routes.
- **Why it matters:** the attached accessibility baseline requires touch targets of at least 44 px. Small header and inline targets are easy to miss on a phone even though axe reports no serious or critical violation.
- **Concrete fix:** give navigation, footer, banner, and record links at least a 44 × 44 px clickable box, using padding and spacing without changing their visual weight. Add a 390 px target-size assertion across every route.

### Minor

#### F-2-6 — Route metadata and the sitemap are incomplete

- **Location:** `404.html` has a title, description, canonical, SVG favicon, and Apple icon, but no Open Graph or Twitter metadata. `public/sitemap.xml` lists `/`, `/demo`, `/privacy/`, and `/terms/`, but omits all six real `/packet/<stage>` routes.
- **Why it matters:** the route structure contract requires canonical/OG/favicon metadata per route and a sitemap listing every route.
- **Concrete fix:** add product-art OG/Twitter tags to the 404. List the six stage URLs in the sitemap, or document and test a deliberate `noindex` exclusion if private state routes must stay out of search results.

#### F-2-7 — Two landing h2s do not name their sections

- **Quotes:** “See the handoff before you start.” and “Prepare, confirm, and hand over.”
- **Why it matters:** these rely on nearby eyebrow text. Heard alone in a screen-reader heading list, neither names the sample preview or the three-step process.
- **Concrete rewrite:** “Preview a filled client packet.” and “Create and send a packet in three steps.”

#### F-2-8 — Workflow navigation uses generic button labels

- **Location/quote:** the demo repeatedly uses “Continue” and “Back.”
- **Why it matters:** these buttons do not name the result, contrary to the plain-words rule. “Continue” does not tell a visitor which stage will open.
- **Concrete fix:** use stage-specific actions such as “Review assets,” “Review access tasks,” “Set support dates,” and “Return to assets.”

#### F-2-9 — README deploy/test prose uses unexplained implementation terms

- **Quotes:** “IndexedDB,” “Chromium flows,” “offline reload,” “route rewrites,” and “manifest MIME type.”
- **Why it matters:** these are useful technical details, but the sentences do not first state the practical outcome in plain words.
- **Concrete rewrite:** “The sample uses separate browser storage (`demo:closeout-kit-v1`).” “The tests open the app in Chromium and check accessibility, phone layout, exports, and offline use.” “The hosting config keeps app URLs, the 404 page, security headers, caches, and manifest delivery working.”

## Demo and sandbox

The demo itself passes the behavioral inspection:

- The root has a one-click “Try it with sample data” link.
- The first demo screen shows Northstar Arts website, Northstar Arts Council, Tideway Web Studio, a closeout date, and a filled outcome summary.
- The persistent banner reads “Demo — sample data, nothing is saved,” with Reset demo and Start for real.
- A fresh direct `/demo` context created only `demo:closeout-kit-v1`, not `closeout-kit-v1`.
- Editing then resetting restored “Northstar Arts website.”
- The isolation test created a real packet, changed the sample, exited, and recovered the unchanged real packet.
- Observed demo traffic was same-origin GET traffic for the document, JS, and CSS. No analytics or third-party runtime request appeared.
- After service-worker control, an offline reload returned to the filled export stage and remained usable.

F-2-1 and F-2-2 still prevent the sandbox from satisfying the verification contract.

## Claims audit

The exact command for `demo-isolation` was run first after `npm ci` in a fresh clone and failed because `dist/` was absent. After one explicit `npm run build`, every listed filter was run and its underlying assertion passed.

| Claim ID | Exact clean-clone command | After manual build | Scope check |
| --- | --- | --- | --- |
| `demo-isolation` | **FAIL** — two 30 s timeouts before UI rendered | PASS | Reset is not asserted. |
| `encrypted-storage` | Blocked by shared missing-build setup | PASS | Stored envelope excludes sample plaintext and passphrase. |
| `offline-reload` | Blocked by shared missing-build setup | PASS | Offline reload and export observed. |
| `private-network` | Blocked by shared missing-build setup | PASS | Does not assert packet text is absent from URLs/bodies. |
| `credential-rejection` | Blocked by shared missing-build setup | PASS | Preserves fields and focuses the error. |
| `access-confirmation` | Blocked by shared missing-build setup | PASS | Completion is blocked until confirmation. |
| `packet-export` | Blocked by shared missing-build setup | PASS | All packet sections are inspected. |
| `backup-roundtrip` | Blocked by shared missing-build setup | PASS | Only project name is compared after restore. |
| `acknowledgement-receipt` | Blocked by shared missing-build setup | PASS | Imports a fabricated receipt rather than one produced by the form. |
| `workflow-boundaries` | Blocked by shared missing-build setup | PASS | Exact limits copy is present. |
| `recovery-boundary` | Blocked by shared missing-build setup | PASS | Wrong passphrase and no recovery request are checked. |
| `art-provenance` | Blocked by shared missing-build setup | PASS | Shipped art and provenance record are checked. |

No additional live landing product claim lacked a registry entry. The README Reset sentence is an unlisted/untested part of the demo claim, covered by F-2-2. Developer-operation statements were verified by `npm test` and build inspection rather than treated as customer-facing product claims.

## Copy audit

Counts are whitespace-delimited after Markdown markers are removed. Commands in fenced blocks are excluded. No sentence exceeds 22 words, and no banned marketing word appears. Flags refer to findings above.

### Landing page

| # | Words | Copy | Result |
| ---: | ---: | --- | --- |
| 1 | 4 | Skip to main content | Pass |
| 2 | 2 | Closeout Kit | Pass |
| 3 | 3 | Client handoff packets | Pass |
| 4 | 1 | Home | Pass |
| 5 | 1 | Demo | Pass |
| 6 | 1 | Privacy | Pass |
| 7 | 1 | Terms | Pass |
| 8 | 7 | Client handoff tool for freelancers and studios | Pass |
| 9 | 5 | Build a client closeout packet. | Pass |
| 10 | 11 | For freelance developers and web studios handing finished projects to clients. | Pass |
| 11 | 5 | Try it with sample data | Pass |
| 12 | 9 | Opens a filled six-stage packet; your packets stay unchanged. | Pass |
| 13 | 4 | Create a packet passphrase | Pass |
| 14 | 2 | Confirm passphrase | Pass |
| 15 | 14 | Use at least 10 characters. Keep the passphrase because the app cannot recover it. | Pass |
| 16 | 3 | Create your packet | Pass |
| 17 | 3 | Encrypted before saving | Pass; placement F-2-4 |
| 18 | 3 | No account needed | Pass; placement F-2-4 |
| 19 | 6 | Works offline after the first visit | Pass; placement F-2-4 |
| 20 | 3 | Filled packet preview | Pass |
| 21 | 6 | See the handoff before you start. | F-2-7 |
| 22 | 14 | The sample shows assets, owners, access tasks, support dates, and acknowledgement in one packet. | Pass |
| 23 | 4 | Open the sample packet | Pass |
| 24 | 3 | Six packet stages | Pass |
| 25 | 6 | Complete the packet in six stages. | Pass |
| 26 | 1 | Engagement | Pass |
| 27 | 1 | Assets | Pass |
| 28 | 2 | Access tasks | Pass |
| 29 | 1 | Support | Pass |
| 30 | 1 | Acknowledgement | Pass |
| 31 | 1 | Export | Pass |
| 32 | 3 | How it works | Pass |
| 33 | 5 | Prepare, confirm, and hand over. | F-2-7 |
| 34 | 4 | 1. List the project. | Pass |
| 35 | 7 | Add asset links, owners, and support dates. | Pass |
| 36 | 4 | 2. Confirm access tasks. | Pass |
| 37 | 7 | Check each change in the original service. | Pass |
| 38 | 4 | 3. Send the packet. | Pass |
| 39 | 8 | Export the packet and import the client’s receipt. | Pass |
| 40 | 3 | Privacy and limits | Pass |
| 41 | 6 | Keep credentials out of the packet. | Pass |
| 42 | 6 | The app rejects common secret patterns. | Pass |
| 43 | 6 | Share credentials through your password manager. | Pass |
| 44 | 14 | It does not move accounts, host files, migrate a CMS, or test client access. | Pass |
| 45 | 12 | Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 46 | 6 | Closeout Kit builds client handoff packets. | Pass |
| 47 | 9 | Packet data is encrypted before this browser saves it. | Pass |
| 48 | 4 | Built by Param Factory | Pass |
| 49 | 2 | Generated artwork | Pass |
| 50 | 17 | A quiet harbor seen from a dark operations room, with a closed document case ready for handoff | Pass; image alt |
| 51 | 7 | Closeout Kit — build client handoff packets | Pass; title |
| 52 | 14 | Build a client packet with asset links, owners, access tasks, support dates, and acknowledgement. | Pass; meta description |

The landing buttons “Try it with sample data,” “Create your packet,” and “Open the sample packet” name their results. Demo-stage navigation is separately flagged in F-2-8.

### README

| # | Words | Copy | Result |
| ---: | ---: | --- | --- |
| 1 | 2 | Closeout Kit | Pass |
| 2 | 15 | Closeout Kit is a browser app for freelance developers and web studios finishing client projects. | Pass |
| 3 | 15 | It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement. | Pass |
| 4 | 2 | Live product | Pass |
| 5 | 4 | Try the isolated sample | Pass |
| 6 | 3 | What it does | Pass |
| 7 | 11 | Collect project details, assets, owners, account tasks, support dates, and acknowledgement. | Pass |
| 8 | 10 | Require confirmation of each access task in the original service. | Pass |
| 9 | 7 | Reject common password, API-token, and private-key patterns. | Pass |
| 10 | 10 | Encrypt packets in the browser before saving them in IndexedDB. | F-2-9 |
| 11 | 13 | Download a client HTML packet, an encrypted backup, and a client acknowledgement form. | Pass |
| 12 | 7 | Import encrypted backups and client acknowledgement receipts. | Pass |
| 13 | 7 | Keep working offline after the first visit. | Pass |
| 14 | 15 | The app does not move accounts, host files, migrate a CMS, or test client access. | Pass |
| 15 | 12 | Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 16 | 11 | Every statement above maps to a tagged browser test in `.factory/claims.json`. | F-2-1/F-2-2 |
| 17 | 3 | Try the sample | Pass |
| 18 | 12 | Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet. | Pass |
| 19 | 5 | The banner identifies sample mode. | Pass |
| 20 | 12 | “Reset demo” restores the sample, and “Start for real” removes sample storage. | F-2-2 |
| 21 | 8 | Sample data uses the separate `demo:closeout-kit-v1` IndexedDB database. | F-2-9 |
| 22 | 6 | It never reads or writes `closeout-kit-v1`. | Pass |
| 23 | 9 | See `.factory/demo.md` for the sample contents and reset contract. | Pass |
| 24 | 2 | Run locally | Pass |
| 25 | 5 | Use Node.js 20 or newer. | Pass |
| 26 | 6 | Open the URL printed by Vite. | Pass |
| 27 | 3 | Test and build | Pass |
| 28 | 10 | `npm test` runs unit tests and creates a production build. | Pass; verified |
| 29 | 12 | It also checks Chromium flows, accessibility, mobile layout, exports, and offline reload. | F-2-9 |
| 30 | 10 | The build output is `dist/`, with `dist/index.html` at its root. | Pass; verified |
| 31 | 1 | Deploy | Pass |
| 32 | 8 | Deploy `dist/` as an Azure Static Web App. | Pass; platform name |
| 33 | 5 | The factory work order uses: | Pass |
| 34 | 15 | `staticwebapp.config.json` supplies route rewrites, the 404 response, security headers, cache rules, and manifest MIME type. | F-2-9 |
| 35 | 3 | Privacy and recovery | Pass |
| 36 | 8 | Closeout Kit has no analytics or product account. | Pass |
| 37 | 13 | Packet content stays in the browser unless you export and share a file. | F-2-2 test scope |
| 38 | 9 | Keep the encrypted JSON backup and its passphrase separately. | Pass |
| 39 | 5 | See the hosted privacy page. | Pass |
| 40 | 2 | Project notes | Pass |
| 41 | 5 | Visual system and generated-art provenance | Pass |
| 42 | 2 | Verification evidence | Pass |
| 43 | 1 | License | Pass |

Terminology is otherwise consistent: **app** for the product, **packet** for the artifact, **stage** for the workflow division, **access task** for account work, **original service** for the outside system, and **acknowledgement receipt** for the returned confirmation.

## Structure, accessibility, and visual identity

- Root, demo stages, Privacy, Terms, and the designed 404 have `lang=en`, one h1, a main landmark, ordered headings, skip links, and route-specific titles.
- Root/Privacy/Terms/demo have descriptions, canonical links, OG/Twitter cards, SVG favicons, and Apple icons. The 404 exception is F-2-6.
- Deep demo links load the requested stage. Back returns to the prior stage, focuses its h1, and updates the polite announcer. Offline reload also restores the requested stage after the app settles.
- Unknown paths return the designed 404 with HTTP 404. Security, framing, permissions, manifest MIME, immutable asset cache, and no-store service-worker headers are live.
- Axe checks on root, six demo stages, Privacy, Terms, and the 404 at 390 px and desktop found zero serious or critical violations. The manual target-size failure is F-2-5.
- No console or page errors occurred. `/opt/fleet/lib/verify-url.sh` passed title, language, h1, main, alt, button-name, and console checks.
- The JS bundle is 46.63 KB raw / 15.60 KB gzip; CSS is 19.00 KB raw / 5.01 KB gzip.
- The harbor operations-room art, dark teal/amber palette, serif/sans pairing, clipped surfaces, and instrument-like stage rail remain distinctive and match `.factory/design.md`. This is not a generic SaaS template.

## Earlier-history recheck

Every F-1 finding was checked against the live site and current source rather than accepted from `.factory/polish-1.md`.

| Earlier ID | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 | Job h1, audience, sample action, and correctly ordered passphrase controls are live. | Fixed |
| F-1-2 | Filled `/demo`, banner, Reset/exit, demo-only database, and `.factory/demo.md` confirmed. | Fixed |
| F-1-3 | Twelve registry entries and twelve unique tags exist. Clean invocation has a new runner defect, F-2-1. | Fixed as originally scoped |
| F-1-4 | Studio price, checkout, license, and merchant offer are absent. | Fixed |
| F-1-5 | Unknown paths and `/404.html` return the designed page with HTTP 404. | Fixed |
| F-1-6 | Stage URLs, titles, reload, Back, h1 focus, and announcement work. | Fixed |
| F-1-7 | Live CSP, frame denial, Permissions-Policy, nosniff, and referrer headers confirmed. | Fixed |
| F-1-8 | Hashed JS/CSS return one-year immutable caching; `sw.js` is no-store. | Fixed |
| F-1-9 | Manifest returns `application/manifest+json`. | Fixed |
| F-1-10 | Credential rejection preserves valid asset fields and focuses the invalid note. | Fixed |
| F-1-11 | Plain root title/h1 and stage-specific titles/h1s confirmed. | Fixed |
| F-1-12 | Root, Privacy, and Terms canonical/OG/Twitter/icons/social art confirmed. | Fixed |
| F-1-13 | Shared Home/Demo/Privacy/Terms chrome, skip link, one-liner, factory credit, and build ID confirmed. | Fixed |
| F-1-14 | Preview, three-step process, limits/privacy, and no unavailable paid tier confirmed. | Fixed |
| F-1-15 | README and `.factory/demo.md` document entry, sample, reset, and namespace. | Fixed |
| F-1-16 | Exported form was submitted; its downloaded receipt imported into the live demo. | Fixed |
| F-1-17 | “Departure without loose ends” is absent; “Client handoff packets” is used. | Fixed |
| F-1-18 | “Packet data stays in this browser” replaces “On device.” | Fixed |
| F-1-19 | The non-verbal Studio price action is absent. | Fixed |
| F-1-20 | Audience-specific “Client handoff tool…” replaces local-first workspace jargon. | Fixed |
| F-1-21 | Credential guidance is direct and the vault metaphor is absent. | Fixed |
| F-1-22 | “Six packet stages” replaces “closeout route.” | Fixed |
| F-1-23 | “Complete the packet in six stages” replaces the marketing heading. | Fixed |
| F-1-24 | Footer states the tested encryption outcome. | Fixed |
| F-1-25 | Studio dialog and mood heading are absent. | Fixed |
| F-1-26 | README opens with “browser app” and names its audience. | Fixed |
| F-1-27 | README names the packet inputs directly. | Fixed |
| F-1-28 | README uses assets, owners, access tasks, support dates, and acknowledgement. | Fixed |
| F-1-29 | README leads with the encryption outcome before naming IndexedDB. | Fixed |
| F-1-30 | Export formats and purposes are stated directly. | Fixed |
| F-1-31 | Billing/API copy and runtime license module are absent. | Fixed |
| F-1-32 | “Original service” terminology is used consistently. | Fixed |
| F-1-33 | The former 28-word test sentence is split; neither sentence exceeds 22 words. | Fixed |
| F-1-34 | App/packet/stage/access task/original service/receipt terminology is consistent. | Fixed |
| F-1-35 | “Leave every client in control” is absent from the title and source. | Fixed |
| F-1-36 | “Secure” is absent from the meta claim; export and secret rejection are separate. | Fixed |
| F-1-37 | Demo contains every section; downloaded HTML contains them. | Fixed |
| F-1-38 | Browser-storage and recovery wording is scoped; live requests and wrong-passphrase flow checked. | Fixed |
| F-1-39 | Plain encryption wording is used; stored demo envelope contains ciphertext, not sample plaintext. | Fixed |
| F-1-40 | “No account needed” remains and demo needs no authentication. | Fixed |
| F-1-41 | Precise first-visit offline claim survives live offline reload/export. | Fixed |
| F-1-42 | No analytics/account claim is registered; live demo traffic was same-origin only. | Fixed |
| F-1-43 | Generated-art disclosure, shipped art, prompt, and provenance are present. | Fixed |
| F-1-44 | One-time price claim is absent. | Fixed |
| F-1-45 | Paid entitlement claim is absent. | Fixed |
| F-1-46 | “No subscription” is absent. | Fixed |
| F-1-47 | Merchant/refund copy is absent. | Fixed |
| F-1-48 | Live access-task completion is blocked until original-service confirmation. | Fixed |
| F-1-49 | Secret patterns are rejected across packet forms; asset fields remain intact. | Fixed |
| F-1-50 | Passphrase is absent from stored plaintext and requests; no recovery endpoint appears. | Fixed |
| F-1-51 | Backup import and offline reload/export pass. Test depth is now covered by F-2-2. | Fixed as behavior |
| F-1-52 | Paid-license claim is absent. | Fixed |
| F-1-53 | Limits are literal on landing/README and have a tagged assertion. | Fixed |
| F-1-54 | Environment/backend marketing claim is absent. | Fixed |
| F-1-55 | README test sentence is split; `npm test` passed all named categories. | Fixed |
| F-1-56 | Playwright is exactly pinned in package and lock; prose claim is absent. | Fixed |
| F-1-57 | Clean build produced `dist/index.html`. | Fixed |
| F-1-58 | Service worker and manifest build/delivery checks pass. | Fixed |
| F-1-59 | Account-free and analytics-free behavior is registered and observed. | Fixed |
| F-1-60 | Full live demo log contained only same-origin GETs and no request bodies. Durable assertion gap is F-2-2. | Fixed as behavior |
| F-1-61 | License verification behavior and claim are absent. | Fixed |
| F-1-62 | Wrong passphrase cannot unlock and no recovery request occurs. | Fixed |
| F-1-63 | `engines.node` requires Node 20+; review ran on Node 22.23.2. | Fixed |

No earlier ID is reissued: each original defect is fixed in behavior or copy. New gaps are identified above with F-2 IDs.

## Missed leverage and AI

No missed-leverage finding. The product already exports a browser-readable packet, encrypted backup, acknowledgement form, and receipt; it imports backups and receipts. Sync would conflict with the local-only privacy model unless introduced as a clearly optional system. The structured checklist does not need AI, and no decorative AI, provider key, Azure endpoint, or model call is present.

## Verification summary

- Fresh-clone `npm ci`: PASS.
- First exact registered claim command before build: **FAIL**; see F-2-1.
- `npm run build`: PASS; `dist/` produced.
- All 12 exact claim filters after that manual build: PASS.
- Fresh-clone `npm test`: PASS — 10 unit/config tests, build, and 16 Chromium tests.
- Live axe: zero serious/critical violations across root, six demo stages, Privacy, Terms, and 404 at phone and desktop sizes.
- Live crawl: internal routes and Source return expected statuses; three sample service links return 404 (F-2-3).
- Live 404, headers, manifest MIME, asset caching, service worker, route history/focus, request log, reset, storage namespace, offline reload, and acknowledgement round trip were checked independently.

## What would make this perfect

Make claim commands runnable from a clean clone; strengthen the four under-scoped claim tests; replace or de-link the three dead sample URLs; move the three facts into the 390 px first screen; enlarge every touch target; complete 404 metadata and route sitemap coverage; and replace the vague headings, generic stage buttons, and unexplained README terms. Then rerun this entire review from empty browser storage and a new clone. Nothing else observed in this round needs product expansion.
