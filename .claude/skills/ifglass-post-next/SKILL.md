---
name: ifglass-post-next
description: Post the next Through the Ifglass Short (Part series) from the queue sheet without ever reposting one, and keep the sheet in sync with what is really on the channel. Use for "post the next ifglass short/reel", "post another short in ifglass", or when checking for duplicate Ifglass uploads.
---

# Through the Ifglass: post the next Short, never a repeat

Queue: Google Sheet `1JcntZJI0ddHcjjJVqQczsxH91duuX73FnXZnkRQdyjQ`, tab `Shorts`
(columns: episode, clip, title, description, tags, video_file_id, status, youtube_id, added_at, post_order).
Sheets via Zapier GoogleSheetsV2CLIAPI `_zap_raw_request` on connection `0290d47d-771c-8d3a-83aa-7afe50eabdbf`
(GET values with the read action and fail_on_errors "false"; writes = POST `values:batchUpdate`, valueInputOption RAW).
Channel: YouTube connection `02fbff33-7e6c-848c-817a-ee35e4c556b2`, uploads playlist `UUEmR0Rx8ovmSC3vrhBcYCDw`.
A Zapier "Shorts Zap" also posts from this sheet on a schedule (SCHEDULE.md) and has been seen NOT marking rows posted.

## Steps
1. Read the last ~6 uploads (YouTube `playlistItems`, part snippet). Read the Shorts tab.
2. Reconcile first: any row still `ready` whose title is already on the channel → set status `posted` + youtube_id.
   Duplicates on the channel (same title twice) → tell the owner; never delete without their OK.
3. Next = first `ready` row in post_order then episode then clip order, skipping `replaced`. Confirm its title is not on the channel.
4. Mark it `posting` in the sheet (so the Zap can't grab it), hydrate its video_file_id via GoogleDriveCLIAPI
   `file_or_folder_by_id`, `upload_video` (category 28, public, not made for kids, the row's title/tags).
   If the series' full episode is already up, put its watch link in the description instead of "out this week".
5. Set the row to `posted` + the new youtube_id. Report the link and what's next in the queue.
6. If the Zap left rows unmarked, tell the owner to check the Zap's last step (update spreadsheet row) in Zap History.

7. Remind the owner (once per series) to set each Part's Related video to the next Part in Studio; the API can't.
