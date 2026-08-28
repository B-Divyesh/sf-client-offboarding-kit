# Adversarial first-read review 1 — Closeout Kit

**Verdict: FAIL**  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** <https://client-offboarding-kit.sociobot.in>  
**Candidate:** `590b3db3cdd8bab120f09e2dc007561762e95b7b`

There are blocking findings, unlisted claims, and copy/structure findings. A PASS requires zero findings and no untested claim.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900. No scrolling or interaction occurred before this assessment.

| Question | First-read answer | Result |
| --- | --- | --- |
| What does this do? | It appears to collect assets, owners, access tasks, support terms, and acknowledgement into a handoff packet. | Partly clear from the paragraph, not from the headline. |
| For whom? | The first screen does not say. “Client” could refer to an agency, freelancer, IT team, or the client receiving the packet. | **BLOCKING** |
| What should I click first? | “Start closeout” looks primary, but it sits between the passphrase and confirmation fields. There is no sample-data action. | **BLOCKING** |

The exact copy that fails is `<h1>Closeout Kit</h1>`, “Leave the keys where they belong.”, and “Map assets, ownership, access actions, support, and acknowledgement—then hand over one portable packet.” None names freelance developers or web studios. The required “Try it with sample data” action is absent.

## Blocking findings

| ID | Exact quote or location | Why this blocks a first-time visitor | Concrete fix |
| --- | --- | --- | --- |
| F-1-1 | Root first screen: `<h1>Closeout Kit</h1>`; “Leave the keys where they belong.”; “Start closeout” appears before “Confirm passphrase.” | The h1 is only the product name, the visible headline is a metaphor, the audience is absent, and the apparent first action comes before a required field. The visitor cannot answer what, for whom, and what to do first from one screen. | Use h1 “Build a client closeout packet.” Follow with “For freelance developers and web studios handing finished projects to clients.” Put “Try it with sample data” first, with “Opens a filled six-stage packet; nothing is saved.” Put “Create your packet” after both passphrase fields. |
| F-1-2 | `/demo/` and `/?demo=1` show the empty real app. Counts for the required demo banner, sample action, Reset, and Start for real were all 0. `.factory/demo.md` is absent. | There is no one-click trial or realistic sample. More seriously, entering `/?demo=1` created `closeout-kit-v1` and the resulting packet appeared at `/`, proving that the supposed demo URL writes the real storage namespace. A GET of `/demo` without a trailing slash also timed out, while `/demo/` returned the normal app. | Implement `/demo` with a filled realistic packet, persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real. Use an isolated `demo:` database/key namespace and discard it on exit. Add `.factory/demo.md` and an end-to-end isolation test. |
| F-1-3 | `.factory/claims.json` does not exist; `rg '@claim:'` finds no tests. | No listed claim can be run as required. All product claims are therefore untested by the claims contract, even where an unrelated general test happens to cover similar behavior. | Add one registry entry and exactly one `@claim:<id>` sandbox test for every retained claim listed below. Remove claims that cannot be proved. |
| F-1-4 | “Studio · $29” and “Buy Studio securely” link to `https://api.sociobot.in/api/v1/products/client-offboarding-kit/checkout`, which returns HTTP 404 `{"error":"enabled factory product","status":404}`. | The page offers a paid plan that cannot be bought. This is a dead link and an inaccurate live offer. “Studio · $29” is also not a result-naming verb, and “securely” is unsupported marketing language. | Hide paid copy until the product is enabled, or enable it and test checkout. Rename the button “View Studio plan — $29” and the link “Buy Studio.” Add a claim test for price, one-time billing, and entitlements. |
| F-1-5 | `/not-a-real-route` and `/404.html` both return HTTP 200 and render the home app. No 404 source or `staticwebapp.config.json` exists. | Broken and mistyped URLs look valid; there is no designed recovery page. This is broken routing. | Add a product-styled 404 with a home/demo action. Configure the host to return/rewrite actual 404s correctly and add a route test. |
| F-1-6 | All six stages stay at `/`; `src/main.ts:320-325` only changes an in-memory `step`. After Stage 2, browser Back went to `about:blank`. Focus after Start and Continue was `<body>`, and the title stayed “Closeout Kit — leave every client in control.” | Stages cannot be deep-linked, reloaded, or restored with Back/Forward. Route changes are not focused or announced as new pages. This is broken routing and keyboard/screen-reader behavior. | Give stages real URLs, use `pushState`/`popstate`, restore state on reload, set a route title, move focus to a focusable h1, and announce route changes. Add deep-link, Back/Forward, and focus tests. |
| F-1-7 | Earlier finding “missing browser security policies”: live responses still omit CSP, `frame-ancestors`/`X-Frame-Options`, and Permissions-Policy; no host config exists in code. | The earlier deployment defect is unfixed. The app renders sensitive client records and remains frameable without the required policy. | Add deployable response headers with a restrictive CSP, `frame-ancestors 'none'`, and Permissions-Policy. Verify every route and asset after deployment. |
| F-1-8 | Earlier finding “hashed static assets are not cacheable as immutable assets”: `/assets/main-C0BDoUTe.js` and CSS still return `Cache-Control: public, must-revalidate, max-age=30`. | The earlier PWA/performance defect is unfixed. Content-hashed assets unnecessarily revalidate and cannot provide the intended long-lived cache behavior. | Configure `/assets/*` for a long-lived immutable cache while keeping HTML and `sw.js` short-lived; test the production headers. |
| F-1-9 | Earlier finding “manifest MIME type”: `/manifest.webmanifest` still returns `application/octet-stream`. | The earlier installability defect is unfixed. | Serve `application/manifest+json` or `application/json` and assert the deployed content type. |
| F-1-10 | Earlier finding “invalid asset submission discards already-entered form data”: after a credential-shaped note was rejected, name, URL, both owners, and note all became empty. `showNotice()` re-renders the form at `src/main.ts:257-258`. | A correct security error destroys unrelated valid input. This directly harms error recovery. | Preserve submitted values, focus the invalid field, associate the error with it, and add a regression test. |

