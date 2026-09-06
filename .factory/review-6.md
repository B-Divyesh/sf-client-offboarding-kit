# Review of client closeout packet creation — 6

**Verdict: FAIL**  
**Reviewed:** 2026-09-06 UTC  
**Live URL:** <https://client-offboarding-kit.sociobot.in>  
**Implementation candidate:** `25b522fa11b03cfc329a3ed84dc161d75dbd700f`  
**Documentation candidate:** `2ea581bcc15dbafefbd35df7960b86146aa67811`  
**Findings:** 1  
**Untested public claims:** 1

The reviewed live asset names, `main-5xetqIKv.js` and `main-LzKrCNNp.css`, exactly match a fresh build of implementation candidate `25b522f`. The commits after it only change review, handoff, and evidence files. The live deployment therefore matches the implementation reviewed.

## First read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900. No scroll or interaction occurred before these answers were recorded.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| Job | Build a client closeout packet. | Clear from the h1. |
| Audience | Freelance developers and web studios handing finished projects to clients. | Clear from the following sentence. |
| First action | Try it with sample data. | Clear from the primary action and its adjacent result text. |

Both viewports had one h1, a main landmark, `lang="en"`, no console errors, and no horizontal overflow. The phone first screen kept the three facts visible: encrypted before saving, no purchase required, and works offline after the first visit.

## Live product checks

- `/demo` opened the populated Northstar Arts packet. It includes project information, three assets, two access tasks, a support period, and acknowledgement content rather than an empty form.
- The persistent label reads “Demo — sample data, nothing is saved.” The tested demo workflow edits the sample, resets it to Northstar Arts, starts for real, and confirms that its separate `demo:closeout-kit-v1` database is discarded without changing `closeout-kit-v1`.
- The normal flow creates a real packet and exports client HTML. Invalid secret-shaped input keeps the valid fields and focuses the error. Completing an access task is blocked until the original-service confirmation is checked. A wrong passphrase does not unlock a packet or offer recovery.
- The client acknowledgement form produces a receipt which imports into the packet. Encrypted backup export/import restores the full packet. The sample client HTML includes engagement, assets, access tasks, support, and acknowledgement.
- The local and live browser suites verify an offline reload followed by packet export. The live request check permits only same-origin empty GET requests and no account, analytics, payment, or packet-content request.
- Root, demo, six demo stages, six packet stages, Privacy, Terms, `robots.txt`, and `sitemap.xml` returned HTTP 200. `/404.html` and an unknown path deliberately returned the designed HTTP 404 page; this is expected and not a defect. The three seeded provider links returned HTTP 200.
- Live headers include CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and restrictive permissions policy. The manifest has `application/manifest+json`; `sw.js` is no-store. The URL verifier completed with zero console errors, title/lang/main present, and no missing image alt text or unlabeled buttons.
- The live Playwright Axe checks reported no serious or critical issue on root, legal pages, 404, and every demo stage. Keyboard checks include the skip link, route focus movement, and route announcement. The suite verifies 44 px targets at 390 px on every covered route. The visual system matches the documented dark harbor, teal/amber, serif/sans design and has a reduced-motion rule in its CSS.
- This static local-first PWA has no backend, tenant, health endpoint, or request-rate contract. Backend isolation, restart persistence, and 429/Retry-After checks do not apply.

## Declared claims and clean checkout

A new clone at `/tmp/client-offboarding-kit-review-6.BHu5PK/repo` installed its documented prerequisite with `npm ci` (60 packages, zero vulnerabilities). Every one of the 13 exact commands in `.factory/claims.json` ran separately and passed. `npm test` passed its 14 unit tests, production build, and 22 browser tests; `npm run build` produced `dist/index.html`. The built main JS is 15.70 kB gzip and CSS is 5.06 kB gzip.

| Registered claim IDs | Evidence | Result |
| --- | --- | --- |
| `demo-isolation`, `encrypted-storage`, `offline-reload`, `private-network` | Exact tagged claim commands from a clean clone | Pass |
| `no-purchase-required`, `credential-rejection`, `access-confirmation`, `packet-export` | Exact tagged claim commands from a clean clone | Pass |
| `backup-roundtrip`, `acknowledgement-receipt`, `workflow-boundaries`, `recovery-boundary`, `art-provenance` | Exact tagged claim commands from a clean clone | Pass |

