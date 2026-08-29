# Closeout Kit — polish 4 handoff

## Outcome

Perfection-loop round 4 is complete. Release candidate `eb3ee257418771a273cc265a25e7d018f862eb73` was repaired against review `c6da3c681e64398241d51fa3aedcdab77577f995`; the deployed product repair is `25b522fa11b03cfc329a3ed84dc161d75dbd700f`.

F-4-1 is fixed: every unlocked real packet stage now uses a product-first, job-specific title. The browser regression creates a real encrypted packet, reloads and unlocks every deep link, and verifies the title, canonical URL, `og:url`, Open Graph title, Twitter title, h1, and focused heading.

All F-1, F-2, and F-3 findings were rechecked. The full mapping is in `.factory/polish-4.md`. No finding is deferred.

## Product and documentation changes

- Replaced all six real-stage titles with the exact product-first wording required by review 4.
- Added the real-stage metadata/deep-link/focus regression.
- Added a static contract test requiring one unique browser tag and exact command for every `.factory/claims.json` entry.
- Updated the catalog line to a 98-character verb-first description.
- Updated the copy audit with all real-stage titles and the catalog description.
- Bumped the visible/package build to 1.2.2 and the service-worker cache to v5.
- Preserved the harbor control-room visual system and the static offline PWA deployment class.

## Exact verification

Clean clone: `/tmp/client-offboarding-kit-polish-4.M5c4pF/repo` from `25b522fa11b03cfc329a3ed84dc161d75dbd700f`.

- `npm ci`: passed; 60 packages, 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 13/13 passed independently, each after its own `pretest:claims` build.
- `npm run test:claims`: 13/13 passed in the working checkout.
- `npm test`: 14/14 unit/config checks and 22/22 Chromium checks passed in both the working checkout and clean clone.
- `npm run build`: passed; `dist/index.html` exists.
- Production bundles: JavaScript 47.21 KB raw / 15.70 KB gzip; CSS 19.44 KB raw / 5.06 KB gzip.
- Playwright AxeBuilder: zero serious or critical violations across root, Privacy, Terms, 404, and all demo stages.
- Mobile: 390 × 844 first-screen content, no horizontal overflow, and 44 px targets passed on every tested route.
- Privacy: the full demo request log was same-origin GET-only with empty bodies and no sample/passphrase text.
- Offline: service-worker-controlled demo reload and client-packet export passed with the browser offline.
- Local URL verifier: no console errors; title, `lang=en`, one h1, main, alt text, and button names passed.
- Local Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.

## Deployment and cold live verification

Deployed with:

```bash
/opt/fleet/lib/deploy-static.sh client-offboarding-kit dist
```

Azure deployment ID: `4ec670d4-e926-439e-8612-26a925b6dd94`.

Cold live checks against <https://client-offboarding-kit.sociobot.in>:

- `/opt/fleet/lib/verify-url.sh`: passed with no console errors.
- Full live Playwright suite: 22/22 passed.
- `/`, `/demo`, six `/packet/<stage>` routes, `/privacy/`, and `/terms/`: HTTP 200.
- `/not-a-real-route` and `/404.html`: HTTP 404 with the designed recovery page.
- `/manifest.webmanifest`: `application/manifest+json`.
- Hashed JS: `Cache-Control: public, max-age=31536000, immutable`.
- `/sw.js`: `Cache-Control: no-cache, no-store, must-revalidate`.
- CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, nosniff, referrer, and permissions policies are present.
- Every real stage returned the expected product-first metadata and focused h1 after unlock; see `.factory/evidence/polish-4-live/real-route-metadata.json`.

## Evidence

- Local root screenshots/report: `.factory/evidence/polish-4-local/`
- Live root screenshots/report: `.factory/evidence/polish-4-live/`
- Live real-stage screenshot: `.factory/evidence/polish-4-live/real-assets-mobile.png`
- Live demo screenshot: `.factory/evidence/polish-4-live/demo-assets-mobile.png`
- Live route metadata: `.factory/evidence/polish-4-live/real-route-metadata.json`
- Live routing/header matrix: `.factory/evidence/polish-4-live/delivery.json`
- Finding-by-finding ledger: `.factory/polish-4.md`

## Run and verify

```bash
npm ci
npm run test:claims
npm test
npm run build
```

## Known gaps and next steps

None. The cumulative review has no unresolved finding.
