# Adversarial first-read review 3 — Closeout Kit

**Verdict: FAIL**  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://client-offboarding-kit.sociobot.in>  
**Reviewed commit:** `41299fc997a1f6295df4d78ae191a6f58777b1d7`

The product has two minor findings. This review uses the required zero-findings threshold, so it cannot pass yet.

## Cold first read

Fresh Chromium contexts opened the live root without scrolling or interaction at 390 × 844 and 1440 × 900.

| Question | First-read answer | Result |
| --- | --- | --- |
| What does this do? | It builds a packet for handing a finished client project over. | Clear from “Build a client closeout packet.” |
| For whom? | Freelance developers and web studios handing completed projects to clients. | Clear from “For freelance developers and web studios handing finished projects to clients.” |
| What should I click first? | “Try it with sample data.” | Clear, visible, and accompanied by the result of clicking it. |

The first-read questions are answerable at both sizes. The 390 px screen also contains the headline, audience, primary action, and all three displayed fact lines before the passphrase form. No cold-read blocking finding applies.

## Findings

### Minor

#### F-3-1 — The required first-screen price/no-cost fact is absent

- **Location/quote:** root first screen, immediately below “Try it with sample data”: “Encrypted before saving”, “No account needed”, and “Works offline after the first visit”.
- **Why this matters:** the brief declares a one-time monetization model, while the first-screen contract requires privacy, offline, and price facts. “No account needed” does not say whether the visitor may use the product without payment, what it costs, or whether a one-time price applies. A cold visitor can try the sample but cannot tell the commercial condition for creating a real packet.
- **Concrete fix:** replace or supplement “No account needed” with a truthful commercial fact, for example “No purchase required” if the full real workflow is free. If it is paid, state the exact one-time price and what it unlocks. Register the retained statement in `.factory/claims.json` and add an observable test for the no-purchase path or the displayed price/entitlement.

#### F-3-2 — Demo page titles do not use the required product-title pattern

- **Location/quote:** live `/demo` has `<title>Demo · Engagement — Closeout Kit</title>`; `/demo?stage=assets` has `<title>Demo · Assets — Closeout Kit</title>`.
- **Why this matters:** route titles are required to use the plain “Product — what it does” pattern, with the demo route explicitly named as “Demo — Product name”. The current dot-separated construction puts the product name last and makes the title format different from root, Privacy, Terms, and the ordinary packet routes.
- **Concrete fix:** use a uniform, plain pattern such as `Closeout Kit demo — describe the finished project` and `Closeout Kit demo — list assets and owners` (each under 60 characters), with matching OG/Twitter titles. Update the route-title browser test to assert the final strings.

## Demo and sandbox verification

The demo is not a finding.

- The root supplies one-click “Try it with sample data”. `/demo` opens the filled Northstar Arts website packet immediately.
- The persistent banner reads “Demo — sample data, nothing is saved”, with working “Reset demo” and “Start for real” actions.
- In a fresh browser context, the only IndexedDB database after entering `/demo` was `demo:closeout-kit-v1`. The real `closeout-kit-v1` database was not opened.
- Editing the sample project name to “Review-only changed sample” and selecting Reset restored “Northstar Arts website”.
- The live demo request log contained only same-origin GET requests for the document, JavaScript, and CSS, each with an empty body. No analytics, account, or third-party product request appeared.
- After service-worker control, an offline live reload of `/demo?stage=export` showed “Offline · changes still save here” and downloaded `northstar-arts-website.html`.

## Claims audit

`.factory/claims.json` contains 12 entries and the source contains exactly one matching `@claim:<id>` test for each. I cloned the reviewed commit to a fresh temporary checkout, ran `npm ci`, and ran every registered command without a preparatory build. All passed.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `encrypted-storage` | Pass |
| `offline-reload` | Pass |
| `private-network` | Pass |
| `credential-rejection` | Pass |
| `access-confirmation` | Pass |
| `packet-export` | Pass |
| `backup-roundtrip` | Pass |
| `acknowledgement-receipt` | Pass |
| `workflow-boundaries` | Pass |
| `recovery-boundary` | Pass |
| `art-provenance` | Pass |

The initial acknowledgement command encountered a locally induced port collision while a previous verifier loop was still running. After terminating that accidental duplicate runner, the exact clean-clone command passed; it is not a product failure.

The live landing and README were cross-checked against the registry. Their encryption, offline, isolation, export, acknowledgement, credential, account/privacy, and workflow-boundary statements are covered by entries above. No additional unlisted customer-facing claim was found.

## Copy audit

Counts are whitespace-delimited. Headings, buttons, link labels, title, meta description, and meaningful alt text are included because they are visitor-facing copy. Commands and URLs are excluded. No entry exceeds 22 words. Apart from the missing commercial fact in F-3-1, no banned marketing adjective, unexplained audience-inappropriate jargon, empty mood heading, inconsistent core term, or generic result-less button was found.

