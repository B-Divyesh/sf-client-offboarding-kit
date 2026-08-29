# Adversarial first-read review 4 — Closeout Kit

**Verdict: FAIL**  
**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://client-offboarding-kit.sociobot.in>  
**Reviewed commit:** `eb3ee257418771a273cc265a25e7d018f862eb73`

One minor finding remains. The zero-findings acceptance rule prevents a PASS.

## Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900 without scrolling.

| Question | First-read answer | Result |
| --- | --- | --- |
| What does this do? | It builds a client closeout packet containing handoff records. | Clear from “Build a client closeout packet.” |
| For whom? | Freelance developers and web studios handing finished projects to clients. | Clear from the sentence below the headline. |
| What should I click first? | “Try it with sample data.” | Clear; adjacent copy explains that it opens a filled packet. |

All three answers, plus the encryption, no-purchase, and offline facts, are visible in the first mobile and desktop screens.

## Finding

### F-4-1 — Real packet-stage titles use the product-last format

**Severity:** Minor

**Exact location / quote:** After creating a real packet through live `/packet/assets`, the route correctly opens its stage but renders `<title>Assets — Closeout Kit</title>`. `src/main.ts` uses this pattern for every real stage: `Engagement — Closeout Kit`, `Assets — Closeout Kit`, `Access tasks — Closeout Kit`, `Support — Closeout Kit`, `Acknowledgement — Closeout Kit`, and `Export — Closeout Kit`.

**Why a visitor is misled or lost:** the required title convention is “Product — what it does.” The product remains identifiable, but its identity is less prominent in browser tabs and shared metadata, and the format conflicts with the repaired root and demo titles.

**Concrete fix:** replace those values with `Closeout Kit — describe the finished project`, `Closeout Kit — list assets and owners`, `Closeout Kit — confirm account changes`, `Closeout Kit — set support dates`, `Closeout Kit — collect a client receipt`, and `Closeout Kit — download the client packet`. Extend the title test to create or unlock a real packet at every `/packet/<stage>` route and assert title, canonical, OG, and Twitter values.

## Demo, privacy, and claims

- The first screen supplies one-click **Try it with sample data**. Fresh `/demo` immediately shows the filled Northstar Arts website packet.
- The persistent banner reads **“Demo — sample data, nothing is saved”** and includes working **Reset demo** and **Start for real** controls.
- In three fresh contexts, edit → Reset → `/demo` restored `Northstar Arts website`. Each context contained only `demo:closeout-kit-v1`. The clean-clone isolation test also proved a real packet remains unchanged and demo storage is deleted on exit.
- Live demo traffic was same-origin GET-only with empty bodies and no packet text, analytics, account, or third-party request. Offline reload and client-packet export worked after service-worker control.
- A clean clone at `/tmp/closeout-review-4.rKCzHw/repo` ran `npm ci`, then every exact `.factory/claims.json` command without a preparatory build. All 13 passed. Aggregate `npm run test:claims` passed 13 tests; clean `npm test` passed 12 unit/config and 21 Chromium checks; the deployed 21-test suite also passed.
- The registry has 13 unique IDs and exactly one `@claim:<id>` tag each. All landing and README customer-facing claims map to it; no unlisted claim was found.

| Claim IDs | Result |
| --- | --- |
| `demo-isolation`, `encrypted-storage`, `offline-reload`, `private-network` | Pass |
| `no-purchase-required`, `credential-rejection`, `access-confirmation` | Pass |
| `packet-export`, `backup-roundtrip`, `acknowledgement-receipt` | Pass |
| `workflow-boundaries`, `recovery-boundary`, `art-provenance` | Pass |

## Copy audit

Counts treat a hyphenated word as one word; URLs and fenced commands are excluded. No entry exceeds 22 words, uses banned marketing language, changes a core term, uses an empty mood heading, or uses a result-less button. F-4-1 is the only copy-adjacent issue.

### Landing page

