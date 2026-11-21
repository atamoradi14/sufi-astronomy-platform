---
name: fanous-instagram-reels
description: Rules for making and publishing Fanous-e Khial (فانوس خیال, fanous.online) Instagram reels on @fanoussky — the cover must appear within the first half second of every reel. Use whenever creating, editing, exporting, scheduling or publishing any reel or video for the Fanous page, including through the Ravands MCP.
---

# Fanous-e Khial Instagram reels

## Rule 1: the cover goes inside the video, at the start (required for every reel)

Every reel must show its cover within the **first 0.5 seconds**. In practice, start on the cover at frame 0 and keep it fully visible for at least the first 0.5 s.

Why: Ravands' `publish_reel` can't attach a separate cover, so Instagram uses the opening frame as the thumbnail. A reel that doesn't open on its cover goes out with a random frame as its thumbnail. Ravands also can't delete a post, so fixing that means deleting it by hand in the app and reposting.

How:
1. Design the cover as a 1080×1920 PNG. Keep all text inside the central 3:4 area (y ≈ 240–1680) so the profile-grid crop doesn't cut it.
2. Run `scripts/prepend_cover.sh cover.png reel.mp4 out.mp4`. The cover holds until 1.0 s and then crossfades into the reel.
3. Open the `*-frame0.png` the script writes and confirm it is the cover **before** uploading. Never publish a reel whose first frame isn't the cover.

## Rule 2: links and branding

- The site is **https://fanous.online**; the sphere lab is `fanous.online/lab`. Never use `manderia.daryajan.com`, which is an old redirect.
- The Instagram account is **@fanoussky**. In Ravands it is account id `ccb1b73c-4737-4ac7-a1f4-8ed296e132d1` (business «فانوس خیال»).
- Captions and on-screen text are in Persian, with Persian digits.

## Rule 3: publishing through Ravands MCP

1. Run `get_upload_link`, then `curl -F file=@out.mp4 "<uploadUrl>"`, then `check_publish_media` with type `reel` and **one** file per call.
2. Do a `publish_reel` dry run (without `confirm`), then the real call with `confirm=true`.
   - **Scheduling uses the user's timezone, not the Ravands business timezone.** The business is set to Asia/Tehran, but the user reads the Ravands panel in **UTC+13 (New Zealand daylight time)**. A reel scheduled for "20:00 Tehran" showed up as 05:30 the next morning there.
   - "Tomorrow" or "the day after" means **exactly 24 h / 48 h after the previous post** in the series, unless the user names a clock time.
   - Before scheduling, state each time in the user's local time and in UTC, then pass `scheduledAt` with an explicit offset.
3. If `publish_reel` times out, **don't retry blindly**. Check `list_publish_jobs` first, and only resend if the job isn't there. Otherwise the reel gets posted twice.
4. Ravands can't delete or edit posts. If something was posted wrong, tell the user exactly which posts to delete in the Instagram app.

## Persian text in overlays (lessons learned)

- Render text with Chromium (HTML/CSS + Vazirmatn), not PIL, so the Persian letters join correctly.
- Wrap math and degree values in an LTR isolate (`direction:ltr; unicode-bidi:isolate`). Otherwise `۱۸۰°` shows as `°۱۸۰` and `A + B + C > ۱۸۰°` comes out reversed.
- The reel pipeline used so far is in `marketing/reels-interactive-sphere/source/`.
