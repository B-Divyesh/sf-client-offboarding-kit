# Perfection-loop polish 1

Candidate `590b3db3cdd8bab120f09e2dc007561762e95b7b` was repaired against review commit `bf547d80e4f6ba2636fc9ffc8e3dd5abd4a9ca3e`.

Evidence screenshots are in `.factory/evidence/`. Automated names below refer to `tests/e2e/app.spec.ts` unless stated otherwise.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the name/metaphor lead with “Build a client closeout packet,” named freelancers and studios, made sample data primary, and placed creation after both passphrase fields. | `390px layout…`; `mobile-home.png`; `/` |
| F-1-2 | Added `/demo` and `?demo=1`, realistic Northstar sample data, persistent banner, reset/exit actions, and isolated `demo:closeout-kit-v1` storage. | `@claim:demo-isolation`; `desktop-demo-assets.png`; `/demo` |
| F-1-3 | Added `.factory/claims.json` with exactly one tagged browser test for each of 12 retained claims. | `npm run test:claims`; source tag count check |
| F-1-4 | Removed all Studio pricing, checkout, license, merchant, and paid-entitlement copy while billing is unavailable. | `rg 'Studio|\\$29|checkout|license'`; link crawl in `metadata…` |
| F-1-5 | Added a harbor-styled 404, explicit host response override, and recovery links. | `metadata…styled 404`; `production delivery configuration`; `desktop-404.png`; `/not-a-real-route` |
| F-1-6 | Added six `/packet/<stage>` routes, demo stage query routes, push/pop history, route titles, h1 focus, and polite announcement. | `stage URLs restore state…`; `/packet/assets` |
| F-1-7 | Added CSP with `frame-ancestors 'none'`, X-Frame-Options, Permissions-Policy, nosniff, and referrer policy. | `sets security policies as response headers`; deployed header check |
| F-1-8 | Added one-year immutable cache headers for `/assets/*` and no-store for `sw.js`. | `sets immutable caching only for hashed assets`; deployed header check |
| F-1-9 | Added `.webmanifest` MIME mapping and route Content-Type. | `sets the manifest MIME type…`; deployed header check |
| F-1-10 | Validation now updates the form in place, preserves all fields, binds/focuses the error, and keeps the invalid value visible. | `@claim:credential-rejection` |
| F-1-11 | Set the root title to “Closeout Kit — build client handoff packets,” a job h1, and stage-specific titles/h1s. | `stage URLs…`; `metadata…`; `/` |
| F-1-12 | Added canonical, OG, Twitter, SVG favicon, Apple touch icon, and 1200×630 derived social art. | `metadata…`; `closeout-social.jpg`; root/privacy/terms checks |
| F-1-13 | Added the same Home/Demo/Privacy/Terms header, skip link, product line, Param Factory credit, and build ID everywhere. | `metadata…shared links`; root/privacy/terms/404 |
| F-1-14 | Added filled preview, three-step explanation, limitations/privacy, and removed the unavailable paid tier. | `desktop-home.png`; `@claim:workflow-boundaries`; `/` |
| F-1-15 | Documented entry points, sample content, reset behavior, and namespaces in README and `.factory/demo.md`. | files plus `@claim:demo-isolation` |
| F-1-16 | Added a client-facing acknowledgement HTML form, downloadable JSON receipt, strict matching import, and manual shared-review fallback. | `@claim:acknowledgement-receipt`; `mobile-demo-acknowledgement.png` |
| F-1-17 | Replaced “Departure without loose ends” with “Client handoff packets.” | `.factory/copy-audit.md`; screenshots |
| F-1-18 | Replaced “On device” with “Packet data stays in this browser.” | screenshots; `@claim:private-network` |
| F-1-19 | Removed the inactive Studio price button. | landing link crawl; paid-copy `rg` |
| F-1-20 | Replaced jargon with “Client handoff tool for freelancers and studios.” | copy audit; `/` |
| F-1-21 | Replaced the vault metaphor with direct credential and password-manager guidance. | copy audit; `@claim:credential-rejection` |
| F-1-22 | Replaced “closeout route” with “packet stages.” | copy audit; demo screenshots |
| F-1-23 | Replaced the marketing heading with “Complete the packet in six stages.” | copy audit; `/` |
| F-1-24 | Replaced vague privacy copy with the exact encrypted-storage statement. | `@claim:encrypted-storage`; footer |
| F-1-25 | Removed the Studio dialog and its mood heading. | paid-copy `rg` |
| F-1-26 | Rewrote the README opening in plain browser-app language. | `.factory/copy-audit.md` |
| F-1-27 | Rewrote the outcome as one packet built from specific contents. | copy audit; `@claim:packet-export` |
| F-1-28 | Standardized workflow language around assets, access tasks, support dates, and acknowledgement. | terminology table; `@claim:access-confirmation` |
| F-1-29 | Put the plain encryption outcome before IndexedDB/AES-GCM details. | README/privacy; `@claim:encrypted-storage` |
| F-1-30 | Explained what each export is for with direct download labels. | export stage; `@claim:packet-export`; `@claim:backup-roundtrip` |
| F-1-31 | Removed billing and license-verification copy and unused runtime module. | paid-copy `rg`; build tree |
| F-1-32 | Standardized “original service” and named hosting/domain/CMS/account services. | terminology table; `@claim:workflow-boundaries` |
| F-1-33 | Split the 28-word README test sentence into two short sentences. | copy audit |
| F-1-34 | Standardized app, packet, stage, access task, original service, and acknowledgement receipt. | copy audit terminology table |
| F-1-35 | Removed “leave every client in control” from title and source. | metadata test; title check |
| F-1-36 | Removed “secure”; tests separately prove export and secret rejection. | `@claim:packet-export`; `@claim:credential-rejection` |
| F-1-37 | Filled every demo stage and asserted all sections in the downloaded HTML. | `@claim:packet-export` |
| F-1-38 | Replaced the broad data statement with scoped browser/recovery language. | `@claim:private-network`; `@claim:recovery-boundary` |
| F-1-39 | Replaced jargon-first copy and inspected stored ciphertext for absent sample plaintext/passphrase. | `@claim:encrypted-storage` |
| F-1-40 | Kept “No account needed” and proved a complete demo without authentication requests or account fields. | `@claim:private-network` |
| F-1-41 | Made the claim precise: offline after first visit; tested cold cache, offline reload, and export. | `@claim:offline-reload` |
| F-1-42 | Registered the no-analytics/account claim and asserted every demo request is same-origin. | `@claim:private-network` |
| F-1-43 | Retained disclosure, recorded generated-art prompt/provenance, and tested the shipped file and record. | `@claim:art-provenance`; design.md |
| F-1-44 | Removed the unpurchasable $29 offer. | paid-copy `rg` |
| F-1-45 | Removed unverified paid entitlements. | paid-copy `rg` |
| F-1-46 | Removed “No subscription.” | paid-copy `rg` |
| F-1-47 | Removed merchant/refund copy until checkout exists. | paid-copy `rg` |
| F-1-48 | Completion is blocked until the original-service checkbox is checked. | `@claim:access-confirmation` |
| F-1-49 | Secret patterns are rejected in packet fields and asset/access forms; rejected values are not persisted. | expanded `@claim:credential-rejection`; unit security tests |
| F-1-50 | Stored-envelope and request assertions exclude the passphrase; recovery has no endpoint. | `@claim:encrypted-storage`; `@claim:recovery-boundary` |
| F-1-51 | Tested encrypted backup download/edit/import plus offline demo reload/export. | `@claim:backup-roundtrip`; `@claim:offline-reload` |
| F-1-52 | Removed the unavailable paid-license claim. | paid-copy `rg` |
| F-1-53 | Moved the four boundaries into a literal limitations section and registered them. | `@claim:workflow-boundaries` |
| F-1-54 | Removed the environment/backend marketing claim; local run instructions state only required commands. | README audit |
| F-1-55 | Split test documentation and verified every named category in `npm test`. | `npm test` 9 unit/config + 16 browser tests |
| F-1-56 | Kept Playwright exactly pinned at 1.58.2 in package and lock; removed prose claim. | package files; clean `npm ci` |
| F-1-57 | Kept `dist/` instructions and verified `dist/index.html`. | `npm run build`; clean-clone check |
| F-1-58 | Added service-worker/manifest build checks through the build and deployed MIME/header check. | dist inspection; config tests |
| F-1-59 | Registered and tested account-free, analytics-free demo use. | `@claim:private-network` |
| F-1-60 | Recorded all demo requests and asserted packet content never appears in network destinations. | `@claim:private-network` |
| F-1-61 | Removed inactive license verification behavior and its claim. | deleted `src/license.ts`; paid-copy `rg` |
| F-1-62 | Added a wrong-passphrase/no-recovery-request browser test. | `@claim:recovery-boundary` |
| F-1-63 | Added `engines.node >=20`; clean-clone runtime uses Node 22. | package.json; clean-clone evidence |

## Shared verification

- `npm test`: 10 unit/config tests and 16 Chromium tests pass.
- `npm run test:claims`: all 12 tagged claim tests pass.
- Production preview Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 0 ms.
- The first live audit exposed `/404.html` in the service-worker precache. It was removed, covered by `does not precache a URL that intentionally responds with 404`, and redeployed.
- Production bundles: JS 46.63 KB raw / 15.60 KB gzip; CSS 19.00 KB raw / 5.01 KB gzip.
- `/opt/fleet/lib/verify-url.sh`: title, `lang`, one h1, main, image alt, button names, and console checks pass.
