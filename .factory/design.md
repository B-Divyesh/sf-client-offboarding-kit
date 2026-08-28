# Closeout Kit — visual system

## Direction and rationale

**Cinematic environmental art: the last light in a harbor control room.** A closeout is a safe departure, not paperwork. The interface treats each engagement like a vessel being brought to berth: the distant harbor establishes calm and consequence, route markers show progress, and a warm signal lamp marks the next action. This makes ownership transfer feel deliberate without borrowing the visual language of a generic admin dashboard.

The treatment is intentionally single-mode. A deep night background keeps the generated dusk scene and work surface in one continuous world; cream paper surfaces are reserved for the exported client packet.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Night | `#0A1518` | Page background |
| Deep water | `#10262A` | Raised surfaces |
| Harbor glass | `#17363A` | Inputs and secondary surfaces |
| Fog | `#F3F0E7` | Primary text |
| Sea mist | `#B8C8C5` | Secondary text |
| Signal amber | `#F4B860` | Primary action and current route marker |
| Ember | `#D9784A` | Warnings / destructive affordances |
| Safe green | `#7FC6A4` | Completed states |
| Danger | `#FF938A` | Errors |
| Ink | `#142023` | Text on amber / paper |

Text and control pairs are selected for at least 4.5:1 contrast. Color is always accompanied by iconography, labels, or status text.

## Type

- Display: Georgia, Charter, `Times New Roman`, serif — editorial, assured, and already on-device.
- Interface/body: Inter-like system stack (`ui-sans-serif`, system UI, sans-serif) — compact and operational.
- No remote or bundled fonts; the system stacks eliminate a font payload and keep offline rendering immediate.
- Scale: 14, 16, 18, 24, 36, 56 px. Body is 16 px minimum with 1.55 line-height.

## Spacing and composition

- 4/8 px base rhythm: 4, 8, 12, 16, 24, 32, 48, 64.
- Main workbench maxes at 1200 px. The route rail is 264 px; forms are readable at 720 px.
- Hairline horizon rules, clipped corners, and small coordinate-style labels evoke navigation instruments without becoming decorative chrome.
- On phones, the rail becomes a horizontal progress strip, the scene crops to atmosphere, and paired fields stack. Primary actions remain reachable and at least 44 px tall.

## Interaction grammar

- Amber means “continue this route”; green means an independently verifiable completion.
- Each stage has one prominent forward action. Secondary links remain quiet.
- List additions rise from the form directly above them. Deletions require a specific confirmation; acknowledgement cannot be inferred from completion status.
- Empty, locked, offline, error, saved, and update-ready states all explain what changed and offer a next action.

## Motion policy

- 180–240 ms opacity/translate transitions for stage changes and newly added rows; no ambient loops.
- The harbor scene uses a single slow initial reveal, never parallax.
- Under `prefers-reduced-motion: reduce`, movement is removed, scrolling is instant, and state changes use opacity or no transition.

## Original asset plan and provenance

- `public/art/harbor-closeout-{960,1536}.{avif,webp}` plus JPEG fallback: original AI-generated cinematic environmental scene used on the empty/welcome state.
- `public/art/closeout-social.jpg`: 1200 × 630 center crop derived locally from the approved harbor artwork for social metadata.
- App icons and interface symbols: hand-authored SVG/geometric CSS, created for this product.
- `public/icons/favicon.svg` is hand-authored from the beacon-and-check app mark. `apple-touch-icon.png` is a local resize of the same original mark.
- Generated artwork is disclosed in the footer. No stock, brand, character, or third-party asset is used.

### Hero prompt sheet

- **Use case:** stylized-concept
- **Subject:** a quiet coastal operations room after a successful handoff, desk facing a dark harbor, one closed archival case, neatly routed cable, distant beacon
- **World/materials:** salt-worn window, dark teal painted steel, matte paper, brass signal fixture, sea haze
- **Light/lens:** cinematic blue hour, warm practical light, 35 mm wide frame, restrained film grain, deep readable shadows
- **Composition:** environmental wide shot, horizon in upper third, calm negative space on left, desk and closed case low right, no people
- **Palette words:** deep water teal, fog ivory, signal amber, subdued rust
- **Negative list:** text, letters, logos, watermark, interface mockups, people, visible credentials, keys, locks, neon cyberpunk, fantasy, clutter

**Production prompt:** “Cinematic environmental concept art for an offline client handoff utility. A quiet coastal operations room at blue hour after a successful project departure, looking through salt-worn glass toward a dark harbor and one distant amber beacon. Dark teal painted steel, matte archival papers inside a closed document case on the lower right, a neatly routed cable, subtle brass signal fixture, sea haze, restrained film grain, realistic materials, 35mm wide composition, horizon in upper third, generous calm negative space on the left, deep readable shadows. Deep water teal, fog ivory, signal amber and subdued rust palette. No people, no text, no letters, no logos, no watermark, no visible credentials, no keys, no locks, no UI, no neon cyberpunk, no fantasy, no clutter.”

Generated with the factory image deployment (`/opt/fleet/lib/gen-image.sh`), 2026-08-28. Original output; project use under the repository MIT license. Final candidates are reviewed for text artifacts, brands, seams, and palette consistency before use.
