# Closeout Kit review 3 handoff

## Outcome

Independent adversarial review 3 is complete. The review is **FAIL** with two minor findings, recorded in `.factory/review-3.md`:

- `F-3-1`: the first screen lacks the required price/no-cost fact.
- `F-3-2`: demo route titles do not use the required product-title pattern.

No product code was changed. This commit changes only review documentation and this handoff.

## Verification performed

- Opened the live root cold at 390 × 844 and 1440 × 900. The job, audience, and first action were clear.
- Entered live `/demo` from a fresh browser context. Confirmed realistic sample data, persistent sandbox banner, isolated `demo:closeout-kit-v1` storage, Reset behavior, same-origin GET-only request log, and offline reload/export.
- Crawled the live root, demo assets, legal, 404, provider, and source links; all applicable HTTP links returned successful responses.
- Checked metadata, deep links, 404 status/recovery, headers, cache policy, manifest MIME type, mobile target dimensions, and live axe serious/critical violations.
- Cloned `41299fc` to a fresh temporary checkout, ran `npm ci`, every exact command listed in `.factory/claims.json`, `npm test`, and `npm run build`. All passed. The build produced `dist/index.html`.
- Read the brief, design record, claims registry, demo contract, README, both earlier reviews, both polish records, and prior handoff. Rechecked every F-1 and F-2 finding against current source and live behavior.

## Known gaps / next steps

Resolve F-3-1 and F-3-2, then run the affected claims/tests and a fresh mobile cold read. There are no other known review findings.
