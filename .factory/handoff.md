# Closeout Kit polish 1 handoff

## Outcome

All 63 findings from `.factory/review-1.md` are implemented. The product keeps its harbor control-room identity and remains a static offline PWA.

The unavailable Studio offer was removed. The free workflow now includes a client acknowledgement form and receipt import.

## Product changes

- Rewrote the first screen around the job, audience, sample action, and three tested facts.
- Added a filled one-click demo at `/demo` and `?demo=1`.
- Isolated sample storage in `demo:closeout-kit-v1`; real packets remain in `closeout-kit-v1`.
- Added Reset demo and Start for real controls that delete sample storage.
- Added real stage URLs, History API navigation, per-stage titles, h1 focus, and route announcements.
- Added a client acknowledgement HTML form and validated receipt import.
- Added a styled 404 with host-level 404 status configuration.
- Added shared headers/footers, legal navigation, canonical/OG/Twitter metadata, social art, SVG favicon, and Apple touch icon.
- Added CSP/framing/permissions headers, immutable hashed-asset caching, and manifest MIME configuration.
- Fixed asset validation so all entered fields remain and the invalid field receives an announced error and focus.
- Removed the broken Studio checkout and every unverified price/entitlement claim.

## Verification

Fresh-clone results for repair commit `f6e8332aa9f3a0bccea5a9015ec436ff3df123c7`:

```text
npm test
  PASS — 10 unit/config tests
  PASS — production TypeScript/Vite build
  PASS — 16 Chromium integration/browser tests

npm run test:claims
  PASS — 12/12 tagged claim tests

npm run build
  PASS — dist/index.html
  JS 46.63 KB raw / 15.60 KB gzip
  CSS 19.00 KB raw / 5.01 KB gzip

/opt/fleet/lib/verify-url.sh http://127.0.0.1:5173 ...
  PASS — 560 ms load, no console/page errors, title/lang/main/one h1/alts/button names

Lighthouse 12.8.2 against production preview
  Performance 100
  Accessibility 100
  Best Practices 100
  SEO 100
  FCP 1.1 s · LCP 1.4 s · CLS 0 · TBT 0 ms
```

Cold production checks at <https://client-offboarding-kit.sociobot.in> after the final deployment:

```text
Lighthouse 12.8.2
  Performance 100
  Accessibility 100
  Best Practices 100
  SEO 100
  FCP 0.9 s · LCP 1.1 s · CLS 0 · TBT 10 ms

Offline browser check
  PASS — service worker controlled /demo?stage=export
  PASS — cold offline reload showed the saved Northstar sample
  PASS — offline export downloaded northstar-arts-website.html
  PASS — no console or page errors

Delivery checks
  PASS — /, /demo, /packet/assets, /privacy/, and /terms/ return 200
  PASS — unknown routes and /404.html return the designed page with status 404
  PASS — manifest MIME, no-store service worker, security headers, and frame denial
```

Evidence:

- Finding map: `.factory/polish-1.md`
- Claims: `.factory/claims.json`
- Demo contract: `.factory/demo.md`
- Copy audit: `.factory/copy-audit.md`
- Screenshots and Lighthouse JSON: `.factory/evidence/`

## Run and deploy

```bash
npm ci
npm test
npm run test:claims
npm run build
/opt/fleet/lib/deploy-static.sh client-offboarding-kit dist
```

## Known gaps

None in the reviewed scope. Studio remains intentionally absent until its Sociobot billing product is enabled.

The first live audit found that precaching the intentional `/404.html` response prevented service-worker installation. The URL was removed from precache, a regression test was added, and the site was redeployed before handoff.

Repair commits: `3c60095` (cumulative review repair) and `f6e8332` (live service-worker regression repair). The final product build was deployed from `f6e8332`.
