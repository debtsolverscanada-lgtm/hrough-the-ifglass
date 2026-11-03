---
name: voiceover
description: Choose and generate voiceovers (ElevenLabs) for the owner's channels so narration is consistent: which narrator fits which story, TTS settings, pacing and sound under the voice. Use whenever writing a script that will be voiced, changing a narrator, or fixing how a voiceover sounds.
---

# Voiceovers

Engines: 3 AM Stories `channels/3am-stories/engine/build.py` (story.json "voice" + "tts"; per-scene "voice" lists for
characters); Ifglass `pipeline/tts.py` (meta.json voice_id / ELEVENLABS_VOICE_ID); AfterLife story.json "voice".
The ElevenLabs key is a GitHub secret only; locally pass `ELEVENLABS_API_KEY=x` and rely on the cached `voice/` takes
(git pull after a GitHub build). Never ask the owner to paste a key.

## Narrators
- Pool: Brian (deep male), Sarah (female 30s), Bill (older male), Matilda (warm female), Callum (young male), Dorothy.
  First-person: the voice matches the lead's age and gender. Third-person/true stories: rotate. Never the same narrator
  3 Shorts in a row; log it in RULES.md. A missing voice name silently falls back to a male voice: check the build log
  line `voice: NAME for X` before posting.
- Character lines (a whisper, "Four.", a caller) use a different voice via the scene's "voice" list, kept short.
- AfterLife commentary: Adam. Ifglass: the episode's meta.json voice.

## Settings that sound right
- 3 AM Stories: stability 0.4-0.45, similarity 0.8, style 0.4-0.45, speed 1.05-1.1. Pauses ≤0.3 s except the deliberate
  beat before the payoff (0.6-0.9 s). ~160 words per 50 s Short.
- Mix: loudnorm -14 LUFS; effects and music sit under the voice; loudest moment ≤ ~7 dB over the typical level;
  no sharp stings; land the final hit ~0.6 s before the last line; never talk over the payoff.
- Write for the ear: short sentences, numbers spelled the way they're said, one idea per line (each line = one shot).
