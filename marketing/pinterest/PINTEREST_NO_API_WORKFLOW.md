# Pinterest without the developer API

This is the StackGeist path for Pinterest publishing when the Pinterest developer API/OAuth path is blocked, missing scopes, or not worth the approval dance.

## What this uses

Use Pinterest's official bulk CSV web importer:

```text
https://www.pinterest.com/settings/bulk-create-pins/
```

This is not the Pinterest developer API. It does not require OAuth, app approval, a refresh token, or API scopes.

## What this avoids

Do not reverse-engineer Pinterest's private browser endpoints. They are unstable, undocumented, and more likely to trigger account-risk systems than the normal uploader. The whole point is to stay boring and official, like a beige minivan that somehow wins the race.

## Workflow

1. Generate or update the CSV and public PNG assets.
2. Validate the CSV locally.
3. Verify representative media URLs and destination URLs are live on `stackgeist.dev`.
4. Open the official Pinterest bulk uploader.
5. Upload the CSV manually while logged into the Pinterest business account.
6. Treat `Upload successful` as accepted/processing, not complete.
7. Read back scheduled/created pins in the Pinterest UI later.

## Helper command

From repo root:

```bash
python scripts/pinterest-no-api.py marketing/pinterest/pinterest-troubleshooting-guides-v1.csv
```

The helper:

- validates Pinterest CSV headers
- validates required fields
- validates StackGeist HTTPS media URLs
- validates destination URLs and UTM parameters
- checks representative public URLs with network requests
- copies the CSV absolute path to the Windows clipboard
- opens the official Pinterest bulk uploader

Validate only, no browser open:

```bash
python scripts/pinterest-no-api.py marketing/pinterest/pinterest-troubleshooting-guides-v1.csv --no-open
```

## Current troubleshooting campaign

CSV:

```text
E:\Repos\stackgeist\stackgeist-site\marketing\pinterest\pinterest-troubleshooting-guides-v1.csv
```

Bulk upload URL:

```text
https://www.pinterest.com/settings/bulk-create-pins/
```

Verification URL:

```text
https://www.pinterest.com/pin-builder/scheduled/
```

Expected current batch:

- 54 rows
- 42 pins to `Desk Setup Guides`
- 12 pins to `Cable Management`
- scheduled one per day from `2026-10-01T12:00:00` through `2026-11-23T12:00:00`
- campaign: `troubleshooting_guides_v1`

## Verification checklist

After Pinterest finishes processing, check at least these rows in the UI:

1. `USB-C Dock Only Detecting One Monitor?`
2. `MX Master 3S Scroll Wheel Acting Weird?`
3. `Desk Chair Gas Lift Checklist`

For each checked pin, confirm:

- expected board
- image loads
- title matches the CSV
- destination starts with `https://stackgeist.dev/guides/`
- destination includes `utm_source=pinterest`, `utm_medium=organic`, `utm_campaign=troubleshooting_guides_v1`, and a `utm_content=tgXX` value

## If upload fails

- Make sure every `Media URL` returns a public `200 OK` image response.
- Make sure every board name exists exactly in Pinterest.
- Leave `Thumbnail` blank for image pins.
- Use future UTC publish dates.
- Upload smaller batches of 10-15 rows if Pinterest rejects the full CSV with a vague error.
