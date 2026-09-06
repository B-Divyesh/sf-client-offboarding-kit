# Verification 2 — build and send a client handoff packet

**Verdict: FAIL**

Reviewed 6 September 2026 UTC against <https://client-offboarding-kit.sociobot.in>.

- Implementation candidate: `9bfbac65bee4ae7b708a91fa0f69613875a8d08e`
- Documentation candidate: `4c3b53e3a040580d4b8101851dfc57740ba899d6`
- Findings: 1
- Untested public claims: 1

The application works for the main closeout job and all 14 registered claims pass. It cannot receive PASS because the privacy page makes one additional public behavior promise that is neither registered nor covered by a tagged sandbox test.

## First screen

Fresh live Chromium contexts at 1440 × 900 and 390 × 844 showed, before scrolling:

| Check | Live result |
| --- | --- |
| Job | “Build a client closeout packet.” |
| Audience | “For freelance developers and web studios handing finished projects to clients.” |
| First action | “Try it with sample data.” |
| What happens | “Opens a filled six-stage packet; your packets stay unchanged.” |
| Facts | Encrypted before saving; no purchase required; works offline after the first visit. |

Both viewports had no horizontal page overflow and no console/page errors. The first screen uses direct language and has one h1, a main landmark, visible links, and the sample action before the real-packet passphrase form.

## Finding

| ID | Severity | Evidence | Required repair |
| --- | --- | --- | --- |
| V2-1 | Major | The live [privacy page](/work/repo/privacy/index.html:88) says: “Use ‘Delete packet’ in the Export stage, or clear this site’s browser data. Either action removes local packets from that browser.” `rg` finds no `Delete packet` coverage in `tests/`, and `.factory/claims.json` has no deletion claim. The real fresh-browser path was manually exercised and did remove the packet (IndexedDB packet count: 0), but that does not meet the claims contract. | Add one registry entry and exactly one tagged demo-sandbox browser test that proves the deletion outcome, or remove this public promise. The test must be runnable from the documented clean setup. |

This is a claims-contract finding, not a functional failure. The real deletion flow shows a specific confirmation, returns to the welcome screen, and removed the test packet. It remains a finding because a visitor is asked to rely on the statement and the suite cannot prove it on every build.

## Registered claims from a clean checkout

A new clone at `/tmp/client-offboarding-kit-verify-2.pkjWnM/repo` ran `npm ci` with Node `v22.23.2`: 60 packages installed and 0 vulnerabilities. Each exact command declared in `.factory/claims.json` was run separately. All passed; the run log ends with exit status 0 and `PASS`.

| Claim | Result |
| --- | --- |
| demo-isolation | Pass |
| encrypted-storage | Pass |
| offline-reload | Pass |
| update-reload | Pass |
| private-network | Pass |
| no-purchase-required | Pass |
| credential-rejection | Pass |
| access-confirmation | Pass |
| packet-export | Pass |
| backup-roundtrip | Pass |
| acknowledgement-receipt | Pass |
| workflow-boundaries | Pass |
| recovery-boundary | Pass |
| art-provenance | Pass |

`npm test` also passed from that checkout: 14 unit/config checks, production build, and 23 Chromium checks. `npm run build` produced `dist/index.html`; the initial JavaScript is 47.38 kB raw / 15.77 kB gzip and CSS is 19.44 kB raw / 5.06 kB gzip.

The recently repaired update behavior was independently rerun against live. It passed the waiting-worker → user confirmation → controller change → reload path. The live offline-reload claim also passed in its own fresh browser context.

## Demo, data, recovery, and boundaries