### Landing page

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Pass |
| 2 | Closeout Kit | Pass |
| 3 | Client handoff packets | Pass |
| 6 | Packet data stays in this browser | Pass |
| 1 | Home | Pass |
| 1 | Demo | Pass |
| 1 | Privacy | Pass |
| 1 | Terms | Pass |
| 6 | Client handoff tool for freelancers and studios | Pass |
| 6 | Build a client closeout packet. | Pass |
| 10 | For freelance developers and web studios handing finished projects to clients. | Pass |
| 5 | Try it with sample data | Pass |
| 8 | Opens a filled six-stage packet; your packets stay unchanged. | Pass |
| 3 | Encrypted before saving | Pass |
| 3 | No account needed | F-3-1: not a price/no-cost fact |
| 6 | Works offline after the first visit | Pass |
| 4 | Create a packet passphrase | Pass |
| 2 | Confirm passphrase | Pass |
| 13 | Use at least 10 characters. Keep the passphrase because the app cannot recover it. | Pass |
| 3 | Create your packet | Pass |
| 3 | Filled packet preview | Pass |
| 5 | Preview a filled client packet. | Pass |
| 13 | The sample shows assets, owners, access tasks, support dates, and acknowledgement in one packet. | Pass |
| 4 | Open the sample packet | Pass |
| 3 | Northstar Arts website | Pass |
| 2 | 3 assets | Pass |
| 3 | 2 access tasks | Pass |
| 4 | Support through 27 September | Pass |
| 3 | Sample data | Pass |
| 3 | Six packet stages | Pass |
| 7 | Complete the packet in six stages. | Pass |
| 1 | Engagement | Pass |
| 1 | Assets | Pass |
| 2 | Access tasks | Pass |
| 1 | Support | Pass |
| 1 | Acknowledgement | Pass |
| 1 | Export | Pass |
| 3 | How it works | Pass |
| 8 | Create and send a packet in three steps. | Pass |
| 4 | 1. List the project. | Pass |
| 7 | Add asset links, owners, and support dates. | Pass |
| 5 | 2. Confirm access tasks. | Pass |
| 7 | Check each change in the original service. | Pass |
| 5 | 3. Send the packet. | Pass |
| 8 | Export the packet and import the client’s receipt. | Pass |
| 3 | Privacy and limits | Pass |
| 6 | Keep credentials out of the packet. | Pass |
| 10 | The app rejects common secret patterns. Share credentials through your password manager. | Pass |
| 14 | It does not move accounts, host files, migrate a CMS, or test client access. | Pass |
| 11 | Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 9 | Packet data is encrypted before this browser saves it. | Pass |
| 1 | Privacy | Pass |
| 1 | Terms | Pass |
| 1 | Source | Pass |
| 2 | opens externally | Pass |
| 5 | Built by Param Factory | Pass |
| 2 | Generated artwork | Pass |
| 17 | A quiet harbor seen from a dark operations room, with a closed document case ready for handoff | Pass |
| 7 | Closeout Kit — build client handoff packets | Pass |
| 14 | Build a client packet with asset links, owners, access tasks, support dates, and acknowledgement. | Pass |

### README

