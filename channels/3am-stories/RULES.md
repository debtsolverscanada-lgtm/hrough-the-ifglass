# 3 AM Stories: house rules

## Picture every word (owner's rule, Nov 2026)
- Every room, place and object the narrator names is drawn on screen when it's said. "Kitchen" means a real kitchen
  (cabinets, sink, fridge), "yogurt and rice" means a close-up of the yogurt cups and the rice bowl, "at work" means an
  office, "police search" means officers with flashlights, a Japanese closet means an oshiire. No stand-in scenes.
- If the engine doesn't have the place yet, build the scene before building the video.
- True stories: real people are drawn as people, never as monsters. Name / age / place / date pop up as they're said.
- Camera: 2-3 s shots, fast push-in on holds (p.push 0.035), dead-still holds on the hit moments, whip between shots.
- Post one Short at a time, at least 3 hours apart.

## Every video looks different (owner's rule, Nov 2026)
- Never reuse a lead character: every story builds a new one with the character builder (hairStyle, glasses,
  lines, stubble/moustache/beard, outfit, colours) to fit the real person. Same-looking videos get flagged as repetitive.
- Each story sets its own `"grade"` (colour grade: a preset name from GRADES in scenes.js, or custom shadow/mid/high
  colours) and its own `"hero"` (lead character's hair and clothes). Never reuse a grade within the last 10 videos.
- Pick scenery that fits the story's real setting (country, era, building) instead of the default bedroom/hallway.

| Story | Grade | Hero |
|---|---|---|
| 027 machine seven | violetHaze at 0.3 (purple neon laundromat night) | 68-year-old woman: silver parted hair, round glasses, plum cardigan + new: bald laundromat owner with a white moustache, Eli (1987 photo); narrator Matilda |
| 026 black lake | arcticBlue at 0.35 (icy moonlit lake, reds kept) | curly-haired teen in a red shirt + new: Jordan (blond spikes), Priya (long black hair), the faceless fourth swimmer; narrator Callum |
| 025 floor thirteen (long) | noirTeal at 0.36 (series continuation of 023: same lead, Ana) | Ana the nurse + new: Mr. Haskell (grey, balding manager), Ruth (1974 clipping); narrator Sarah |
| 024 stop four | coldSteel at 0.38 (steel-blue night, reds kept) | grey-bearded delivery driver, buzz cut, hi-vis vest; narrator Bill |
| 023 floor thirteen | sickGreen at 0.32 (fluorescent elevator green, reds kept) | night-shift nurse: hair bun, teal scrubs; narrator Sarah (female, first person) |
| 022 closet tenant | sodiumNight (warm orange street-light night) | 57-year-old office worker: greying side-parted hair, glasses, age lines, white shirt + navy tie |

## Thumbnails: the Floor 13 v5 recipe (owner's rule, Nov 2026)
Approved look: stories/025-floor-thirteen-long/thumb-v5.jpg (scenes S.thumbF13p + S.thumbF13h). Use it for most thumbnails.
- Owner update: darker vibe, fewer colours. Background near-black to blood red (S.thumbFarmH p.dark), faint red rays,
  a few red/orange bokeh. Palette = black, blood red, one warm light, white + red words. Keep the glows and sticker
  outlines so it still pops; never flat grey. Run the whole thing through saturate ~1.3 / contrast ~1.1, p.noVig, no colour grade.
- Left: the lead's frightened face, big (about half the frame height), white sticker outline + cyan neon glow,
  eyes wide, mouth open, sweat and tears.
- Right: the threat, small but unmistakable, white sticker outline + red glow, glowing red eyes, a too-wide black grin.
- One glowing object that is the story (the 13, the machine number, the door light) in white with a red glow.
- Horror layer: cartoon blood handprints and drips on the set, cracks, red edge glow and a light red tint.
  Cartoon only, no wounds or gore, so it stays advertiser-friendly.
- A red arrow pointing at the threat.
- Words top-left in Inter Display Black: line 1 white, line 2 bigger in yellow, fat black outline, 0-3 words that are
  not the title. Nothing in the bottom-right.
- Thumbnails must not look alike (owner's rule): rotate the LAYOUT and the ACCENT colour, never repeat the last 3.
  Layouts: L1 face-left / threat-right (S.thumbF13h) · L2 the threat's face filling the frame, peeking from dark ·
  L3 POV from behind the lead, torch beam to the threat (S.thumbFarmPOV) · L4 the object huge and close (machine
  window, door gap, phone screen) with no people · L5 tiny lead in the bottom-left under a huge shadow/silhouette.
  Accents (one per video, on black): blood red · ember orange · sick green · cold cyan · violet.
  Word colour follows the accent; word position moves too (top-left, top-right, centre-top).
  | Video | Layout | Accent |
  |---|---|---|
  | 025 Floor 13 long | L1 | blood red |
  | 018 Farmhouse Rules | L3 | ember orange on blue-black |
- BEFORE showing any thumbnail, tick the master playbook (PLAYBOOK.md sections 6 + 8) line by line, out loud:
  [ ] 3-4 colours, each means one thing (red = danger)  [ ] one lit figure / one glowing thing in near-black
  [ ] one clear idea, one main wrong thing, no clutter    [ ] no full creature reveal (peek, eye, grin, shadow)
  [ ] 0-3 words, not the title, readable contrast         [ ] nothing bottom-right  [ ] what's seen first is on the left
  [ ] reads at 320x180 in one second                      [ ] true: the image is in the video
- Check at 320x180 before posting: the face, the red eyes and the glowing object must read in one second.

## YouTube channel advice (Studio "Improve your channel", Nov 2026)
- Stayed-to-watch on our best Shorts is 47-62%: the first 1-2 s must open mid-tension (no setup line) and the first frame
  carries a 2-4 word hook text pop stating the rule/conflict (p.pops type 'label' at 0.0 s), e.g. "DON'T COUNT", "NO 13TH FLOOR".
- Everyday dread wins in comments (mirrors, phones in the dark, late-night routines). Idea bank, use in rotation:
  smart-home glitches (security camera, voice assistant, doorbell cam), midnight deliveries, rideshare anomalies,
  rules/rituals with a forbidden condition ("don't look", "count the knocks").
- Every horror Short that has a long-form version: owner sets YouTube Studio > Short > Related video to the long-form
  (not possible through the API). Teaser Shorts ("Part 1" / the central chilling moment) for every long-form.
- Long-form packaging: one eerie focal point, little or no text; titles leave a question open instead of telling the plot.

## Sound (owner's rule, Nov 2026)
- Effects sit under the voice: no sharp "bing" stings, no loud booms. Loud hits make people scroll away.
- Measured target: loudest moment no more than ~7 dB above the typical level (022: was 11 dB, now 6.7 dB).

## Voices and turns rotate (owner's rule, Nov 2026)
- The narrator fits who tells the story: first-person stories use a voice matching the lead (age, gender);
  third-person/true stories rotate between narrators. Never the same narrator more than 2 Shorts in a row.
  Pool: Brian (deep male), Sarah (female 30s), Bill (older male), Matilda (warm female), Callum (young male), Dorothy (older female).
- The middle turn rotates; never the same pair twice in a row. Pool: "Wait..." / "Here's the thing about ___." /
  "That's when I noticed..." / "Except..." / "But here's what nobody tells you:" / "The weird part?" / a silent beat
  with one image and no line / "You see," (max once every 4 Shorts).
- Hook formula rotates (PLAYBOOK F1-F15), never the same one twice in a row.

| Story | Narrator | Hook | Turn |
|---|---|---|---|
| 022 closet tenant | Brian | "This guy..." intro (true story) | Wait / You see |
| 023 floor thirteen | Sarah | F2 impossible premise + F15 loop | (no Wait) / Here's the thing about elevators |
| 024 stop four | Bill | F13 evidence first + F15 loop | That's when I noticed / Except |
| 026 black lake | Callum | F5 countdown (One. Two. Three. Four.) + F15 loop | The weird part? |
| 027 machine seven | Matilda | F4 ignored warning (DO NOT USE sign) + F15 loop | But here's what nobody tells you |
