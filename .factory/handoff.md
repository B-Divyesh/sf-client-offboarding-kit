# Closeout Kit — review 6 handoff

## Outcome

Independent review 6 made no product-code changes. The result is **FAIL**: one public update promise is not listed or tested as a claim. See `.factory/review-6.md`.

## Verification

- Fresh live 390 × 844 and 1440 × 900 reads clearly identify the job, audience, and first action.
- Live demo has the filled Northstar Arts sample, the persistent sample label, reset, exit, encrypted isolated storage, offline reload/export, and client receipt/backup workflows.
- A new clean clone at `/tmp/client-offboarding-kit-review-6.BHu5PK/repo` passed `npm ci`, all 13 separately invoked registered claim commands, `npm test`, and `npm run build`.
- The live-origin Playwright suite passed its 22 tests, including claims, accessibility, keyboard landmarks, mobile targets, route metadata/history/focus, and Axe serious/critical checks.
- The supplied URL verifier passed with zero console errors and confirmed title, language, main, image alt text, and button labels. Routes, headers, 404, manifest, service worker, sitemap, and sample provider links were checked live.
- The live hashed JS/CSS names exactly match implementation `25b522f`. Documentation SHA is `2ea581b`.

## Run and verify

```bash
npm ci
npm run test:claims
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://client-offboarding-kit.sociobot.in npx playwright test --project=chromium
```

## Remaining work

Register and test the conditional “A new version is ready / Reload and update” service-worker behavior, or remove that promise. A test must create a waiting worker, invoke the control, and verify controller change and reload. Then rerun its exact clean-clone claim command and this review loop.
