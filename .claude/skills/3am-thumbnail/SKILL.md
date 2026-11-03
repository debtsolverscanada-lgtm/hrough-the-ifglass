---
name: 3am-thumbnail
description: Design or redesign a 3 AM Stories thumbnail (Short or long-form) in the owner-approved dark style, rotating layout and accent so thumbnails never look alike, and checking it against the master playbook before showing it. Use for any 3 AM Stories thumbnail, CTR fix, or "make the thumbnail better/pop/darker/different".
---

# 3 AM Stories thumbnails

Source of truth: the "Thumbnails" sections of `channels/3am-stories/RULES.md` and section 6 + 8 of `PLAYBOOK.md`.
Approved examples: `stories/018-farmhouse-rules/thumb-v6-pov.jpg` (L3), `stories/025-floor-thirteen-long/thumb-v7-clean.jpg` (L1).

## The look (owner-approved, Nov 2026)
- Dark: near-black background, ONE accent colour + white. 3-4 colours total, each meaning one thing (red = danger).
  Glows and white "sticker" outlines on characters so it still pops. Never flat grey, never bright pink/purple.
- One clear idea, ONE wrong thing, no clutter (no arrows + handprints + drips + cracks all at once).
- The threat only peeks (an eye, a grin, fingers, feet under a door, a shadow). No full creature reveal.
- 0-3 words, never the title, Inter Display Black, white + accent, fat black outline, top-left/top-right/centre-top.
- Nothing important bottom-right (timestamp). What's seen first sits on the left. Faces fully drawn (bodies too, no floating heads).
- Must be true: the image is in the video.

## Rotation (never repeat the last 3; log it in the RULES.md thumbnail table)
Layouts: L1 face-left / threat-right · L2 the threat's face filling the frame from dark · L3 POV from behind the lead
(torch beam to the threat) · L4 the key object huge, no people · L5 tiny lead bottom-left under a huge shadow.
Accents: blood red · ember orange · sick green · cold cyan · violet.

## How
- Build as a scene in `engine/scenes.js` (see S.thumbF13c, S.thumbFarmPOV; helpers in `VIB`: words(), glow(), bokeh(), pill()).
  Render with `node engine/render.js thumb.json outdir long 0 1000` (p.still true, p.noVig true), scale to 1280x720.
- Pass `seed` in head options so auto-blink doesn't close the eyes. Check eyes, hands, bodies render right.
- Before showing: tick the playbook checklist out loud and view it at 320x180 too.
- Live swap: commit the jpg, then YouTubeV4CLIAPI `upload_video_thumbnail` (3 AM Stories connection
  `0202bdfc-ea80-8057-b7a3-2226e8be0dd3`) with the raw.githubusercontent URL. Changing an existing video's thumbnail: show the
  owner first unless they asked for it to go live.
