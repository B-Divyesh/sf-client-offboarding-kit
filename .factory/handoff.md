# Closeout Kit — review 4 handoff

## Outcome

Adversarial first-read review 4 is complete and committed as review evidence only. No product code was modified.

**Verdict: FAIL** — one minor standards finding remains:

- **F-4-1:** unlocked real packet routes use product-last titles such as `Assets — Closeout Kit` rather than the required `Closeout Kit — …` pattern. See `.factory/review-4.md`.

## Verification performed

- Cold live checks at 390 × 844 and 1440 × 900 confirmed the job, audience, and first action are clear before scrolling.
- Fresh `/demo` opens realistic Northstar Arts sample data. Reset restored the seed in three isolated contexts; banner, exit, isolated IndexedDB, and offline export were checked.
- Live request inspection found only same-origin GET-only demo traffic with empty bodies.
- A fresh clone ran `npm ci`, every exact `.factory/claims.json` command, `npm run test:claims` (13 passed), and `npm test` (12 unit/config and 21 Chromium checks passed).
- The deployed 21-test Chromium suite passed. Headers, metadata, 404 response, links, accessibility coverage, mobile targets, and visual identity were rechecked.
- All prior F-1, F-2, and F-3 findings were rechecked and confirmed fixed. Full evidence and the copy audit are in `.factory/review-4.md`.

## How to verify

```bash
npm ci
npm run test:claims
npm test
npm run build
```

Try the isolated sample at `/demo`. The remaining check is to create or unlock a real packet at every `/packet/<stage>` route and verify product-first title and matching OG/Twitter metadata.

## Known gap / next step

Change the six real stage titles in `src/main.ts` to the product-first pattern and extend the route metadata browser test. Re-run review 4 after that change.