The prior verification used headings rather than finding IDs. F-1-7 through F-1-10 preserve those exact four headings and reissue each as blocking, as required for unfixed earlier findings.

## Non-blocking major findings

### Structure, documentation, and missed leverage

| ID | Severity | Exact quote or location | Why it fails | Concrete fix |
| --- | --- | --- | --- | --- |
| F-1-11 | Major | Root title “Closeout Kit — leave every client in control”; h1 “Closeout Kit.” | The title uses an unprovable slogan instead of what the product does. The h1 is the name rather than the job. | Use “Closeout Kit — build client handoff packets” and h1 “Build a client closeout packet.” Set stage-specific titles and h1s. |
| F-1-12 | Major | Root, Privacy, and Terms have no canonical, Open Graph, or Twitter metadata. Root has only a PNG favicon; legal pages have none. No SVG favicon, apple-touch icon, or 1200 × 630 product image is declared. | Shared links have no product-specific preview and route identity is incomplete. | Add per-route canonical metadata, OG/Twitter title/description/image, SVG favicon, and 180 px apple-touch icon. |
| F-1-13 | Major | Root header only exposes the wordmark and price button. Legal pages use a different header/footer, have no skip link/nav, and all footers omit the product one-liner, Param Factory credit, and version/build ID. | Navigation and provenance change by route. The required site skeleton is not consistent. | Use one shared header/footer on every route with Home, Demo, Privacy, Terms, skip link, product one-liner, “Built by Param Factory,” and build ID. |
| F-1-14 | Major | Landing order ends after “One clear record, six deliberate stages.” | The page lacks the live filled preview, a three-step “How it works,” a plain limitations/privacy section, and an honest paid-tier section with working purchase state. | Add the required sections in standard order, using the existing distinctive harbor visual system. |
| F-1-15 | Major | README has no `/demo` URL or sample-data instructions; `.factory/demo.md` is absent. | Verifiers and visitors have no documented clean entry point or reset/storage contract. | Document the canonical demo URL, sample contents, reset behavior, and isolated storage namespace in both files. |
| F-1-16 | Major | Acknowledgement must be typed into the freelancer’s unlocked local packet; the exported client HTML is read-only. | For a normal remote offboarding, the brief’s “client acknowledgement” implies a safe way for the client to review and return acknowledgement. The current flow records what the preparer types and cannot establish that the client supplied it. | Add a client-facing acknowledgement export that contains no secrets, lets the client create a small signed receipt file, and imports that receipt into the packet. Label it as acknowledgement, not a legal e-signature. AI is not needed; no decorative AI or embedded provider keys were found. |

