# Closeout Kit

Closeout Kit is a local-first PWA for freelance developers and web studios finishing a client engagement. It turns scattered links, ownership notes, transfer tasks, support promises, and client acknowledgement into one portable closeout packet—without becoming a password vault.

Live product: <https://client-offboarding-kit.sociobot.in>

## What it does

- Guides a closeout through engagement details, assets, ownership, external transfer/revoke actions, support boundaries, and acknowledgement.
- Requires explicit confirmation that access changes were verified in the real external system.
- Rejects common password, API-token, and private-key patterns; there are no credential fields.
- Stores drafts in IndexedDB as AES-GCM ciphertext derived from a user passphrase. The passphrase stays in memory and cannot be recovered by the service.
- Exports a standalone client HTML file, a print/PDF-ready view, and an encrypted JSON backup.
- Imports encrypted backups and continues working after an offline reload.
- Offers a $29 one-time Studio license for multiple packets, duplication, and export branding. Checkout and license verification use only the Sociobot billing API.

The app does not move accounts, host files, migrate a CMS, or validate that a recipient can sign in. Those actions remain in their systems of record.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. No environment variables or backend are required for the free workflow.

## Test and build

```bash
npm test
npm run build
```

`npm test` runs unit tests, a reproducible production build, Chromium end-to-end tests, axe serious/critical checks, a 390 px layout pass, a full export path, and offline refresh/restore tests. Playwright is pinned to `1.58.2`.

The deploy command is exactly:

```bash
npm run build
```

Static output lands in `dist/`, with `dist/index.html` at its root. Deploy the directory as a static site. The service worker and manifest are included automatically.

## Privacy and recovery

Closeout Kit has no analytics or product account. Packet content never leaves the browser unless the user exports and shares it. License verification sends only the supplied license token to `https://api.sociobot.in` at most once per day. See [/privacy](/privacy/) and [/terms](/terms/) in the deployed app.

Because encryption is local, losing both the passphrase and an unlocked browser session makes packet recovery impossible. Users should keep the encrypted JSON backup and its passphrase separately.

## Project notes

- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Build and verification record: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
