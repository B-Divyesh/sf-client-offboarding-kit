# Demo sandbox

## Entry points

- Canonical: <https://client-offboarding-kit.sociobot.in/demo>
- Query alias: <https://client-offboarding-kit.sociobot.in/?demo=1>

Either URL opens the filled packet in one step. No account or passphrase setup is required.

## Sample packet

The sample covers the Northstar Arts website handoff prepared by Tideway Web Studio. It includes three assets, two access tasks, a 30-day support period, and an acknowledgement that is ready to collect.

The three asset records link to the public home or product pages for GitHub, Netlify, and Cloudflare Registrar. They are provider examples, not fictional client records.

## Isolation and reset

Sample mode uses IndexedDB database `demo:closeout-kit-v1`. Real packets use `closeout-kit-v1`.

The app selects one namespace before any storage call. Sample mode never opens the real namespace.

“Reset demo” deletes the sample database and reseeds the original packet. “Start for real” deletes the sample database before returning home.

The `@claim:demo-isolation` browser test edits and resets the sample, edits it again, starts for real, and verifies the real packet is unchanged.

The persistent banner reads “Demo — sample data, nothing is saved” and explains that changes stay separate from real packets.
