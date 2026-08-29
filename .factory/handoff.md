# Closeout Kit — review 5 handoff

## Outcome

Independent adversarial review 5 passed with zero findings. This review made no product-code changes. It added the review record and replaced this handoff with current verification evidence.

## Verification

- Fresh live 390 × 844 and 1440 × 900 first reads clearly identify the job, audience, and first action.
- Live `/demo` immediately showed realistic Northstar Arts sample data, isolated it in `demo:closeout-kit-v1`, reset it successfully, and showed the required demo banner/actions.
- A fresh-clone checkout at `/tmp/client-offboarding-kit-review-5.B1YmPA/repo` passed `npm ci`, all 13 exact registered claim commands, `npm test`, and `npm run build`.
- The live-origin Playwright suite passed 22/22 tests, including all claims, offline reload/export, route metadata/history/focus, touch targets, and Axe serious/critical checks.
- Live crawl: root, demo, six packet routes, legal pages, manifest, Source, and all three sample-provider links returned 200. Unknown routes correctly returned the designed HTTP 404.
- Live headers confirmed CSP/frame denial, nosniff, referrer and permissions policy; manifest MIME; immutable hashed assets; and no-store service worker.

## Run and verify

```bash
npm ci
npm run test:claims
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://client-offboarding-kit.sociobot.in npx playwright test --project=chromium
```

## Known gaps and next steps

None. Future releases should repeat the clean-clone claims, live crawl, and phone cold-read checks recorded in `.factory/review-5.md`.