The registry has 13 unique IDs, and source test tags contain each exactly once. The test suite also covers each registered claim against the live URL. Privacy, Terms, and route metadata are present. The supplied URL verifier passed when invoked with its required evidence-directory argument. Existing local and live mobile Lighthouse evidence records 100 for performance, accessibility, best practices, and SEO.

## Finding

| ID | Severity | Evidence | Required repair |
| --- | --- | --- | --- |
| F-6-1 | Major | `src/main.ts:485` creates a user-facing update toast: “A new version is ready.” with “Reload and update.” `.factory/claims.json` has no update claim, and the Playwright suite has no test that establishes a waiting service worker, presses the control, and verifies the new worker takes control and reloads. | Either remove the update promise, or add it to `claims.json` and a tagged browser test that proves the waiting-worker → action → controller-change/reload path from an isolated fresh browser context. Run its exact claim command in a clean clone. |

This is a public behavior visitors may rely on. The offline claim does not cover it: `@claim:offline-reload` only proves offline reload, edit, and export. Under the claims contract, the update promise is unlisted and untested. Therefore the required zero-finding, zero-untested-claim condition is not met.

## Earlier findings

I read `.factory/verification.md`, reviews 1 through 5, and polish records 1 through 4. The table below records the current disposition of every earlier finding; a range means every numbered ID in that range was rechecked by the cited current evidence.

| Earlier IDs | Current evidence | Disposition |
| --- | --- | --- |
| F-1-1 | Fresh phone and desktop first read confirms job, audience, sample action, and facts before scrolling. | Fixed |
| F-1-2 | Populated demo, persistent label, reset/exit, namespace isolation, and demo documentation pass. | Fixed |
| F-1-3 | All 13 original registered claim commands pass in the new clean checkout. | Fixed |
| F-1-4, F-1-44–F-1-47, F-1-52, F-1-61 | No inactive paid offer, checkout, license, merchant, refund, or unsupported price promise appears; no-purchase creation/export test passes. | Fixed |
| F-1-5, F-2-6 | Designed 404 and its metadata work with deliberate HTTP 404 status; sitemap lists public packet routes. | Fixed |
| F-1-6, F-1-11–F-1-13, F-3-2, F-4-1 | Live suite verifies stage deep links, titles, canonical/OG/Twitter metadata, back history, h1 focus, announcements, header/footer, and skip link. | Fixed |
| F-1-7–F-1-9, F-1-58 | Live header and delivery checks confirm CSP/frame protection, cache policy, service worker, and manifest MIME. | Fixed |
| F-1-10, F-1-48–F-1-51, F-1-62 | Credential rejection, original-service confirmation, encrypted storage, wrong-passphrase boundary, recovery boundary, backup restore, and offline export pass. | Fixed |
| F-1-14–F-1-16, F-1-37, F-1-40 | Filled preview, literal limits, separate demo, client packet sections, and acknowledgement receipt route all pass. | Fixed |
| F-1-17–F-1-36, F-2-7–F-2-9 | Current copy is plain, audience-specific, literal, and terminologically consistent; buttons name outcomes. | Fixed |
| F-1-38–F-1-43, F-1-53–F-1-54, F-1-59–F-1-60 | Request recording, storage envelope inspection, workflow-boundary claim, original-art provenance, and no-account/no-analytics checks pass. | Fixed |
| F-1-55–F-1-57, F-1-63, F-2-1–F-2-5 | Pinned Playwright, documented Node prerequisite, clean claim loop, `npm test`, build output, mobile overflow, and target-size checks pass. | Fixed |
| F-3-1 | “No purchase required” remains visible and has a passing tagged claim test. | Fixed |

No earlier defect has regressed. F-6-1 is new and is not a recurrence of a prior finding.

## Result

**FAIL — 1 major finding and 1 untested public claim remain.**

The product is otherwise usable end to end, but it cannot receive a PASS until F-6-1 is removed or fully registered and tested.
