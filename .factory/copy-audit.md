# Copy audit

Audited 28 August 2026. Word counts use whitespace-delimited words. Commands and file paths are excluded.

No line exceeds 22 words. No banned term appears; “unlock” is used only for the literal action that opens an encrypted packet.

## Landing page

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Pass |
| 2 | Closeout Kit | Pass |
| 3 | Client handoff packets | Pass |
| 1 | Home | Pass |
| 1 | Demo | Pass |
| 1 | Privacy | Pass |
| 1 | Terms | Pass |
| 6 | Client handoff tool for freelancers and studios | Pass |
| 6 | Build a client closeout packet. | Pass |
| 10 | For freelance developers and web studios handing finished projects to clients. | Pass |
| 5 | Try it with sample data | Pass |
| 8 | Opens a filled six-stage packet; your packets stay unchanged. | Pass |
| 4 | Create a packet passphrase | Pass |
| 2 | Confirm passphrase | Pass |
| 13 | Use at least 10 characters. Keep the passphrase because the app cannot recover it. | Pass |
| 3 | Create your packet | Pass |
| 3 | Encrypted before saving | Pass |
| 3 | No purchase required | Pass |
| 6 | Works offline after the first visit | Pass |
| 3 | Filled packet preview | Pass |
| 5 | Preview a filled client packet. | Pass |
| 13 | The sample shows assets, owners, access tasks, support dates, and acknowledgement in one packet. | Pass |
| 4 | Open the sample packet | Pass |
| 4 | Six packet stages | Pass |
| 7 | Complete the packet in six stages. | Pass |
| 1 | Engagement | Pass |
| 1 | Assets | Pass |
| 2 | Access tasks | Pass |
| 1 | Support | Pass |
| 1 | Acknowledgement | Pass |
| 1 | Export | Pass |
| 3 | How it works | Pass |
| 8 | Create and send a packet in three steps. | Pass |
| 4 | 1. List the project. | Pass |
| 7 | Add asset links, owners, and support dates. | Pass |
| 5 | 2. Confirm access tasks. | Pass |
| 7 | Check each change in the original service. | Pass |
| 5 | 3. Send the packet. | Pass |
| 8 | Export the packet and import the client’s receipt. | Pass |
| 3 | Privacy and limits | Pass |
| 6 | Keep credentials out of the packet. | Pass |
| 10 | The app rejects common secret patterns. Share credentials through your password manager. | Pass |
| 14 | It does not move accounts, host files, migrate a CMS, or test client access. | Pass |
| 11 | Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 9 | Packet data is encrypted before this browser saves it. | Pass |
| 5 | Built by Param Factory | Pass |
| 2 | Generated artwork | Pass |

The demo banner adds these lines:

| Words | Copy | Result |
| ---: | --- | --- |
| 7 | Demo — sample data, nothing is saved | Pass |
| 6 | Changes stay separate from your packets. | Pass |
| 2 | Reset demo | Pass |
| 3 | Start for real | Pass |

## README

| Words | Copy | Result |
| ---: | --- | --- |
| 14 | Closeout Kit is a browser app for freelance developers and web studios finishing client projects. | Pass |
| 15 | It creates one packet from asset links, owners, access tasks, support dates, and client acknowledgement. | Pass |
| 12 | Collect project details, assets, owners, account tasks, support dates, and acknowledgement. | Pass |
| 9 | Require confirmation of each access task in the original service. | Pass |
| 8 | Reject common password, API-token, and private-key patterns. | Pass |
| 13 | Encrypt packets in the browser before saving them in browser storage (technical: IndexedDB). | Pass |
| 12 | Download a client HTML packet, an encrypted backup, and a client acknowledgement form. | Pass |
| 7 | Import encrypted backups and client acknowledgement receipts. | Pass |
| 7 | Keep working offline after the first visit. | Pass |
| 7 | Create and export a packet without purchase. | Pass |
| 14 | The app does not move accounts, host files, migrate a CMS, or test client access. | Pass |
| 11 | Complete those actions in the original hosting, domain, CMS, or account service. | Pass |
| 17 | Open `/demo` or `/?demo=1` to load the filled Northstar Arts website packet. | Pass |
| 9 | The sample uses separate browser storage (technical name: `demo:closeout-kit-v1`). | Pass |
| 8 | It never reads or writes `closeout-kit-v1`. | Pass |
| 15 | `npm test` runs unit tests and creates a production build. | Pass |
| 15 | The tests open the app in Chromium and check accessibility, phone layout, exports, and offline use. | Pass |
| 12 | Every customer-facing statement above maps to one tagged browser test in `.factory/claims.json`. | Pass |
| 15 | The hosting file keeps app URLs, the 404 page, security headers, caches, and web-app manifest delivery working. | Pass |
| 8 | Closeout Kit has no analytics or product account. | Pass |
| 13 | Packet content stays in the browser unless you export and share a file. | Pass |

## Terminology

### Demo workflow actions

| Stage | Back action | Forward action | Result |
| --- | --- | --- | --- |
| Engagement | — | Review assets | Pass |
| Assets | Edit engagement | Review access tasks | Pass |
| Access tasks | Review assets | Set support dates | Pass |
| Support | Review access tasks | Collect client receipt | Pass |
| Acknowledgement | Set support dates | Review exports | Pass |
| Export | Review acknowledgement | Return to engagement | Pass |

| Concept | Required term | Removed variants |
| --- | --- | --- |
| Saved or exported artifact | packet | record, bundle |
| Product surface | app | workspace, workbench |
| Workflow division | stage | route |
| Account transfer or removal item | access task | access action, access change, transfer/revoke action |
| External place where work happens | original service | system of record, external system |
| Client’s returned confirmation | acknowledgement receipt | signature, e-signature |
