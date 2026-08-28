# Review 1 handoff

## Outcome

Adversarial first-read review 1 is complete. The verdict is **FAIL**. No product code was modified.

The full report is `.factory/review-1.md`. It records 63 findings, including 10 blocking findings: unclear first screen, no isolated sample demo, no claims registry/tests, dead Studio checkout, broken 404 and stage routing, and all four unresolved defects from the earlier independent verification.

## Verification performed

- Opened the live root cold in fresh Chromium contexts at 390 × 844 and 1440 × 900; captured above-fold text and screenshots in `/tmp`.
- Exercised `/demo/` and `/?demo=1`; confirmed no sample/banner/reset and confirmed query-demo writes the real `closeout-kit-v1` IndexedDB namespace.
- Ran `npm ci` and `npm test`: 5 unit tests passed, the production build passed, 6 Playwright tests passed, and 2 project duplicates were intentionally skipped.
- Recorded live request logs during create/save/offline reload; requests stayed same-origin and offline reload worked.
- Ran live axe scans on root, Privacy, Terms, an unknown route, and `/demo/`: zero reported violations.
- Crawled internal/external links and metadata. Privacy, Terms, and Source returned 200; Studio checkout returned 404.
- Checked deployed security/cache/MIME headers and reproduced the prior asset-form data-loss defect.
- Read `.factory/brief.json`, `.factory/design.md`, README, the prior handoff, and `.factory/verification.md`; no earlier review/polish files exist.

## Commands

```bash
npm ci
npm test
```

Additional evidence commands were Playwright scripts against `https://client-offboarding-kit.sociobot.in`, `curl -I` header/status checks, and source inspection with `rg`/`sed`.

## Work left

All findings in `.factory/review-1.md` remain. The next implementation round should start with F-1-1 through F-1-10, add demo and claims contracts, then address structure/copy/unlisted claims before redeploying and requesting a new independent review.