| Words | Every visitor-facing sentence, heading, label, or control | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Pass |
| 2; 3; 6 | Closeout Kit; Client handoff packets; Packet data stays in this browser | Pass |
| 1 each | Home; Demo; Privacy; Terms | Pass |
| 7 | Client handoff tool for freelancers and studios | Pass |
| 5 | Build a client closeout packet. | Pass |
| 11 | For freelance developers and web studios handing finished projects to clients. | Pass |
| 5; 8 | Try it with sample data; Opens a filled six-stage packet; your packets stay unchanged. | Pass |
| 3; 3; 6 | Encrypted before saving; No purchase required; Works offline after the first visit | Pass |
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
| 3; 7 | 1. List the project.; Add asset links, owners, and support dates. | Pass |
| 3; 7 | 2. Confirm access tasks.; Check each change in the original service. | Pass |
| 3; 8 | 3. Send the packet.; Export the packet and import the client’s receipt. | Pass |
| 3; 6 | Privacy and limits; Keep credentials out of the packet. | Pass |
| 6; 6 | The app rejects common secret patterns.; Share credentials through your password manager. | Pass |
| 14; 12 | It does not move accounts, host files, migrate a CMS, or test client access.; Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 6; 9 | Closeout Kit builds client handoff packets.; Packet data is encrypted before this browser saves it. | Pass |
| 1; 2 | Source; opens externally | Pass |
| 10 | Built by Param Factory · Build 1.2.1 · Generated artwork | Pass |
| 17 | A quiet harbor seen from a dark operations room, with a closed document case ready for handoff | Pass — alt text |
| 7; 14 | Closeout Kit — build client handoff packets; Build a client packet with asset links, owners, access tasks, support dates, and acknowledgement. | Pass — title/description |

### README

| Words | Every sentence or heading | Result |
| ---: | --- | --- |
| 2 | Closeout Kit | Pass |
| 15 | Closeout Kit is a browser app for freelance developers and web studios finishing client projects. | Pass |
| 15 | It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement. | Pass |
| 2; 4; 3 | Live product; Try the isolated sample; What it does | Pass |
| 11; 10; 7 | Collect project details, assets, owners, account tasks, support dates, and acknowledgement.; Require confirmation of each access task in the original service.; Reject common password, API-token, and private-key patterns. | Pass |
| 13; 13; 7 | Encrypt packets in the browser before saving them in browser storage (technical: IndexedDB).; Download a client HTML packet, an encrypted backup, and a client acknowledgement form.; Import encrypted backups and client acknowledgement receipts. | Pass |
| 7; 7 | Keep working offline after the first visit.; Create and export a packet without purchase. | Pass |
| 15; 12 | The app does not move accounts, host files, migrate a CMS, or test client access.; Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 14 | Every customer-facing statement above maps to one tagged browser test in `.factory/claims.json`. | Pass |
| 3; 13; 5 | Try the sample; Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet.; The banner identifies sample mode. | Pass |
| 12; 10; 6 | “Reset demo” restores the sample, and “Start for real” removes sample storage.; The sample uses separate browser storage (technical name: `demo:closeout-kit-v1`).; It never reads or writes `closeout-kit-v1`. | Pass |
| 11 | See `.factory/demo.md` for the sample contents and reset contract. | Pass |
| 2; 6; 6 | Run locally; Use Node.js 20 or newer.; Open the URL printed by Vite. | Pass |
| 3; 10; 16; 12 | Test and build; `npm test` runs unit tests and creates a production build.; The tests open the app in Chromium and check accessibility, phone layout, exports, and offline use.; The build output is `dist/`, with `dist/index.html` at its root. | Pass |
| 1; 8; 5; 17 | Deploy; Deploy `dist/` as an Azure Static Web App.; The factory work order uses:; The hosting file keeps app URLs, the 404 page, security headers, caches, and web-app manifest delivery working. | Pass |
| 3; 8; 13; 9; 5 | Privacy and recovery; Closeout Kit has no analytics or product account.; Packet content stays in the browser unless you export and share a file.; Keep the encrypted JSON backup and its passphrase separately.; See the hosted privacy page. | Pass |
| 2; 8; 5; 2 | Project notes; Visual system and generated-art provenance: `.factory/design.md`; Verification evidence: `.factory/handoff.md`; License: MIT | Pass |

