# One-time setup: auto-upload

Flow: **GitHub Actions** renders an episode → uploads the MP4, thumbnail and clips to **Google Drive** (`Through the Ifglass - Auto/Ready`) and adds a row to the **Ifglass Queue** sheet → a **Zap** posts the next ready video to YouTube **Mon / Wed / Fri at 3:00 PM ET**.

Use the Google account **danyalshoaib16@gmail.com** for all of the steps below.

---

## Part A: Let GitHub write to your Drive (about 10 min)

The app only gets the `drive.file` permission, so it can see **only the files it creates**, never the rest of your Drive.

1. Go to **https://console.cloud.google.com** → top bar project picker → **New project** → name it `ifglass-uploader` → **Create**, then select it.
2. Left menu **APIs & Services → Library**. Search for and **Enable** both **Google Drive API** and **Google Sheets API**.
3. **APIs & Services → OAuth consent screen** (also called "Google Auth Platform"):
   - App name `Ifglass Uploader`, your email for support and developer contact. Audience: **External**.
   - **Data access / Scopes → Add** → paste `https://www.googleapis.com/auth/drive.file` → Update → Save.
   - **Audience → Publish app → Confirm** (status becomes **In production**). If you skip this, Google cuts access every 7 days.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Type **Web application**, name `ifglass`.
   - Under **Authorized redirect URIs** add: `https://developers.google.com/oauthplayground`
   - **Create**, then copy the **Client ID** and **Client secret**.
5. Open **https://developers.google.com/oauthplayground**:
   - Gear icon (top right) → tick **Use your own OAuth credentials** → paste the Client ID and secret.
   - In the left box "Input your own scopes", paste `https://www.googleapis.com/auth/drive.file` → **Authorize APIs**.
   - Sign in as danyalshoaib16@gmail.com. If you see "Google hasn't verified this app", click **Advanced → Go to Ifglass Uploader**, then **Allow**.
   - Click **Exchange authorization code for tokens** and copy the **Refresh token**.
6. On GitHub, open this repo → **Settings → Secrets and variables → Actions → New repository secret** and add three secrets:
   - `GDRIVE_CLIENT_ID`
   - `GDRIVE_CLIENT_SECRET`
   - `GDRIVE_REFRESH_TOKEN`

   ⚠️ Paste these only into GitHub. Never paste them into chat.

Test: go to **Actions → Build & queue episode → Run workflow** → `episodes/001-frozen-100-years`. It takes about 2 hours. You should then see `Through the Ifglass - Auto/Ready` with the video and thumbnail, plus the **Ifglass Queue** sheet with one `ready` row.

---

## Part B: The auto-post Zap (about 10 min, needs a paid Zapier plan for multi-step Zaps)

Create a new Zap in Zapier with these steps:

| # | App → Event | Settings |
|---|---|---|
| 1 | **Schedule by Zapier → Every Week** | Days: Monday, Wednesday, Friday · Time: 3:00 PM · Timezone: America/Toronto |
| 2 | **Google Sheets → Lookup Spreadsheet Row** | Account danyalshoaib16 · Spreadsheet **Ifglass Queue** · Worksheet **Sheet1** · Lookup column **status** · Lookup value `ready` (it returns the oldest ready video) |
| 3 | **Filter by Zapier** | Only continue if *step 2 → Zap Search Was Found Status* is **true** |
| 4 | **Google Drive → Retrieve File or Folder by ID** | ID = step 2 **video_file_id** |
| 5 | **Google Drive → Retrieve File or Folder by ID** | ID = step 2 **thumbnail_file_id** |
| 6 | **YouTube → Upload Video** | Account **YouTube #2** (Through the Ifglass) · Title = step 2 **title** · Description = step 2 **description** · Video = step 4 **File** · Thumbnail = step 5 **File** · Privacy **public** · Tags = step 2 **tags** · Category **Science & Technology** · Made for kids **False** · Notify subscribers **True** |
| 7 | **Google Sheets → Update Spreadsheet Row** | Row = step 2 **row ID** · status `posted` · youtube_id = step 6 **ID** |
| 8 | **Google Drive → Move File** | File = step 4 **ID** → folder `Through the Ifglass - Auto/Posted` |

Turn the Zap **On**. If there's no `ready` row, it stops at step 3, so nothing gets posted twice.

---

## Making each new episode
1. Claude writes `episodes/NNN-*/…VOICEOVER.txt`, `meta.json`, `shotplan.json`, `clips.json` and the thumbnail.
2. You record the voiceover in ElevenLabs and add it as `voiceover.mp3` in that folder (upload it in chat, or on GitHub with Add file → Upload).
3. Commit an empty file named `READY` in the folder. That starts the build, and the Zap posts it at the next free Mon/Wed/Fri slot.