The visual identity itself passes: the harbor control-room art, dark teal/amber palette, serif/sans pairing, and clipped operational surfaces are distinct and match `.factory/design.md`; it is not a generic SaaS template.

### Plain-words findings

| ID | Severity | Exact quote/location | Flag | Proposed rewrite |
| --- | --- | --- | --- | --- |
| F-1-17 | Major | Header: “Departure without loose ends” | Mood slogan; carries no product information. | Delete it, or use “Client handoff packets.” |
| F-1-18 | Major | Header: “On device” | Ambiguous status: it could mean data location, connectivity, or install state. | “Packet data stays in this browser.” |
| F-1-19 | Major | Button: “Studio · $29” | Not a result-naming verb; price claim is unlisted. | “View Studio plan — $29.” |
| F-1-20 | Major | Eyebrow: “Local-first closeout workspace” | “Local-first” and “workspace” are implementation/product jargon and do not name the user. This is also an unlisted storage claim. | “Client handoff tool for freelancers and studios.” |
| F-1-21 | Major | “Credentials stay in their proper vaults.” | Metaphor and unsupported agency: the tool cannot ensure where credentials stay. This is an unlisted claim. | “Do not enter credentials. Share them through your password manager.” |
| F-1-22 | Major | “The closeout route” | Nautical metaphor used as a section label. | “Six packet stages.” |
| F-1-23 | Major | Heading: “One clear record, six deliberate stages.” | “Clear” and “deliberate” are marketing adjectives; “record” changes the name of the packet. | “Complete the packet in six stages.” |
| F-1-24 | Major | Footer: “Private by default.” | Vague privacy slogan and unlisted claim. | “Packet data is encrypted before this browser saves it.” Add the corresponding test. |
| F-1-25 | Major | Studio dialog heading: “Reuse a calmer closeout.” | Mood heading; it does not name the section or feature. | “Studio adds reusable packet templates.” |
| F-1-26 | Major | README: “Closeout Kit is a local-first PWA for freelance developers and web studios finishing a client engagement.” | “Local-first PWA” is jargon and the storage claim is unlisted. | “Closeout Kit is a browser app for freelance developers and web studios finishing client projects. It saves encrypted packets on the device and works offline.” |
| F-1-27 | Major | README: “It turns scattered links, ownership notes, transfer tasks, support promises, and client acknowledgement into one portable closeout packet—without becoming a password vault.” | Abstract “turns,” “support promises,” and the vault metaphor slow the first read; the outcome claim is unlisted. | “It creates one client packet from asset links, owners, access tasks, support terms, and acknowledgement. It never asks for credentials.” |
| F-1-28 | Major | README: “Guides a closeout through engagement details, assets, ownership, external transfer/revoke actions, support boundaries, and acknowledgement.” | “Transfer/revoke,” “support boundaries,” and “closeout” are dense without explanation; the workflow claim is unlisted. | “Collect project details, assets, owners, account transfer or removal tasks, support dates, and client acknowledgement.” |
| F-1-29 | Major | README: “Stores drafts in IndexedDB as AES-GCM ciphertext derived from a user passphrase.” | Implementation jargon appears before the plain outcome; the encryption claim is unlisted. | “The browser encrypts every draft before saving it. Technical detail: it stores AES-GCM ciphertext in IndexedDB.” |
| F-1-30 | Major | README: “Exports a standalone client HTML file, a print/PDF-ready view, and an encrypted JSON backup.” | Format jargon obscures what each file is for; the export claim is unlisted. | “Download a client packet that opens in a browser, print it to PDF, or save an encrypted backup.” |
| F-1-31 | Major | README: “Checkout and license verification use only the Sociobot billing API.” | “API” is unnecessary here and the billing-destination claim is unlisted. | “Only Sociobot receives the license token for checkout and verification.” |
| F-1-32 | Major | README: “Those actions remain in their systems of record.” | “Systems of record” is jargon and changes the term used elsewhere (“external system,” “original service”). | “Complete those actions in the original hosting, domain, CMS, or account service.” |
| F-1-33 | Major | README: 28-word sentence beginning “`npm test` runs unit tests…” | Exceeds the 22-word hard cap and packs seven test categories into one sentence. | “`npm test` runs unit tests and creates a production build. It also checks Chromium flows, accessibility, mobile layout, export, and offline reload.” |
| F-1-34 | Major | Landing/README use “workspace,” “workbench,” “route,” “record,” and “packet” around the same workflow. Access work is “access actions,” “transfer/revoke actions,” and “access changes.” | Inconsistent terminology makes a new visitor infer distinctions that do not exist. | Use **app** for the product area, **packet** for the artifact, **stage** for the sequence, and **access task** for transfer/removal work. |

