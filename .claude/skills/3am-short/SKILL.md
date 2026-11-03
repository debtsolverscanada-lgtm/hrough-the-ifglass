---
name: 3am-short
description: Write, build, post and hand off a 3 AM Stories horror Short (or long-form) for the owner's YouTube channel, following the master playbook and the channel's rotation rules. Use whenever the owner asks for a new horror short/video ("make another short", "make another shirt" is autocorrect for short), or a scheduled task asks for the next horror Short.
---

# 3 AM Stories: horror Short end to end

Read first, every time: `channels/3am-stories/RULES.md` (owner's rules + rotation logs) and `channels/3am-stories/PLAYBOOK.md`
(master playbook, hook formulas F1-F15). They win over anything below.

## Owner's standing rules (do not re-ask)
- One Short at a time, at least 3 hours after the last 3 AM Stories Short. "Post when ready": post, then send the file here for TikTok with a TikTok caption.
- Picture every word: every room, place, object named is drawn when it's said. Missing scene → build it in `engine/scenes.js` first.
- Every video looks different: new lead (character builder), new grade not used in the last 10, new setting. Never reuse a lead.
- Rotate: narrator (Brian, Sarah, Bill, Matilda, Callum, Dorothy; never 3 in a row; first-person voice matches the lead;
  check the voice exists in ElevenLabs or the build falls back to a male voice), middle turn, hook formula. Log each in RULES.md.
- Soft sound: no loud bings/booms. Silence before the payoff. Numbers as objects. ~160 words per 50 s.
- Title ≤100 chars, title + thumbnail planned together, thumbnail text never the title.

## Steps
1. Pick hook formula, narrator, turn, grade, lead (check the RULES.md tables). Write `stories/0NN-slug/story.json`
   (copy the shape of the latest story: format, style "anime", voice, tts, grade, hero, thumb, yt, scenes[]).
2. Build any new scenes in `engine/scenes.js` (S.name = (t, d, p) => svg; set FOCUS.name). `node -e "new Function(...)"` syntax check.
3. Preview: link `engine/node_modules` to `$(npm root -g)`, render one still per scene at the vertical view [420,0,1080,1920]
   with Playwright (`window.setup(tl, view)`, `window.frame(t, n)`), tile them, look at every frame. Fix framing, darkness,
   blinks on the thumbnail, faces in the caption band (66-76% height). Remove the node_modules link after.
4. Thumbnail: use the `3am-thumbnail` skill. Save as `stories/0NN-slug/thumb.jpg`.
5. Log the row in RULES.md (grade/hero table and narrator/hook/turn table). Commit + push (end commit messages with the attribution lines).
6. Build: dispatch `.github/workflows/3am-build.yml` with input `story=channels/3am-stories/stories/0NN-slug`
   (GitHub MCP `actions_run_trigger`, or `gh api -X POST repos/OWNER/REPO/actions/workflows/3am-build.yml/dispatches`).
   Watch the run; the job log prints `uploaded https://drive.google.com/file/d/ID` (video first, thumb second).
7. Post: Zapier GoogleDriveCLIAPI `file_or_folder_by_id` (id) → its `file` hydrate URL → YouTubeV4CLIAPI `upload_video`
   on the 3 AM Stories connection (`0202bdfc-ea80-8057-b7a3-2226e8be0dd3`), category 24, public, not made for kids.
   Then `upload_video_thumbnail` with the raw.githubusercontent URL of the committed thumb.jpg.
8. TikTok: `git pull` (the build commits the voice), run `python3 engine/build.py stories/0NN-slug` locally with
   `ELEVENLABS_API_KEY=x` (voice is cached), copy `out/video.mp4` to the scratchpad, SendUserFile it with a TikTok caption
   (hook line + question + 6-8 hashtags incl. #fyp).
9. Tell the owner: link, what's new about it (setting, cast, look), and when the next Short slot opens.
