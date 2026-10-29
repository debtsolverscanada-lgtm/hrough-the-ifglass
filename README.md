# Through the Ifglass: video studio

Automated "What If" explainer videos hosted by **Glint** (stickman, gold round glasses, mint scarf).

## How a video is made
1. `episodes/NNN-*/...-VOICEOVER.txt`: the script (written for ElevenLabs).
2. Record it in ElevenLabs and save the MP3 into the episode folder.
3. `pipeline/align.py`: forced-aligns the script words to the audio (PocketSphinx, offline) → `words.json`.
4. `pipeline/plan.py words.json timeline.json <episode>` reads the episode `shotplan.json` + `meta.json`: the shot list (anchor phrase → scene), captions with number formatting.
5. `studio/render.js out start end land|vert`: renders frames with headless Chromium (`studio/engine.html` + `lib.js` drawing library + `shots.js` scene library).
6. ffmpeg: frames + loudness-normalised voice + ambient pad → MP4. `pipeline/make_clips.sh` → 9 vertical clips.
7. `pipeline/build.py <episode>` runs steps 3–6; `pipeline/drive_upload.py <episode>` uploads to Drive and queues it.
8. GitHub Actions (`.github/workflows/build-episode.yml`) runs both when an episode gets a `READY` file; a Zap posts Mon/Wed/Fri 3pm ET.

One-time setup: see **SETUP.md**. Channel art: `brand/`.

## Requirements
Node 20+ with `playwright` (Chromium), Python 3 with `pocketsphinx`, ffmpeg, Inter Display font.