F-1-1 also serves as the plain-words finding for the metaphor headline and audience-free lead. F-1-4 also covers the “securely” marketing adjective and dead purchase action.

### Unlisted claim findings

There is no claims registry, so every row is unlisted. Ad-hoc observations do not replace the required tagged clean-demo test.

| ID | Severity | Exact claim and location | Concrete fix/test |
| --- | --- | --- | --- |
| F-1-35 | Major | Title: “leave every client in control” | Remove the unmeasurable claim; use the descriptive title in F-1-11. |
| F-1-36 | Major | Meta description: “Build a secure, portable client closeout packet without storing credentials.” | Remove “secure,” then test portable export and absence/rejection of credential fields separately. |
| F-1-37 | Major | Landing: “Map assets, ownership, access actions, support, and acknowledgement—then hand over one portable packet.” | Seed every stage in demo, export, and assert the file contains each section. |
| F-1-38 | Major | Landing: “There is no recovery service because nothing leaves this device.” | Rewrite to the precise data scope and test the full demo request log plus recovery behavior. |
| F-1-39 | Major | Landing: “AES-GCM encrypted.” | Inspect the demo IndexedDB value: only envelope metadata/ciphertext, with no sample plaintext; verify decrypt/reload. |
| F-1-40 | Major | Landing: “No client account.” | Test the complete demo workflow without authentication or account requests. |
| F-1-41 | Major | Landing: “Works offline.” | Cache the demo, set the context offline, reload, edit, and export the seeded packet. |
| F-1-42 | Major | Landing: “No analytics.” | Record requests for the whole demo and assert same-origin assets only; statically reject analytics SDKs. |
| F-1-43 | Major | Landing: “Generated artwork.” | Add a provenance assertion for the shipped art and referenced prompt/source record, or retain only in design documentation. |
| F-1-44 | Major | Studio dialog: “One-time $29.” | Enable the product, then test displayed price and billing response against a fixture; otherwise remove the offer. |
| F-1-45 | Major | Studio dialog: “Add unlimited local packets, duplicate a proven closeout, and put your studio name and accent on client exports.” | Test all three entitlements with a recorded valid license response. |
| F-1-46 | Major | Studio dialog: “No subscription.” | Verify the billing product type/response in a fixture and live smoke test, or remove. |
| F-1-47 | Major | Studio dialog: “Checkout and refunds are handled by Sociobot / Dodo, the merchant of record.” | Test the live redirect/merchant disclosure after registration, or remove until checkout works. |
| F-1-48 | Major | README: “Requires explicit confirmation that access changes were verified in the real external system.” | Add a demo claim test proving completion is blocked until external confirmation is checked. |
| F-1-49 | Major | README: “Rejects common password, API-token, and private-key patterns; there are no credential fields.” | Test representative password/token/key fixtures across every text field and confirm values are not saved/exported. |
| F-1-50 | Major | README: “The passphrase stays in memory and cannot be recovered by the service.” | Test storage/request payloads for absence of the passphrase and document what “service” means. |
| F-1-51 | Major | README: “Imports encrypted backups and continues working after an offline reload.” | In demo isolation, export, reset, import, go offline, reload, unlock, and compare the packet. |
| F-1-52 | Major | README: “Offers a $29 one-time Studio license for multiple packets, duplication, and export branding.” | Use the same entitlement/price test as F-1-44 through F-1-46 after checkout is live. |
| F-1-53 | Major | README: “The app does not move accounts, host files, migrate a CMS, or validate that a recipient can sign in.” | Keep as a limitations statement, but add it to the registry with a static/UI boundary assertion or state it only under “What it does not do.” |
| F-1-54 | Major | README: “No environment variables or backend are required for the free workflow.” | Test a clean install/build/demo with an empty relevant environment. |
| F-1-55 | Major | README: “`npm test` runs unit tests, a reproducible production build, Chromium end-to-end tests, axe serious/critical checks, a 390 px layout pass, a full export path, and offline refresh/restore tests.” | Split as in F-1-33 and add a CI assertion or keep this as generated verification evidence rather than a product claim. Current run did pass these categories. |
| F-1-56 | Major | README: “Playwright is pinned to `1.58.2`.” | Add a package-lock assertion or remove the prose; package.json currently confirms it. |
| F-1-57 | Major | README: “Static output lands in `dist/`, with `dist/index.html` at its root.” | Test the build artifact paths; the current build passed this ad hoc. |
| F-1-58 | Major | README: “The service worker and manifest are included automatically.” | Test both files in `dist` and their deployed status/content types. The MIME part currently fails. |
| F-1-59 | Major | README: “Closeout Kit has no analytics or product account.” | Test full-demo requests and account-free use; combine with F-1-40/F-1-42. |
| F-1-60 | Major | README: “Packet content never leaves the browser unless the user exports and shares it.” | Record requests through create/edit/export and assert that no request body/URL contains seeded packet data. |
| F-1-61 | Major | README: “License verification sends only the supplied license token to `https://api.sociobot.in` at most once per day.” | Use a mocked clock and gateway fixture; assert destination, payload/query contents, and no second call within 24 hours. |
| F-1-62 | Major | README: “Because encryption is local, losing both the passphrase and an unlocked browser session makes packet recovery impossible.” | Test that a locked fresh session cannot decrypt with a wrong/missing passphrase and that no recovery endpoint is called. |
| F-1-63 | Major | README: “Requires Node.js 20 or newer.” | Add an engines field and CI version matrix, or change this to the actually enforced version range. |

