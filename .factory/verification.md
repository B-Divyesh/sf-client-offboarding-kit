# Independent verification — FAIL

**Work order:** `client-offboarding-kit-verify-1`  
**Candidate:** `80abb1cd1c003ac230480642e99e7bdcfaaeaac4`  
**Live URL:** https://client-offboarding-kit.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Environment:** clean candidate checkout; Node `v22.23.2`, npm `10.9.8`, Chromium via Playwright `1.58.2`.

## Decision

**FAIL — deployment policy and caching requirements are not met.** The deployed bytes do match the candidate and the core closeout workflow works, but it is not acceptable to pass a privacy-oriented PWA without a Content-Security-Policy / framing policy, and the production host does not use immutable caching for content-hashed assets.

## Blocking defects

### Medium — missing browser security policies on the live deployment

Fresh `curl -I` checks on `/`, `/assets/main-C0BDoUTe.js`, `/sw.js`, `/manifest.webmanifest`, `/privacy/`, and `/terms/` found HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`, but **no** `Content-Security-Policy`, `frame-ancestors`/`X-Frame-Options`, or `Permissions-Policy` header. This application unlocks and renders private client-closeout data in the browser; a restrictive first-party CSP and anti-framing policy are required production defenses.

### Medium — hashed static assets are not cacheable as immutable assets

The deployed JS, CSS, service worker, manifest, and HTML are all served with:

```
Cache-Control: public, must-revalidate, max-age=30
```

The content-hashed JS/CSS files should have a long-lived immutable policy. The 30-second revalidation policy fails the PWA/performance caching requirement and creates unnecessary repeat network dependence.

## Non-blocking defects

### Low — manifest MIME type

`/manifest.webmanifest` is delivered as `application/octet-stream`, rather than `application/manifest+json` (or `application/json`). Chromium accepted it during the PWA check, but the deployment should use the standard MIME type for reliable installability.

### Low — invalid asset submission discards already-entered form data

Submitting an asset containing a GitHub-token-shaped value correctly displays “That looks like a credential or private key…”, but the re-render clears the complete asset form. Recovery works after re-entering the fields, but valid user input should be retained when a single field fails validation.

## Passed evidence

### Clean install, test, type check, and production build

```text
npm ci                         PASS — 58 packages, 0 vulnerabilities
npm test                       PASS — 5 unit tests; 6 browser tests pass, 2 intentional project skips
npm run build                  PASS — `tsc --noEmit` and Vite production build
```

`package.json` exposes no separate lint script; TypeScript checking is included in the exact production build. `dist/` was produced successfully. The production entry payload is 37.57 KB JS / 15.62 KB CSS uncompressed (13.27 KB / 4.32 KB gzip), under the 200 KB / 50 KB budgets. No font payload or third-party runtime script is shipped; the 960px AVIF hero is 13.17 KB.

### End-to-end job-to-be-done

The automated Chromium workflow completed engagement, asset/owner/link, transfer action, explicit external-system confirmation, support window, all three acknowledgement confirmations, acknowledgement recording, and portable HTML download. It asserts the downloaded filename `acme-platform-handoff.html` and passes.

Independent live-browser exercises additionally confirmed:

- empty engagement refuses progression with an actionable error;
- mismatched passphrases, HTTP links, secret/token-shaped asset input, incomplete external confirmation, and incomplete acknowledgement all produce recovery messages;
- a secret-shaped submission is rejected and is not present in the exported/saved packet path;
- a corrected asset can be added after recovery; and
- IndexedDB contains only envelope keys `format`, `version`, `id`, `salt`, `iv`, `ciphertext`, and `updatedAt`; the project name, asset name, and passphrase did not occur in its stored JSON.

### PWA, privacy, and network

On the live URL, a new encrypted packet was saved, the page was reloaded and unlocked, then the browser context was set offline and reloaded again. The live service worker controlled the page (`https://client-offboarding-kit.sociobot.in/sw.js`), cache `closeout-kit-v1-shell` existed, the “Offline · still saving” state appeared, and the same packet restored offline. The service worker has activation/client-claim logic and an update-ready notice path; its manual `SKIP_WAITING` message is not wired to a toast button, so this should be regression-tested when deployment policy is fixed.

Initial live-page requests went only to `https://client-offboarding-kit.sociobot.in`; no analytics or other outbound requests occurred. The source has only an intentional Sociobot billing verification request after a user supplies/restores a license. Privacy and terms pages are present. Local packet persistence is AES-GCM with a PBKDF2-derived key and session-only passphrase.

### Accessibility, interaction, and responsive visual review

- `/opt/fleet/lib/verify-url.sh https://client-offboarding-kit.sociobot.in <temp-evidence>`: HTTP 200, 626 ms network-idle load, no page/console errors, title/lang/main present, exactly one h1, zero missing image alts, and zero unlabeled buttons.
- Independent `@axe-core/playwright` scan of the live welcome state: **0 violations**, including **0 serious/critical**.
- Keyboard smoke: the skip link receives a visible 3px `#F4B860` focus outline; controls use semantic buttons/labels.
- 390 × 844 live viewport: no horizontal overflow; mobile visual review showed stacked controls and the full primary action in view.
- `prefers-reduced-motion: reduce`: welcome animation duration becomes `0.01ms`; no active looping visual remains on the welcome screen.
- Desktop and mobile screenshots were visually reviewed. The product-specific harbor visual system is coherent, legible, and matches `.factory/design.md`.

### Candidate/live identity

Fresh production build outputs hash-identically match the live deployment for the root HTML asset references and each checked item:

| File | SHA-256 |
| --- | --- |
| `assets/main-C0BDoUTe.js` | `426f42190ffc128cab0f58bdd7c8f0b19e221b226383b3744dbf1e0b9c6ba1e4` |
| `assets/main-DANIw0p_.css` | `22afb448b894250d491bde1e7ae29b0796d8df2b19e0268783246ea0d4fa1750` |
| `sw.js` | `133381dfbcb044fb7d9e4313e371f006d0677d1537121fe2aafcb9416b6e6a00` |
| `manifest.webmanifest` | `69a4d02022e8380ea8a83919e4e6bbdd04b4256b5c99ea7d30c4ffe9976a9e45` |
| `offline.html` | `e5645753039dec849b12147bada2b54a1aa7e73ef84bf859e2bf5a8819d6b9e7` |
| `privacy/index.html` | `c417eef09fd86447c64b6c2118da972b72ebf850d928149e23f0d1673d053df3` |
| `terms/index.html` | `d8e5bde637377a3590dd5f119db0a29263b9c329f1604d5ae91548f5e76fd317` |
| `art/harbor-closeout-960.avif` | `ca28ac9b45e8772b386d34c9b3ed9ed9c28d3b5e80f125a75c5ce164f262b8d5` |
| `icons/icon-192.png` | `fe7a31ff04efacb19f90644a864d0db929473d6682c57cc920e4e7b12423ef63` |

## Required follow-up

1. Configure the static host with a restrictive CSP, anti-framing directive, and Permissions Policy.
2. Serve content-hashed `/assets/*` with a long-lived `immutable` cache policy while retaining short revalidation for HTML and `sw.js`.
3. Serve `manifest.webmanifest` with an appropriate manifest/JSON MIME type.
4. Preserve asset-form values on validation errors and add a regression test.
5. Re-deploy, then rerun this verification against the resulting URL and commit.
