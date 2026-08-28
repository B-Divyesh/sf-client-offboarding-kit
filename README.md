# Closeout Kit

Closeout Kit is a browser app for freelance developers and web studios finishing client projects.

It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement.

Live product: <https://client-offboarding-kit.sociobot.in>

Try the isolated sample: <https://client-offboarding-kit.sociobot.in/demo>

## What it does

- Collect project details, assets, owners, account tasks, support dates, and acknowledgement.
- Require confirmation of each access task in the original service.
- Reject common password, API-token, and private-key patterns.
- Encrypt packets in the browser before saving them in browser storage (technical: IndexedDB).
- Download a client HTML packet, an encrypted backup, and a client acknowledgement form.
- Import encrypted backups and client acknowledgement receipts.
- Keep working offline after the first visit.
- Create and export a packet without purchase.

The app does not move accounts, host files, migrate a CMS, or test client access.

Complete those actions in the original hosting, domain, CMS, or account service.

Every customer-facing statement above maps to one tagged browser test in [`.factory/claims.json`](.factory/claims.json).

## Try the sample

Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet.

The banner identifies sample mode. “Reset demo” restores the sample, and “Start for real” removes sample storage.

The sample uses separate browser storage (technical name: `demo:closeout-kit-v1`). It never reads or writes `closeout-kit-v1`.

See [`.factory/demo.md`](.factory/demo.md) for the sample contents and reset contract.

## Run locally

Use Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite.

## Test and build

```bash
npm test
npm run test:claims
npm run build
```

`npm test` runs unit tests and creates a production build. The tests open the app in Chromium and check accessibility, phone layout, exports, and offline use.

The build output is `dist/`, with `dist/index.html` at its root.

## Deploy

Deploy `dist/` as an Azure Static Web App. The factory work order uses:

```bash
/opt/fleet/lib/deploy-static.sh client-offboarding-kit dist
```

The hosting file keeps app URLs, the 404 page, security headers, caches, and web-app manifest delivery working.

## Privacy and recovery

Closeout Kit has no analytics or product account. Packet content stays in the browser unless you export and share a file.

Keep the encrypted JSON backup and its passphrase separately. See the hosted [privacy page](https://client-offboarding-kit.sociobot.in/privacy/).

## Project notes

- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Verification evidence: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