| Words | Copy | Result |
| ---: | --- | --- |
| 2 | Closeout Kit | Pass |
| 14 | Closeout Kit is a browser app for freelance developers and web studios finishing client projects. | Pass |
| 15 | It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement. | Pass |
| 2 | Live product | Pass |
| 4 | Try the isolated sample | Pass |
| 3 | What it does | Pass |
| 12 | Collect project details, assets, owners, account tasks, support dates, and acknowledgement. | Pass |
| 9 | Require confirmation of each access task in the original service. | Pass |
| 8 | Reject common password, API-token, and private-key patterns. | Pass |
| 13 | Encrypt packets in the browser before saving them in browser storage (technical: IndexedDB). | Pass |
| 12 | Download a client HTML packet, an encrypted backup, and a client acknowledgement form. | Pass |
| 7 | Import encrypted backups and client acknowledgement receipts. | Pass |
| 7 | Keep working offline after the first visit. | Pass |
| 14 | The app does not move accounts, host files, migrate a CMS, or test client access. | Pass |
| 11 | Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 12 | Every customer-facing statement above maps to one tagged browser test in `.factory/claims.json`. | Pass |
| 3 | Try the sample | Pass |
| 17 | Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet. | Pass |
| 6 | The banner identifies sample mode. | Pass |
| 12 | “Reset demo” restores the sample, and “Start for real” removes sample storage. | Pass |
| 9 | The sample uses separate browser storage (technical name: `demo:closeout-kit-v1`). | Pass |
| 8 | It never reads or writes `closeout-kit-v1`. | Pass |
| 9 | See `.factory/demo.md` for the sample contents and reset contract. | Pass |
| 2 | Run locally | Pass |
| 5 | Use Node.js 20 or newer. | Pass |
| 6 | Open the URL printed by Vite. | Pass |
| 3 | Test and build | Pass |
| 10 | `npm test` runs unit tests and creates a production build. | Pass |
| 15 | The tests open the app in Chromium and check accessibility, phone layout, exports, and offline use. | Pass |
| 10 | The build output is `dist/`, with `dist/index.html` at its root. | Pass |
| 1 | Deploy | Pass |
| 8 | Deploy `dist/` as an Azure Static Web App. | Pass |
| 5 | The factory work order uses: | Pass |
| 15 | The hosting file keeps app URLs, the 404 page, security headers, caches, and web-app manifest delivery working. | Pass |
| 3 | Privacy and recovery | Pass |
| 8 | Closeout Kit has no analytics or product account. | Pass |
| 13 | Packet content stays in the browser unless you export and share a file. | Pass |
| 9 | Keep the encrypted JSON backup and its passphrase separately. | Pass |
| 5 | See the hosted privacy page. | Pass |
| 2 | Project notes | Pass |
| 5 | Visual system and generated-art provenance | Pass |
| 2 | Verification evidence | Pass |
| 1 | License | Pass |

## Structure, accessibility, and delivery

- Root, demo, all six demo stages, Privacy, Terms, and the designed 404 have one h1, a main landmark, `lang=en`, metadata, canonical URLs, OG/Twitter cards, SVG favicon, and Apple touch icon.
- All live root/demo/legal/internal links and the four sample/provider/external source links crawled successfully. The mailto privacy link is explicit.
- The site uses a skip link, consistent header/footer, visible focus treatment, 44 px mobile targets, reduced-motion CSS, and a distinct harbor-control-room visual system that matches `.factory/design.md`; it is not a generic SaaS template.
- An axe-core live run at 390 px on root, all six demo stages, Privacy, Terms, and 404 found zero serious or critical violations.
- `/not-a-real-route` and `/404.html` return the styled recovery page with HTTP 404. Root, demo, legal, service-worker, manifest, and hashed-asset headers include the expected CSP/anti-framing/referrer/nosniff/permissions settings; the manifest is `application/manifest+json`, `sw.js` is no-store, and hashed JS is one-year immutable.
- The root title meets the pattern. Privacy, Terms, 404, and ordinary stage routes have route-specific titles. F-3-2 is the remaining title-pattern exception.

## Missed leverage

No missing AI feature is found: the brief does not need AI to produce a truthful handoff packet, and no decorative AI or provider key is present. The expected exports, encrypted backup import, offline use, and safe client acknowledgement return path are present.

## Earlier-history recheck

Every earlier finding was checked against current source and the live service; none is reissued. “Fixed” here means observed again in this review, not accepted from a prior polish note.

