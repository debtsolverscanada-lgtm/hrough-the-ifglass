# Through the Ifglass: video studio

Automated "What If" explainer videos hosted by **Glint** (stickman, gold round glasses, mint scarf).

## How a video is made
1. `episodes/NNN-*/...-VOICEOVER.txt`: the script (written for ElevenLabs).
2. Record it in ElevenLabs and save the MP3 into the episode folder.
3. `pipeline/align.py`: forced-aligns the script words to the audio (PocketSphinx, offline) → `words.json`.
4. `pipeline/plan.py words.json timeline.json`: the shot list (anchor phrase → scene), captions with number formatting.
5. `studio/render.js out start end land|vert`: renders frames with headless Chromium (`studio/engine.html` + `lib.js` drawing library + `shots.js` scene library).
6. ffmpeg: frames + loudness-normalised voice + ambient pad → MP4. `pipeline/make_clips.sh` → 9 vertical clips.
7. Upload: Google Drive "Ready" folder → Zapier → YouTube (Mon/Wed/Fri 3pm ET).

## Requirements
Node 20+ with `playwright` (Chromium), Python 3 with `pocketsphinx`, ffmpeg, Inter Display font.
