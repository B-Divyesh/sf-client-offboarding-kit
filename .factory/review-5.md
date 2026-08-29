# Adversarial first-read review 5 — Closeout Kit

**Verdict: PASS**
**Reviewed:** 2026-08-29 UTC
**Live URL:** <https://client-offboarding-kit.sociobot.in>
**Reviewed commit:** `485f71abf98cf3e52df052334070ce45d86d7d21`

No blocking, major, minor, unlisted-claim, or untested-claim finding remains. This verdict follows a new cold live review, a clean-clone claim run, a live browser suite, source inspection, link crawl, and recheck of every prior finding.

## Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900. No scrolling or interaction occurred before recording these answers.

| Question | First-read answer | Result |
| --- | --- | --- |
| What does this do? | It builds a client closeout packet. | Clear from “Build a client closeout packet.” |
| For whom? | Freelance developers and web studios handing finished projects to clients. | Clear from the next sentence. |
| What should I click first? | “Try it with sample data.” | Clear; adjacent text says it opens a filled six-stage packet while existing packets stay unchanged. |

The h1, audience, primary sample action, and the three facts (“Encrypted before saving”, “No purchase required”, and “Works offline after the first visit”) were all visible before the 390 px fold. The first screen is equally clear on desktop.

## Demo, sandbox, privacy, and claims

- `/demo` immediately opens the filled Northstar Arts website packet. Its first stage contains the project, client, preparer, date, and outcome summary rather than an empty setup screen.
- The persistent banner reads “Demo — sample data, nothing is saved”, explains that changes stay separate, and exposes working **Reset demo** and **Start for real** actions.
- A fresh live context opened only `demo:closeout-kit-v1`. Editing the sample and waiting for the app’s save cycle, then selecting Reset, restored `Northstar Arts website`. The isolation test additionally created a real packet, left demo, unlocked the real packet unchanged, and confirmed demo storage was deleted.
- The live request log for the demo contained only same-origin GET requests with empty bodies. It contained no sample text, passphrase, account, analytics, or third-party product request. The offline claim test reloaded the service-worker-controlled demo offline and downloaded the client packet.
- The client acknowledgement export produced a receipt which the sample packet imported. Encrypted backup export/import restored the complete packet, and a client HTML export contained every packet section.

`.factory/claims.json` contains 13 unique claims. In a new clean clone at `/tmp/client-offboarding-kit-review-5.B1YmPA/repo`, `npm ci`, then every exact command named by the registry, `npm test`, and `npm run build` passed. The final Playwright result was `{"status":"passed","failedTests":[]}`. The live-origin suite also passed all 22 tests.

| Claim ID | Exact registered clean-clone command | Result |
| --- | --- | --- |
| `demo-isolation` | `npm run test:claims -- --grep @claim:demo-isolation` | Pass |
| `encrypted-storage` | `npm run test:claims -- --grep @claim:encrypted-storage` | Pass |
| `offline-reload` | `npm run test:claims -- --grep @claim:offline-reload` | Pass |
| `private-network` | `npm run test:claims -- --grep @claim:private-network` | Pass |
| `no-purchase-required` | `npm run test:claims -- --grep @claim:no-purchase-required` | Pass |
| `credential-rejection` | `npm run test:claims -- --grep @claim:credential-rejection` | Pass |
| `access-confirmation` | `npm run test:claims -- --grep @claim:access-confirmation` | Pass |
| `packet-export` | `npm run test:claims -- --grep @claim:packet-export` | Pass |
| `backup-roundtrip` | `npm run test:claims -- --grep @claim:backup-roundtrip` | Pass |
| `acknowledgement-receipt` | `npm run test:claims -- --grep @claim:acknowledgement-receipt` | Pass |
| `workflow-boundaries` | `npm run test:claims -- --grep @claim:workflow-boundaries` | Pass |
| `recovery-boundary` | `npm run test:claims -- --grep @claim:recovery-boundary` | Pass |
| `art-provenance` | `npm run test:claims -- --grep @claim:art-provenance` | Pass |

Every live product claim maps to one of those entries: demo separation/reset/exit, encrypted storage, offline reload, privacy/account/analytics behavior, no-purchase creation/export, secret rejection, original-service confirmation, packet/backup/receipt exports, workflow limits, unrecoverable passphrases, and art provenance. No unlisted live claim was found.

## Copy audit

Counts are whitespace-delimited words; headings, labels, buttons, title, description, and meaningful alt text are included because a visitor encounters them. URLs and fenced commands are excluded. No item exceeds 22 words, contains banned marketing language, uses an empty mood heading, changes a core term, or uses a result-less button. No rewrite is required.