| Earlier ID | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Job h1, named audience, sample action, and passphrase ordering are live at 390 px and desktop. | Fixed |
| F-1-2 | Filled `/demo`, persistent banner, reset/exit, isolated database, and demo documentation work. | Fixed |
| F-1-3 | Twelve registered claims have twelve unique tags; every exact fresh-clone command passed. | Fixed |
| F-1-4 | No Studio checkout, price, or inactive purchase link is live. | Fixed |
| F-1-5 | Unknown URLs and `/404.html` return the designed 404 with status 404. | Fixed |
| F-1-6 | Demo stages use URLs/history, restore after reload, update focus, and announce the heading. | Fixed |
| F-1-7 | Live responses have CSP, frame denial, permissions, nosniff, and referrer headers. | Fixed |
| F-1-8 | Hashed assets are immutable and `sw.js` is no-store. | Fixed |
| F-1-9 | The live manifest is `application/manifest+json`. | Fixed |
| F-1-10 | Credential rejection preserves valid fields and focuses the invalid field in its tagged test. | Fixed |
| F-1-11 | Root and ordinary stages have descriptive title/h1 pairs. | Fixed |
| F-1-12 | Canonical, OG/Twitter, favicon, Apple icon, and social art are live. | Fixed |
| F-1-13 | Header/footer, skip link, factory credit, and build label are shared. | Fixed |
| F-1-14 | Filled preview, three-step process, limits, and no unavailable paid offer are live. | Fixed |
| F-1-15 | README and demo contract document entry, sample, reset, and namespace. | Fixed |
| F-1-16 | The exported acknowledgement form returns an imported receipt in the tagged test. | Fixed |
| F-1-17 | “Client handoff packets” replaces the mood slogan. | Fixed |
| F-1-18 | Browser-storage status is precise. | Fixed |
| F-1-19 | The non-verbal Studio price action is absent. | Fixed |
| F-1-20 | Audience-specific tool wording is live. | Fixed |
| F-1-21 | Credential guidance is literal, not metaphorical. | Fixed |
| F-1-22 | “Packet stages” names the workflow. | Fixed |
| F-1-23 | The six-stage heading is literal. | Fixed |
| F-1-24 | Footer uses the tested encryption statement. | Fixed |
| F-1-25 | Studio dialog/mood heading is absent. | Fixed |
| F-1-26 | README opens in plain browser-app language. | Fixed |
| F-1-27 | README names the packet contents directly. | Fixed |
| F-1-28 | Assets, owners, access tasks, support dates, and acknowledgement are consistent. | Fixed |
| F-1-29 | Encryption outcome precedes IndexedDB detail. | Fixed |
| F-1-30 | Export labels name their outcomes. | Fixed |
| F-1-31 | Billing/API copy and runtime license module are absent. | Fixed |
| F-1-32 | “Original service” is the external-system term. | Fixed |
| F-1-33 | README test prose is short. | Fixed |
| F-1-34 | App/packet/stage/access-task/receipt terminology is consistent. | Fixed |
| F-1-35 | The old unmeasurable title slogan is absent. | Fixed |
| F-1-36 | “Secure” marketing metadata is absent. | Fixed |
| F-1-37 | Demo and downloaded packet contain every packet section. | Fixed |
| F-1-38 | Browser-storage and recovery wording is scoped and request-tested. | Fixed |
| F-1-39 | Stored demo data is ciphertext without sample plaintext/passphrase. | Fixed |
| F-1-40 | Complete demo use needs no account. | Fixed |
| F-1-41 | First-visit offline reload/export passed live. | Fixed |
| F-1-42 | No-analytics/account use is registered and request-tested. | Fixed |
| F-1-43 | Generated-art disclosure, file, prompt, and provenance are present. | Fixed |
| F-1-44 | Unavailable one-time price claim is absent. | Fixed |
| F-1-45 | Unverified paid entitlement claim is absent. | Fixed |
| F-1-46 | “No subscription” is absent. | Fixed |
| F-1-47 | Merchant/refund claim is absent. | Fixed |
| F-1-48 | Access completion is blocked until original-service confirmation. | Fixed |
| F-1-49 | Secret patterns are rejected without losing valid fields. | Fixed |
| F-1-50 | Passphrase is absent from storage/network and has no recovery path. | Fixed |
| F-1-51 | Encrypted backup restore and offline export passed. | Fixed |
| F-1-52 | Paid-license claim is absent. | Fixed |
| F-1-53 | Workflow boundaries are literal and registered. | Fixed |
| F-1-54 | Environment/backend marketing claim is absent. | Fixed |
| F-1-55 | Fresh `npm test` passed unit, build, browser, accessibility, mobile, export, privacy, and offline checks. | Fixed |
| F-1-56 | Playwright is pinned to 1.58.2. | Fixed |
| F-1-57 | Fresh build produced `dist/index.html`. | Fixed |
| F-1-58 | Service-worker and manifest build/delivery checks pass. | Fixed |
| F-1-59 | Account-free and analytics-free sample use is registered. | Fixed |
| F-1-60 | Demo request log is same-origin GET-only with empty bodies. | Fixed |
| F-1-61 | Inactive license verification is absent. | Fixed |
| F-1-62 | Wrong passphrase cannot unlock a packet and triggers no recovery request. | Fixed |
| F-1-63 | Node 20+ is declared; verification used Node 22.23.2. | Fixed |
| F-2-1 | Each registered claim command builds before Playwright and passed fresh. | Fixed |
| F-2-2 | Reset, request-body inspection, full restore equality, and exported-receipt round trip are asserted. | Fixed |
| F-2-3 | The three sample service links return 200. | Fixed |
| F-2-4 | The three displayed facts are above the 390 px fold. | Fixed |
| F-2-5 | No visible mobile link/button/control measured under 44 px. | Fixed |
| F-2-6 | 404 sharing metadata and all six stage sitemap entries are live. | Fixed |
| F-2-7 | Preview and three-step headings name their sections. | Fixed |
| F-2-8 | Stage navigation names its destination/source rather than using Continue/Back. | Fixed |
| F-2-9 | README implementation detail follows the practical outcome and stays under 22 words. | Fixed |

## What would make this perfect

State the real commercial condition on the first screen and normalize the demo title format. Then re-run the two affected browser tests, the claim registry audit, and this cold mobile check. With those two fixes and no regressions, the product would meet the zero-findings threshold.