Claims already captured by copy findings are still unlisted: F-1-19 (price), F-1-20 (local storage), F-1-21 (credential handling), F-1-24 (privacy), F-1-26 through F-1-31 (README product behavior), and F-1-28’s six-stage workflow. Each retained statement needs a registry entry and tagged test.

## Complete copy audit

Word counts use whitespace-delimited words after removing Markdown markers. Commands in fenced code blocks are excluded because they are commands, not sentences. Short headings, labels, and link text are included so the audit covers every landing-page and README copy unit. The Studio modal is included because it opens from the first screen.

### Landing page and Studio modal

| # | Words | Copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 4 | Skip to main content | — |
| 2 | 2 | Closeout Kit | F-1-1/F-1-11 as h1 |
| 3 | 4 | Departure without loose ends | F-1-17 |
| 4 | 2 | On device | F-1-18 |
| 5 | 3 | Studio · $29 | F-1-4/F-1-19 |
| 6 | 3 | Local-first closeout workspace | F-1-20 |
| 7 | 6 | Leave the keys where they belong. | F-1-1 |
| 8 | 13 | Map assets, ownership, access actions, support, and acknowledgement—then hand over one portable packet. | F-1-1/F-1-37 |
| 9 | 6 | Credentials stay in their proper vaults. | F-1-21 |
| 10 | 4 | Create a packet passphrase | — |
| 11 | 2 | Start closeout | F-1-1 (placement) |
| 12 | 2 | Confirm passphrase | — |
| 13 | 4 | At least 10 characters. | — |
| 14 | 10 | There is no recovery service because nothing leaves this device. | F-1-38 |
| 15 | 2 | AES-GCM encrypted | F-1-39; jargon is acceptable only after a plain explanation |
| 16 | 3 | No client account | F-1-40 |
| 17 | 2 | Works offline | F-1-41 |
| 18 | 3 | The closeout route | F-1-22 |
| 19 | 6 | One clear record, six deliberate stages. | F-1-23 |
| 20 | 1 | Engagement | — |
| 21 | 1 | Assets | — |
| 22 | 2 | Access actions | F-1-34 terminology |
| 23 | 1 | Support | — |
| 24 | 1 | Acknowledge | — |
| 25 | 1 | Export | — |
| 26 | 3 | Private by default. | F-1-24 |
| 27 | 2 | No analytics. | F-1-42 |
| 28 | 2 | Generated artwork. | F-1-43 |
| 29 | 1 | Privacy | — |
| 30 | 1 | Terms | — |
| 31 | 1 | Source | — |
| 32 | 3 | Closeout Kit Studio | — |
| 33 | 4 | Reuse a calmer closeout. | F-1-25 |
| 34 | 2 | One-time $29. | F-1-44 |
| 35 | 18 | Add unlimited local packets, duplicate a proven closeout, and put your studio name and accent on client exports. | F-1-45 |
| 36 | 2 | No subscription. | F-1-46 |
| 37 | 3 | Buy Studio securely | F-1-4 |
| 38 | 13 | Checkout and refunds are handled by Sociobot / Dodo, the merchant of record. | F-1-47 |
| 39 | 3 | Have a license? | — |
| 40 | 2 | Paste it | — |
| 41 | 2 | Verify license | — |
| 42 | 8 | Title: Closeout Kit — leave every client in control | F-1-11/F-1-35 |
| 43 | 10 | Meta description: Build a secure, portable client closeout packet without storing credentials. | F-1-36 |
| 44 | 17 | Image alt: A quiet harbor seen from a dark operations room, with a closed document case ready for handoff | —; meaningful and plain |
| 45 | 3 | Accessible name: Closeout Kit home | — |
| 46 | 3 | Accessible name: Close license dialog | — |
| 47 | 1 | Navigation label: Legal | — |