### Landing page

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Pass |
| 2 | Closeout Kit | Pass |
| 3 | Client handoff packets | Pass |
| 6 | Packet data stays in this browser | Pass |
| 1 each | Home; Demo; Privacy; Terms | Pass |
| 7 | Client handoff tool for freelancers and studios | Pass |
| 6 | Build a client closeout packet. | Pass |
| 11 | For freelance developers and web studios handing finished projects to clients. | Pass |
| 5 | Try it with sample data | Pass |
| 9 | Opens a filled six-stage packet; your packets stay unchanged. | Pass |
| 3 each | Encrypted before saving; No purchase required | Pass |
| 6 | Works offline after the first visit | Pass |
| 4; 2 | Create a packet passphrase; Confirm passphrase | Pass |
| 5; 9 | Use at least 10 characters.; Keep the passphrase because the app cannot recover it. | Pass |
| 3 | Create your packet | Pass |
| 3; 5 | Filled packet preview; Preview a filled client packet. | Pass |
| 14 | The sample shows assets, owners, access tasks, support dates, and acknowledgement in one packet. | Pass |
| 4 | Open the sample packet | Pass |
| 3; 2; 3; 4; 2 | Northstar Arts website; 3 assets; 2 access tasks; Support through 27 September; Sample data | Pass |
| 3; 6 | Six packet stages; Complete the packet in six stages. | Pass |
| 1; 1; 2; 1; 1; 1 | Engagement; Assets; Access tasks; Support; Acknowledgement; Export | Pass |
| 3; 8 | How it works; Create and send a packet in three steps. | Pass |
| 4; 7 | 1. List the project.; Add asset links, owners, and support dates. | Pass |
| 4; 7 | 2. Confirm access tasks.; Check each change in the original service. | Pass |
| 4; 8 | 3. Send the packet.; Export the packet and import the client’s receipt. | Pass |
| 3; 6 | Privacy and limits; Keep credentials out of the packet. | Pass |
| 6; 6 | The app rejects common secret patterns.; Share credentials through your password manager. | Pass |
| 14; 12 | It does not move accounts, host files, migrate a CMS, or test client access.; Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 6; 9 | Closeout Kit builds client handoff packets.; Packet data is encrypted before this browser saves it. | Pass |
| 1; 1; 1; 2 | Privacy; Terms; Source; opens externally | Pass |
| 8 | Built by Param Factory · Build 1.2.2 · Generated artwork | Pass |
| 17 | A quiet harbor seen from a dark operations room, with a closed document case ready for handoff | Pass — alt text |
| 6 | Closeout Kit — build client handoff packets | Pass — title |
| 14 | Build a client packet with asset links, owners, access tasks, support dates, and acknowledgement. | Pass — description |

The demo-specific visitor copy also passes: “Demo — sample data, nothing is saved” (7), “Changes stay separate from your packets.” (6), “Reset demo” (2), and “Start for real” (3).

### README

| Words | Copy | Result |
| ---: | --- | --- |
| 2 | Closeout Kit | Pass |
| 15 | Closeout Kit is a browser app for freelance developers and web studios finishing client projects. | Pass |
| 15 | It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement. | Pass |
| 2; 4; 3 | Live product; Try the isolated sample; What it does | Pass |
| 11; 10; 7 | Collect project details, assets, owners, account tasks, support dates, and acknowledgement.; Require confirmation of each access task in the original service.; Reject common password, API-token, and private-key patterns. | Pass |
| 13; 13; 7 | Encrypt packets in the browser before saving them in browser storage (technical: IndexedDB).; Download a client HTML packet, an encrypted backup, and a client acknowledgement form.; Import encrypted backups and client acknowledgement receipts. | Pass |
| 7; 7 | Keep working offline after the first visit.; Create and export a packet without purchase. | Pass |
| 15; 12 | The app does not move accounts, host files, migrate a CMS, or test client access.; Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 12 | Every customer-facing statement above maps to one tagged browser test in `.factory/claims.json`. | Pass |
| 3; 12; 5 | Try the sample; Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet.; The banner identifies sample mode. | Pass |
| 12; 9; 6 | “Reset demo” restores the sample, and “Start for real” removes sample storage.; The sample uses separate browser storage (technical name: `demo:closeout-kit-v1`).; It never reads or writes `closeout-kit-v1`. | Pass |
| 9 | See `.factory/demo.md` for the sample contents and reset contract. | Pass |
| 2; 5; 6 | Run locally; Use Node.js 20 or newer.; Open the URL printed by Vite. | Pass |
| 3; 10; 16; 10 | Test and build; `npm test` runs unit tests and creates a production build.; The tests open the app in Chromium and check accessibility, phone layout, exports, and offline use.; The build output is `dist/`, with `dist/index.html` at its root. | Pass |
| 1; 8; 5; 17 | Deploy; Deploy `dist/` as an Azure Static Web App.; The factory work order uses:; The hosting file keeps app URLs, the 404 page, security headers, caches, and web-app manifest delivery working. | Pass |
| 3; 8; 13; 9; 5 | Privacy and recovery; Closeout Kit has no analytics or product account.; Packet content stays in the browser unless you export and share a file.; Keep the encrypted JSON backup and its passphrase separately.; See the hosted privacy page. | Pass |
| 2; 5; 2; 2 | Project notes; Visual system and generated-art provenance; Verification evidence; License: MIT | Pass |

