# Closeout Kit v1 handoff

## Independent verification status (2026-08-28): **FAIL**

Candidate `80abb1cd1c003ac230480642e99e7bdcfaaeaac4` was independently built and tested from a clean checkout, then hash-compared with https://client-offboarding-kit.sociobot.in. The live deployment exactly matches the candidate and the functional, accessibility, privacy, offline-reload, desktop, and mobile checks pass. It cannot be accepted yet because production headers omit CSP/frame/permissions policy and serve content-hashed assets with `Cache-Control: public, must-revalidate, max-age=30` rather than long-lived immutable caching. The manifest is also `application/octet-stream`, and asset-form validation clears entered values.

See [`.factory/verification.md`](verification.md) for commands, evidence, exact live hashes, severity-ranked defects, and required follow-up. This verification record supersedes the self-reported PASS below; no product code was changed by the verifier.

## Shipped

- Six-stage client closeout route: engagement, assets/ownership, transfer and revoke actions, support window, client acknowledgement, and export.
- Explicit external-system verification for every completed access action; common secret/API-token/private-key patterns are rejected.
- AES-GCM encrypted IndexedDB persistence with PBKDF2-derived keys, session-only passphrases, lock/unlock, encrypted JSON backup, and encrypted import.
- Standalone styled HTML client packet and browser print/PDF path. Exports remain available in the free tier.
- Offline PWA with versioned shell/runtime caches, offline fallback, install manifest, 192/512/maskable icons, safe-area handling, and visible offline/update status.
- $29 one-time Studio unlock using the Sociobot API contract: hosted checkout, returned-license capture, local token storage, once-daily verification cache, paste-to-restore, multi-packet library, duplication, and export branding. No product ID is hardcoded beyond the required product slug.
- Dedicated privacy and terms pages, no analytics or third-party runtime assets.
- Original factory-generated harbor scene with responsive AVIF/WebP and JPEG fallback, original hand-authored app mark, and complete prompt/provenance in `.factory/design.md` and `assets/src/`.

## Run and deploy

```bash
npm install
npm test
npm run build
```

Deploy `dist/`. The exact build command is `npm run build`; output includes `dist/index.html` at the root.

## Verification (2026-08-28)

- `npm test`: passes 5 unit tests and 6 browser checks across desktop Chromium and a 390 × 844 mobile viewport; 2 project duplicates are intentionally skipped. Coverage includes full acknowledgement/export, encrypted refresh restore, explicit offline reload, mobile overflow, and axe serious/critical violations.
- `npm run build`: passes TypeScript and Vite production build.
- Production payload: 37.57 KB JS / 15.62 KB CSS uncompressed (13.27 KB / 4.32 KB gzip); no font payload; preferred hero AVIF is 16 KB mobile and 32 KB desktop (with 24/52 KB WebP and 104 KB JPEG fallback).
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, total blocking time 0 ms.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, 541 ms measured load, title and `lang=en` present, exactly one h1, main landmark present, zero missing alt attributes, zero unlabeled buttons, and zero page/console errors.
- Service-worker offline test: packet created and encrypted online, page refreshed under `context.setOffline(true)`, same packet unlocked and restored from IndexedDB.
- `dist/` contains `index.html`, privacy and terms entry points, manifest, service worker, offline page, icons, and local artwork.

## Known boundaries / next steps

- The factory still needs to register and price the live `client-offboarding-kit` product in the Sociobot billing engine. The UI already uses the production slug-based checkout and verification endpoints; no payment provider is embedded.
- PDF creation intentionally uses the browser’s print dialog so the static app needs no PDF engine. HTML is the canonical portable artifact.
- Passphrases cannot be recovered, by design. The UI explains this before packet creation and offers encrypted backup export.
- Closeout Kit records and confirms external actions but cannot prove access or transfer ownership itself; users must verify each system of record.