No landing sentence exceeds 22 words. The failures are clarity, metaphors, unlisted claims, terminology, and action naming.

### README

| # | Words | Copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 2 | Closeout Kit | — |
| 2 | 16 | Closeout Kit is a local-first PWA for freelance developers and web studios finishing a client engagement. | F-1-26 |
| 3 | 22 | It turns scattered links, ownership notes, transfer tasks, support promises, and client acknowledgement into one portable closeout packet—without becoming a password vault. | F-1-27 |
| 4 | 3 | Live product: https://client-offboarding-kit.sociobot.in | — |
| 5 | 3 | What it does | — |
| 6 | 15 | Guides a closeout through engagement details, assets, ownership, external transfer/revoke actions, support boundaries, and acknowledgement. | F-1-28 |
| 7 | 13 | Requires explicit confirmation that access changes were verified in the real external system. | F-1-48 |
| 8 | 12 | Rejects common password, API-token, and private-key patterns; there are no credential fields. | F-1-49 |
| 9 | 12 | Stores drafts in IndexedDB as AES-GCM ciphertext derived from a user passphrase. | F-1-29 |
| 10 | 12 | The passphrase stays in memory and cannot be recovered by the service. | F-1-50 |
| 11 | 14 | Exports a standalone client HTML file, a print/PDF-ready view, and an encrypted JSON backup. | F-1-30 |
| 12 | 10 | Imports encrypted backups and continues working after an offline reload. | F-1-51 |
| 13 | 13 | Offers a $29 one-time Studio license for multiple packets, duplication, and export branding. | F-1-52 |
| 14 | 10 | Checkout and license verification use only the Sociobot billing API. | F-1-31 |
| 15 | 19 | The app does not move accounts, host files, migrate a CMS, or validate that a recipient can sign in. | F-1-53 |
| 16 | 8 | Those actions remain in their systems of record. | F-1-32 |
| 17 | 2 | Run locally | — |
| 18 | 5 | Requires Node.js 20 or newer. | F-1-63 |
| 19 | 6 | Open the URL printed by Vite. | —; developer instruction |
| 20 | 11 | No environment variables or backend are required for the free workflow. | F-1-54 |
| 21 | 3 | Test and build | — |
| 22 | 28 | `npm test` runs unit tests, a reproducible production build, Chromium end-to-end tests, axe serious/critical checks, a 390 px layout pass, a full export path, and offline refresh/restore tests. | F-1-33/F-1-55; over 22 words |
| 23 | 5 | Playwright is pinned to `1.58.2`. | F-1-56 |
| 24 | 5 | The deploy command is exactly: | — |
| 25 | 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | F-1-57 |
| 26 | 7 | Deploy the directory as a static site. | —; instruction |
| 27 | 8 | The service worker and manifest are included automatically. | F-1-58 |
| 28 | 3 | Privacy and recovery | — |
| 29 | 8 | Closeout Kit has no analytics or product account. | F-1-59 |
| 30 | 13 | Packet content never leaves the browser unless the user exports and shares it. | F-1-60 |
| 31 | 15 | License verification sends only the supplied license token to https://api.sociobot.in at most once per day. | F-1-61 |
| 32 | 8 | See /privacy and /terms in the deployed app. | —; links return 200 |
| 33 | 17 | Because encryption is local, losing both the passphrase and an unlocked browser session makes packet recovery impossible. | F-1-62 |
| 34 | 11 | Users should keep the encrypted JSON backup and its passphrase separately. | —; actionable guidance |
| 35 | 2 | Project notes | — |
| 36 | 6 | Visual system and generated-art provenance: `.factory/design.md` | —; link exists |
| 37 | 5 | Build and verification record: `.factory/handoff.md` | —; link exists |
| 38 | 2 | License: MIT | —; LICENSE exists |

