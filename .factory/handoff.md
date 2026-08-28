# Closeout Kit — polish 3 handoff

## Outcome

Perfection-loop round 3 is complete with no unresolved review findings.

- Repaired release candidate: `41299fc997a1f6295df4d78ae191a6f58777b1d7`
- Product repair commits: `c2e06a2f4166b5a45ed50e5bd6a205f55b49e1ea` and `c5b2ce681fe39eef5abeaa2057c5668eb26007d9`
- Version: 1.2.1
- Deployed Static Web Apps deployment: `f4368755-2dc7-49b6-b95b-7384078cab00`
- Live URL: <https://client-offboarding-kit.sociobot.in>

The first screen now states the real commercial condition, “No purchase required,” and that statement has a clean, observable create-and-export claim test. All demo stages now use short product-first titles with matching Open Graph and Twitter metadata. The repair also adds full-public-route AxeBuilder coverage and keeps the original harbor control-room visual system intact.

## Verification

### Fresh clone

From a new `git clone --no-local` at `c5b2ce681fe39eef5abeaa2057c5668eb26007d9` with no `dist/`:

1. `npm ci` passed with Node 22.23.2 and no vulnerabilities.
2. Every one of the 13 exact commands listed in `.factory/claims.json` passed, each creating its own build through `pretest:claims`.
3. `npm test` passed: 12 unit/config tests and 21 Chromium browser tests.
4. `npm run build` passed and produced `dist/index.html`.
5. Registry audit found 13 unique claim IDs and exactly one `@claim:<id>` test tag per entry.

The claims include demo isolation/reset, encrypted storage, offline reload/export, same-origin request privacy, no-purchase real flow, credential rejection, access confirmation, packet export, backup restore, client receipt round trip, workflow boundaries, no recovery, and art provenance.

### Build and local browser evidence

- Production bundle: JavaScript 47.13 KB raw / 15.70 KB gzip; CSS 19.44 KB raw / 5.06 KB gzip.
- Local cold verifier passed title, `lang`, one h1, main landmark, image alt attributes, button names, and console errors: `.factory/evidence/polish-3-local/verify.json`.
- Local screenshots: `.factory/evidence/polish-3-local-mobile-home.png` and `.factory/evidence/polish-3-local-desktop-demo-assets.png`.

### Live recheck after deployment

- `PLAYWRIGHT_BASE_URL=https://client-offboarding-kit.sociobot.in npm test` passed all 21 browser checks on the deployed site, including all claims, offline reload, titles/metadata, focus/history, 390 px layout, 44 px targets, and route accessibility.
- Fresh cold URL verifier passed with no console errors: `.factory/evidence/polish-3-live/verify.json`.
- Cold live screenshots: `.factory/evidence/polish-3-live-mobile-home.png` and `.factory/evidence/polish-3-live-desktop-demo-assets.png`.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, CLS 0, TBT 110 ms. Raw result: `.factory/evidence/polish-3-live/lighthouse-mobile.json`.
- Live routes returned 200: `/`, `/demo`, every `/packet/<stage>`, `/privacy/`, and `/terms/`. `/404.html` and `/not-a-real-route` returned the styled 404 with HTTP 404.
- Live headers confirm CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, Permissions-Policy, nosniff, referrer policy, immutable hashed assets, `sw.js` no-store, and `application/manifest+json` for the manifest.

The standalone `@axe-core/cli` ChromeDriver command could not start in this container because its bundled driver is version 152 while the preinstalled Chrome is 145. The executed Playwright AxeBuilder suite audited root, Privacy, Terms, the 404, and all six demo stages, with zero serious or critical violations; this is an environment-tool mismatch, not a product gap.

## Run, test, deploy

```bash
npm ci
npm run dev
npm test
npm run test:claims
npm run build
/opt/fleet/lib/deploy-static.sh client-offboarding-kit dist
```

Try the isolated sample at `/demo` or `/?demo=1`. Reset restores the Northstar sample; Start for real discards demo storage. See `.factory/demo.md` for storage isolation details and `.factory/polish-3.md` for every review finding mapping.

## Known gaps

None. No payment offer is shown because checkout is not enabled; the full product workflow is truthfully available without purchase.