- Fresh phone and desktop demo visits showed the persistent “Demo — sample data, nothing is saved” label, Reset demo, and Start for real.
- The populated Assets stage showed three realistic records: production repository, production hosting, and domain/DNS; the named owners were Tideway Web Studio and Northstar Arts Council.
- Reset restored the original Northstar Arts sample after the normal save/render cycle. Start for real returned to the welcome screen and discarded `demo:closeout-kit-v1`; the new real namespace was empty until a packet was created.
- The registered tests cover encrypted storage, no packet content in requests, common-secret rejection with preserved fields and focused error, wrong-passphrase recovery boundary, external-service confirmation before task completion, backup round-trip, client acknowledgement receipt, packet HTML export, and stated workflow limits.
- Manual real-packet deletion confirmed the browser confirmation, return to `/`, and zero remaining encrypted packet records. See V2-1 for the missing registered test.

This is a static local-first PWA. Backend tenant isolation, restart persistence, health, and 429/Retry-After checks do not apply.

## Accessibility, routes, privacy, and delivery

- `/opt/fleet/lib/verify-url.sh` against live returned HTTP 200, correct title/language, one h1, main landmark, no missing image alt text, no unnamed buttons, and no console errors.
- Live Axe scans of `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown route found zero serious or critical violations.
- Keyboard verification reached the skip link first; it had a visible 3 px focus outline. With reduced motion enabled, animation and transition duration were `0.01ms`.
- The mobile 390 px screen had no horizontal overflow. The documented target-size test passed across its routes in the clean full suite.
- Root, demo, privacy, terms, manifest, service worker, assets, sitemap, and robots responded as expected. `/404.html` and an unknown route deliberately returned the designed 404 page with HTTP 404; this is expected, not a defect.
- The live CSP, `X-Frame-Options: DENY`, `nosniff`, referrer policy, and permissions policy are present. Hashed JS/CSS use `max-age=31536000, immutable`; `sw.js` is no-store; the manifest MIME type is `application/manifest+json`.
- Same-origin public links returned 200 except the deliberate 404 page; the GitHub repository, GitHub, Netlify, and Cloudflare sample links returned 200. The privacy contact is an explicit `mailto:` link.
- All 23 publicly served build files byte-match the live deployment. `staticwebapp.config.json` was excluded because it is host configuration, not a served file.

## Earlier finding disposition

All prior review and verification records were inspected. The following current evidence rechecks every earlier ID, including the earlier minor items.

| Earlier IDs | Current disposition | Current proof |
| --- | --- | --- |
| Initial verification: security headers, immutable assets, manifest MIME, form-value loss | Fixed | Live response headers and MIME are correct; the credential-rejection claim preserves fields and focus. |
| F-1-1 through F-1-16 | Fixed | First screen, demo isolation, claims registry, removal of unavailable paid offer, 404, stage routing/history/focus, security delivery, shared skeleton, preview, demo docs, and acknowledgement receipt all pass. |
| F-1-17 through F-1-36 | Fixed | Current landing and README use direct, audience-specific language, consistent packet/stage/access-task terminology, and product-first titles. |
| F-1-37 through F-1-63 | Fixed | Export sections, request/storage privacy, original art provenance, workflow boundaries, secret prevention, backup/offline behavior, test/build prerequisites, and absence of unsupported paid or recovery claims pass. |
| F-2-1 through F-2-9 | Fixed | Per-claim self-builds, complete sample/reset/receipt checks, provider links, phone facts/targets, metadata/sitemap, and clear labels pass. |
| F-3-1 through F-3-2 | Fixed | No-purchase creation/export and product-first demo title/metadata pass. |
| F-4-1 | Fixed | Real packet-stage title and matching metadata pass. |
| Review 5 | Still zero historical findings | Its prior zero-finding conditions remain met, subject to the newly identified V2-1 claim gap. |
| F-6-1 | Fixed | `update-reload` is registered and passed from the clean checkout and live, including waiting worker, confirmation, controller change, and reload. |

## Result

**FAIL — 1 major finding and 1 untested public claim.**

The implementation candidate is otherwise live, byte-matched, and verified. Register and test the deletion promise, then rerun this report before declaring PASS.