Terminology remains consistent: **app**, **packet**, **stage**, **access task**, **original service**, and **acknowledgement receipt** each have one meaning.

## Structure, accessibility, delivery, and missed leverage

- The root, demo, all six demo stages, Privacy, Terms, 404, and unlocked real stages have one h1, a main landmark, `lang="en"`, route titles, descriptions, canonical links, OG/Twitter metadata, favicon, and Apple touch icon. Demo and real stage titles use the product-first pattern.
- Deep links restore their stage. Back/Forward restores the prior stage, moves focus to its h1, and announces it. The live 22-test suite verifies that behavior.
- The shared header has Home, Demo, Privacy, Terms, and a skip link; the shared footer supplies the product line, legal links, factory credit, and version.
- The full crawl returned 200 for root, demo, all six packet routes, legal pages, manifest, Source, and each sample provider link. `/not-a-real-route` and `/404.html` intentionally returned the designed HTTP 404 page.
- Live headers include the restrictive CSP with `frame-ancestors 'none'`, frame denial, nosniff, referrer and permissions policies. The manifest is `application/manifest+json`, hashed JS is one-year immutable, and `sw.js` is no-store.
- Live Axe/keyboard/mobile checks in the full suite passed. The 390 px checks found no horizontal overflow and no visible interactive target below 44 px.
- The harbor control-room art, dark teal/amber palette, serif/sans pairing, clipped surfaces, and low-motion operating grammar match `.factory/design.md` and are distinct from a generic SaaS template.
- No obvious product capability is absent: import/export, encrypted backup restore, offline operation, and a client acknowledgement return path are present. AI would not make this bounded local workflow more honest or useful; no decorative AI, provider key, or model call is present.

## Earlier-history recheck

Every earlier review, polish record, and the previous handoff was read. Each prior finding was checked in both current source and live behavior; none is merely accepted from a prior “fixed” note.

