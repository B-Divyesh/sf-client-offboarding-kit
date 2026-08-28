# Closeout Kit

Closeout Kit is a browser app for freelance developers and web studios finishing client projects.

It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement.

Live product: <https://client-offboarding-kit.sociobot.in>

Try the isolated sample: <https://client-offboarding-kit.sociobot.in/demo>

## What it does

- Collect project details, assets, owners, account tasks, support dates, and acknowledgement.
- Require confirmation of each access task in the original service.
- Reject common password, API-token, and private-key patterns.
- Encrypt packets in the browser before saving them in IndexedDB.
- Download a client HTML packet, an encrypted backup, and a client acknowledgement form.
- Import encrypted backups and client acknowledgement receipts.
- Keep working offline after the first visit.

The app does not move accounts, host files, migrate a CMS, or test client access.

Complete those actions in the original hosting, domain, CMS, or account service.

Every statement above maps to a tagged browser test in [`.factory/claims.json`](.factory/claims.json).

## Try the sample

Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet.

The banner identifies sample mode. “Reset demo” restores the sample, and “Start for real” removes sample storage.

Sample data uses the separate `demo:closeout-kit-v1` IndexedDB database. It never reads or writes `closeout-kit-v1`.

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

`npm test` runs unit tests and creates a production build. It also checks Chromium flows, accessibility, mobile layout, exports, and offline reload.

The build output is `dist/`, with `dist/index.html` at its root.

## Deploy

Deploy `dist/` as an Azure Static Web App. The factory work order uses:

```bash
/opt/fleet/lib/deploy-static.sh client-offboarding-kit dist
```

`staticwebapp.config.json` supplies route rewrites, the 404 response, security headers, cache rules, and manifest MIME type.

## Privacy and recovery

Closeout Kit has no analytics or product account. Packet content stays in the browser unless you export and share a file.

Keep the encrypted JSON backup and its passphrase separately. See the hosted [privacy page](https://client-offboarding-kit.sociobot.in/privacy/).

## Project notes

- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Verification evidence: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
