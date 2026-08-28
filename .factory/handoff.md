# Closeout Kit polish 2 handoff

## Outcome

Perfection-loop round 2 is complete. F-2-1 through F-2-9 are fixed, and every F-1 finding was rechecked on the deployed product.

Live product: <https://client-offboarding-kit.sociobot.in>

Implementation commit: `6a20ea9` (`fix: resolve adversarial polish findings`). The final evidence commit contains this handoff, the cumulative map, tests, and screenshots.

## What changed

- Made each claim command self-contained by building before its Playwright run.
- Strengthened demo reset, private-network, full-backup-restore, and real acknowledgement receipt tests.
- Replaced dead sample records with stable public provider pages and added a crawl assertion.
- Put all three required facts above the passphrase form on the 390 px first screen.
- Raised mobile navigation, footer, banner, record, legal, and workflow targets to at least 44 px.
- Completed 404 sharing metadata and added all six packet routes to the sitemap.
- Replaced vague landing headings and generic stage buttons with literal destination names.
- Rewrote README technical details in outcome-first language.
- Updated `.factory/claims.json`, `.factory/demo.md`, `.factory/copy-audit.md`, `.factory/catalog-description.txt`, and `.factory/polish-2.md`.
- Bumped the product build to 1.2.0 and service-worker cache to `closeout-kit-v4`.

The harbor control-room art, deep teal/amber palette, serif/sans pairing, clipped surfaces, and route-instrument layout were preserved.

## Verification

### Clean repository

- `npm ci`: pass; 60 packages, zero vulnerabilities.
- Every exact command in `.factory/claims.json`: pass from a clone with no `dist/`; each command ran its own build.
- `npm test`: pass; 12 unit/config tests, production build, and 19 Chromium tests.
- `npm run build`: pass; `dist/index.html` produced.
- Claim registry audit: 12 entries and exactly one matching `@claim:<id>` tag for each entry.

### Browser, accessibility, privacy, and offline

- Local and live browser suites cover all claims, full backup equality, the executed client receipt form, routes/history/focus, live link status, axe, keyboard landmarks, phone layout, and touch targets.
- Axe integration reports zero serious or critical issues across all six demo stages.
- The 390 × 844 test verifies no horizontal overflow and all three first-screen facts are in the viewport.
- The 390 px target audit checks root, Privacy, Terms, 404, and all six demo stages; no visible target is smaller than 44 × 44 px.
- The private-network test visits every stage, exports a packet, and confirms all requests are same-origin GET requests with empty bodies and no seeded packet or passphrase text.
- The offline claim reloads the service-worker-controlled demo offline and downloads the client packet.
- `/opt/fleet/lib/verify-url.sh https://client-offboarding-kit.sociobot.in`: HTTP 200, 733 ms load, no console errors, title/lang/main/one h1/alt/button checks pass.

### Performance and delivery

- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Live metrics: FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 0 ms.
- Production entry payload: 46.84 KB JS raw / 15.65 KB gzip; 19.44 KB CSS raw / 5.06 KB gzip.
- Root, Demo, all packet stages, Privacy, and Terms return HTTP 200.
- Unknown paths and `/404.html` return the designed page with HTTP 404.
- Live responses include CSP, `frame-ancestors 'none'`, X-Frame-Options DENY, Permissions-Policy, nosniff, and referrer policy.
- The manifest is `application/manifest+json`; hashed assets are one-year immutable; `sw.js` is no-store.
- The custom domain serves the deployed 1.2.0 JS bundle.

## Evidence

- Finding map: `.factory/polish-2.md`
- Claims: `.factory/claims.json`
- Sample contract: `.factory/demo.md`
- Copy audit: `.factory/copy-audit.md`
- Cold live phone: `.factory/evidence/polish-2-live-mobile-home.png`
- Filled live demo: `.factory/evidence/polish-2-live-desktop-demo-assets.png`

## Known gaps and next steps

None. No review finding, deferred minor item, stub, or TODO remains.
