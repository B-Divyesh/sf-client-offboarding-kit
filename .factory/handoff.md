# Closeout Kit — repair 1 handoff

## Outcome

Repair 1 is complete and deployed at <https://client-offboarding-kit.sociobot.in>.

The product builds a client closeout packet for freelance developers and web studios. The first action is **Try it with sample data**.

- Implementation SHA: `9bfbac65bee4ae7b708a91fa0f69613875a8d08e`
- Verification evidence SHA: `d7cecf0f334cdffb36d35910eda363fc695fe75f` (documentation-only, after the implementation)
- Product version: `1.2.3`
- Service-worker cache version: `closeout-kit-v6`
- Deployment ID: `de322216-e3db-42fb-9dc5-6ac309e66c35`
- Deployed asset: `assets/main-7oRKs5S1.js`

## Review 6 repair

F-6-1 is fixed at its cause.

- Added registered claim `update-reload` for the conditional update notice.
- Added one outcome-based Playwright test in a fresh browser context.
- The test installs the current worker and creates a byte-distinct waiting worker.
- It confirms that the current worker stays active until the visitor acts.
- It invokes **Reload and update**, then verifies controller replacement and a real page reload.
- Service-worker registration now watches a worker that is already installing when `register()` resolves. This closes the deployment-time event race.
- The update button changes to **Updating…** and disables after activation begins.
- The offline claim now also uses its own fresh browser context.

The live update probe recorded:

```text
controller before: /sw.js
waiting worker:    /sw.js?repair-live-update=1
controller after: /sw.js?repair-live-update=1
navigation type:  reload
```

## Clean-checkout verification

A new clone at `/tmp/client-offboarding-kit-repair-1.gwwr3X/repo` ran the documented setup with no existing `dist/` or dependencies.

```bash
npm ci
# every exact command in .factory/claims.json, invoked separately
npm test
npm run build
```

Results:

- `npm ci`: 60 packages, zero vulnerabilities.
- All 14 registered claim commands passed separately, including `@claim:update-reload`.
- `npm test`: 14 unit/config checks and 23 Chromium checks passed.
- `npm run build`: passed and produced `dist/index.html`.
- JavaScript: 47.38 kB raw / 15.77 kB gzip.
- CSS: 19.44 kB raw / 5.06 kB gzip.

## Local and live verification

- Local and live URL verifier: HTTP 200, correct title and language, one h1, main landmark, alt text, named buttons, and zero console errors.
- Local Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 0 ms, CLS 0.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0.
- Live Playwright: all 23 tests passed, including all claims and integrated Axe serious/critical checks.
- Reduced motion changes animation and transition durations to `0.01ms`.
- Keyboard focus shows a 3 px amber ring on the skip link. Mobile checks found no horizontal overflow or target below 44 px.
- Root, demo, six packet routes, legal pages, manifest, robots, and sitemap return 200.
- `/404.html` and an unknown route deliberately return the designed 404 with HTTP 404.
- Live CSP, frame denial, permissions policy, manifest MIME, immutable hashed-asset caching, and no-store service-worker delivery pass.

Fresh phone and desktop checks confirmed the job, audience, sample action, and three facts before scrolling. The demo opened the Northstar Arts packet with three assets. Reset restored the sample. Start for real removed demo storage and left the real database empty.

Evidence:

- `.factory/evidence/repair-1-local/verify.json`
- `.factory/evidence/repair-1-local/lighthouse-mobile.json`
- `.factory/evidence/repair-1-live/verify.json`
- `.factory/evidence/repair-1-live/lighthouse-mobile.json`
- `.factory/evidence/repair-1-live/home-phone.png`
- `.factory/evidence/repair-1-live/demo-phone.png`
- `.factory/evidence/repair-1-live/demo-desktop.png`
- `.factory/evidence/repair-1-live/update-ready-desktop.png`

## Earlier finding disposition

- Review 1 F-1-1 through F-1-63: remain fixed. Current proof covers demo isolation, encryption, privacy requests, credential rejection, exports, acknowledgement, recovery, routing, metadata, delivery headers, accessibility, and clean setup.
- Review 2 F-2-1 through F-2-9: remain fixed. Every claim self-builds, sample links resolve, phone facts and targets pass, metadata is complete, and labels remain direct.
- Review 3 F-3-1 and F-3-2: remain fixed. No purchase is required, and demo titles are product-first.
- Review 4 F-4-1: remains fixed. Every real packet route has product-first title and matching metadata.
- Review 5: its zero-finding state remains intact.
- Review 6 F-6-1: fixed by the registered and passing `update-reload` claim.

## Known gaps and next steps

No review finding remains open.

This is a static local-first PWA, so backend tenant, restart, health, and 429 checks do not apply. The base candidate had no advertised paid offer or billing runtime; this repair did not invent an unregistered offer. Any future paid feature still depends on the separate billing-registration operator.

For the next release, keep the exact per-claim clean-checkout loop and the live waiting-worker test.