### Terminology table

| Concept | Use this term | Replace |
| --- | --- | --- |
| Saved/exported artifact | packet | record |
| Product surface | app | workspace, workbench |
| Workflow division | stage | route |
| Account transfer/removal item | access task | access action, transfer/revoke action, access change |
| Original external service | original service | system of record, real external system |

## Demo, privacy, offline, and claim evidence

- `/demo/` and `/?demo=1`: HTTP 200 but no sample, banner, Reset, or Start for real; query-demo data persisted into the production `closeout-kit-v1` IndexedDB and appeared at `/`.
- Fresh real-flow request log: only `https://client-offboarding-kit.sociobot.in` requests for document, JS, CSS, and local artwork. No analytics or third-party runtime request occurred.
- Offline live smoke: after first load and save, `context.setOffline(true)` plus reload restored the app and displayed “Offline · still saving.”
- These spot checks support the behavior but do not cure F-1-3: there is no isolated demo and no tagged claims registry/test.

## Structure, crawl, accessibility, and quality evidence

- `npm test`: PASS — 5 unit tests, production build, 6 browser tests; 2 intentional project skips.
- Build: PASS — `dist/index.html` produced; JS 37.57 KB raw / 13.27 KB gzip, CSS 15.62 KB raw / 4.32 KB gzip.
- Live axe on `/`, `/privacy/`, `/terms/`, `/not-a-real-route`, and `/demo/`: 0 reported violations.
- Fresh 390 px and desktop loads: no console errors. The existing mobile overflow test passed.
- Root, Privacy, and Terms each have `lang=en`, one h1, and a main landmark. Root h1 semantics still fail F-1-1/F-1-11.
- Link crawl: root, Privacy, Terms, and GitHub Source return 200; Studio checkout returns 404. `mailto:` was excluded as allowed.
- Visual review: distinct product-specific identity; no generic-template finding.
- Reduced-motion CSS is present; current browser tests and earlier verification found no serious/critical accessibility issue. Route focus still fails F-1-6.
- No AI runtime, Azure endpoint, raw provider key, or decorative AI feature was found. The structured offline job does not require AI.

## Earlier-history recheck

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. `.factory/handoff.md` and `.factory/verification.md` were read in full. Every earlier defect remains reproducible:

| Earlier finding | Live check | Code check | Result |
| --- | --- | --- | --- |
| Missing browser security policies | Headers absent | No deploy header config | F-1-7 BLOCKING |
| Hashed assets not immutable | `max-age=30, must-revalidate` | No host cache config | F-1-8 BLOCKING |
| Manifest MIME type | `application/octet-stream` | No host MIME config | F-1-9 BLOCKING |
| Invalid asset submission clears values | All five entered values became empty | Error calls `showNotice()` → full render | F-1-10 BLOCKING |

## What would make this perfect

Resolve every F-1 finding, deploy the result, and rerun this review from fresh contexts. The acceptance state is: an audience-specific job headline; a one-click, prefilled, isolated demo; no dead purchase path; real stage and 404 routing with focus/history; complete metadata and shared site chrome; concise literal copy; a client-returnable acknowledgement; all claims registered and tagged; and all four prior deployment/form defects demonstrably fixed. There is nothing optional in that list because this review cannot pass with any remaining finding.