| Earlier ID | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Job h1, audience, sample action, ordering, and first-screen facts are live at both viewports. | Fixed |
| F-1-2 | Filled demo, banner, Reset, exit, namespace isolation, and documentation work. | Fixed |
| F-1-3 | Registry has 13 unique IDs/tags; every exact clean-clone command passes. | Fixed |
| F-1-4 | No Studio checkout, price, or inactive purchase offer remains. | Fixed |
| F-1-5 | Unknown URLs and `/404.html` render the designed HTTP 404. | Fixed |
| F-1-6 | Stage URLs, reload, history, focus, and announcement pass live. | Fixed |
| F-1-7 | Live CSP, frame denial, permissions, nosniff, and referrer policies are present. | Fixed |
| F-1-8 | Hashed assets are immutable and `sw.js` is no-store. | Fixed |
| F-1-9 | Manifest content type is `application/manifest+json`. | Fixed |
| F-1-10 | Credential rejection preserves valid fields and focuses the error. | Fixed |
| F-1-11 | Root and every real/demo stage have descriptive product-first title/h1 pairs. | Fixed |
| F-1-12 | Canonical, OG/Twitter, favicon, Apple icon, and social art are live. | Fixed |
| F-1-13 | Shared header/footer, skip link, factory credit, and build label are present. | Fixed |
| F-1-14 | Filled preview, three-step process, literal limits, and no unavailable paid section are live. | Fixed |
| F-1-15 | README and demo contract document entry, sample, reset/exit, and namespace. | Fixed |
| F-1-16 | Client form produces an acknowledgement receipt that imports into the packet. | Fixed |
| F-1-17 | Literal “Client handoff packets” replaces the former mood slogan. | Fixed |
| F-1-18 | Header state precisely scopes packet data to this browser. | Fixed |
| F-1-19 | The non-verbal Studio price control is absent. | Fixed |
| F-1-20 | The audience-specific label replaces implementation jargon. | Fixed |
| F-1-21 | Credential guidance is literal and directs users to a password manager. | Fixed |
| F-1-22 | “Six packet stages” names the sequence. | Fixed |
| F-1-23 | The six-stage heading is literal and descriptive. | Fixed |
| F-1-24 | Footer uses the tested encrypted-storage statement. | Fixed |
| F-1-25 | The Studio mood dialog is absent. | Fixed |
| F-1-26 | README opens in plain browser-app language and identifies the audience. | Fixed |
| F-1-27 | README names packet inputs and outcome directly. | Fixed |
| F-1-28 | Core workflow terms remain consistent. | Fixed |
| F-1-29 | Encryption outcome precedes the IndexedDB technical detail. | Fixed |
| F-1-30 | Export labels name client HTML, PDF, backup, and acknowledgement outcomes. | Fixed |
| F-1-31 | Billing/API copy and runtime license code are absent. | Fixed |
| F-1-32 | “Original service” remains the sole external-system term. | Fixed |
| F-1-33 | README test prose is split and stays under the cap. | Fixed |
| F-1-34 | App/packet/stage/access-task/receipt vocabulary remains consistent. | Fixed |
| F-1-35 | The unmeasurable old title slogan is absent. | Fixed |
| F-1-36 | Unsupported “secure” marketing copy is absent. | Fixed |
| F-1-37 | Demo and client HTML export contain every packet section. | Fixed |
| F-1-38 | Privacy/recovery wording is narrowly scoped and request-tested. | Fixed |
| F-1-39 | Demo storage is encrypted ciphertext without sample plaintext/passphrase. | Fixed |
| F-1-40 | Full sample workflow needs no account. | Fixed |
| F-1-41 | First-visit offline reload and export pass. | Fixed |
| F-1-42 | No analytics/account behavior is request-tested. | Fixed |
| F-1-43 | Generated-art disclosure, shipped file, prompt, and provenance are present. | Fixed |
| F-1-44 | Unavailable one-time price claim is absent. | Fixed |
| F-1-45 | Unverified paid entitlement claim is absent. | Fixed |
| F-1-46 | “No subscription” claim is absent. | Fixed |
| F-1-47 | Merchant/refund claim is absent. | Fixed |
| F-1-48 | Access completion is blocked until original-service confirmation. | Fixed |
| F-1-49 | Secret patterns are rejected without losing valid data. | Fixed |
| F-1-50 | Passphrases do not enter storage/network and have no recovery path. | Fixed |
| F-1-51 | Backup restore and offline export pass. | Fixed |
| F-1-52 | Paid-license claim is absent. | Fixed |
| F-1-53 | Literal workflow limits are registered and tested. | Fixed |
| F-1-54 | Unsupported environment/backend marketing claim is absent. | Fixed |
| F-1-55 | Clean `npm test` passes its unit, build, browser, accessibility, mobile, export, privacy, and offline checks. | Fixed |
| F-1-56 | Playwright is pinned to 1.58.2. | Fixed |
| F-1-57 | Build produces `dist/index.html`. | Fixed |
| F-1-58 | Service worker and manifest build/delivery checks pass. | Fixed |
| F-1-59 | Account-free and analytics-free sample use is registered. | Fixed |
| F-1-60 | Demo traffic is same-origin GET-only with empty bodies. | Fixed |
| F-1-61 | Inactive license verification is absent. | Fixed |
| F-1-62 | A wrong passphrase cannot unlock a packet or trigger recovery. | Fixed |
| F-1-63 | Node 20+ is declared and used by the clean clone. | Fixed |
| F-2-1 | Each claim command self-builds and passes from a clean clone. | Fixed |
| F-2-2 | Reset, request payload inspection, full restore equality, and exported-receipt round trip are asserted. | Fixed |
| F-2-3 | All seeded provider links return 200. | Fixed |
| F-2-4 | All three facts remain above the 390 px fold. | Fixed |
| F-2-5 | Mobile target-size checks pass every tested route. | Fixed |
| F-2-6 | 404 sharing metadata and all public stage sitemap entries are present. | Fixed |
| F-2-7 | Preview and workflow headings name their sections. | Fixed |
| F-2-8 | Stage controls name their destination/source. | Fixed |
| F-2-9 | README states practical outcomes before implementation detail. | Fixed |
| F-3-1 | “No purchase required” is visible and claim-tested. | Fixed |
| F-3-2 | Demo titles and social metadata use product-first wording. | Fixed |
| F-4-1 | Real packet-stage titles and matching metadata use product-first wording. | Fixed |

## What would make this perfect

Nothing product-specific is left to add under the brief. Keep the clean-clone claim loop, live route crawl, and mobile cold-read check in future release verification so this zero-finding state does not regress.