Terminology is consistent: **app**, **packet**, **stage**, **access task**, **original service**, and **acknowledgement receipt** each have one meaning.

## Structure, accessibility, visual identity, and missed leverage

- Root, demo, demo stages, Privacy, Terms, 404, and unlocked real stages have one h1, main, `lang="en"`, metadata, canonical URLs, OG/Twitter, favicon, and Apple icon.
- Deep demo and unlocked real-packet routes restore their requested stage; Back restores, focuses, and announces the h1.
- Root and sample-provider links succeeded. Headers include CSP with `frame-ancestors 'none'`, frame denial, nosniff, referrer policy, permissions policy, immutable hashed assets, no-store `sw.js`, and correct manifest MIME.
- `/not-a-real-route` returns the designed HTTP 404. The normal Chrome network error for an intentionally 404 document is the only error observed there; functional routes have no console or page errors.
- The harbor control-room identity matches `.factory/design.md` and is not a generic SaaS template.
- No AI feature is missing: the brief is satisfied by a local, explicit handoff workflow. Export, import, offline use, and client acknowledgement are present; no decorative AI or provider key is present.

## Earlier-history recheck

Each prior ID was checked again in live behavior and source. None is reissued; F-4-1 is new.

| Earlier IDs | Confirmation | Result |
| --- | --- | --- |
| F-1-1 | Job h1, audience, sample action, and first-screen facts verified at both viewports. | Fixed |
| F-1-2 | Filled demo, reset, exit, and isolated namespace verified. | Fixed |
| F-1-3 | 13 unique registry claims and exact fresh-clone commands passed. | Fixed |
| F-1-4 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-5 | Designed 404 returns HTTP 404. | Fixed |
| F-1-6 | Stage history, reload, h1 focus, and announcement verified. | Fixed |
| F-1-7 | Live security headers verified. | Fixed |
| F-1-8 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-9 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-10 | Credential rejection preserves valid fields and focus. | Fixed |
| F-1-11 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-12 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-13 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-14 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-15 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-16 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-17 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-18 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-19 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-20 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-21 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-22 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-23 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-24 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-25 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-26 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-27 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-28 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-29 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-30 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-31 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-32 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-33 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-34 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-35 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-36 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-37 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-38 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-39 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-40 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-41 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-42 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-43 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-44 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-45 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-46 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-47 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-48 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-49 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-50 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-51 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-52 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-53 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-54 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-55 | Fresh npm test passed. | Fixed |
| F-1-56 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-57 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-58 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-59 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-60 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-61 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-62 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-1-63 | Checked against the cited live behavior and current source; no regression found. | Fixed |
| F-2-1 | Each claim command self-builds and passed fresh. | Fixed |
| F-2-2 | Reset, request payload, restore equality, and receipt flow tests are complete. | Fixed |
| F-2-3 | All sample provider links return 200. | Fixed |
| F-2-4 | All three facts are above the 390 px fold. | Fixed |
| F-2-5 | No visible mobile target is under 44 px. | Fixed |
| F-2-6 | 404 sharing metadata and stage sitemap entries are live. | Fixed |
| F-2-7 | Landing headings name their sections. | Fixed |
| F-2-8 | Stage controls name their destinations. | Fixed |
| F-2-9 | README uses practical outcomes before technical detail. | Fixed |
| F-3-1 | No purchase required is visible and claim-tested. | Fixed |
| F-3-2 | Demo titles and matching social metadata are product-first. | Fixed |

## What would make this perfect

Apply F-4-1’s product-first titles to the six real packet stages and add the real-stage metadata regression test. Then rerun the clean-clone claim commands, `npm test`, and the live mobile/deep-link check. No other product change is indicated.
