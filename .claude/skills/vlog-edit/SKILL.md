---
name: vlog-edit
description: Edit or re-edit the owner's personal travel/food vlogs (raw camera clips in Drive) with the vlog pipeline in vlog/, applying their standing editing preferences. Use for any vlog/"blog" edit request, feedback on a cut, montage ("mortgage" is autocorrect for montage) or music changes.
---

# Vlog editing

Pipeline: `vlog/edit.py` driven by `vlog/<id>/edl.json`; render on GitHub with `.github/workflows/vlog-edit.yml`
(inputs: name, urls = space-separated NAME|hydrated-URL pairs, style = "dobrik", optional preview seconds).
Output lands in the owner's Drive "Vlog Edits"; review contact sheets land in "Vlog Edits/Review" (private) — look at
them before telling the owner the cut is good. Raw footage, transcripts and frames are private: never commit them unencrypted.

## Owner's preferences (standing)
- Style "dobrik": jump cuts with pauses removed, angle changes every ~3 s, whip pans between scenes. Pop-up words OFF
  (`"pop_text": false`); punch-zoom hits may stay. Captions off.
- Order: going to New York (travel) first, then every food review, then the rest of the trip, then the end montage.
- Food reviews stay in full (`"food": true` on those clips: only pauses are trimmed).
- Everything else: cut dead air (`"cut_dead": true` uses Whisper voice spans; `dead_gap` 0.7 s; wordless shots keep `dead_keep` 3 s).
- End montage: one song only, carried through the outro (`"music": {"song": ..., "continue": true}`), roughly as long as
  the earlier versions (teaser `beats_per_cut` 4 ≈ 1.5 s a shot). Lip sync must stay exact (the log prints a sync check).
- The owner gives feedback best as timestamps; ask for them when a note is vague, and say plainly what was changed.

## Steps
1. Edit `edl.json` (and edit.py only for new behaviour), commit + push.
2. Dispatch vlog-edit.yml (the hydrated URL list for vlog01 lives in the scratchpad dispatch.json of the session that made
   it; if expired, re-hydrate each clip with Zapier GoogleDriveCLIAPI `file_or_folder_by_id`). Runs take ~2 h.
3. Watch the run (pieces count, total minutes, sync check, uploaded link), view the review sheets, then send the Drive link
   with the new length and a short list of what changed.
