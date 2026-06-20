# Smizo API — Vercel deployment (no panel, no FTP)

This replaces `php/api.php` with a Node serverless function on Vercel.
Same response shape, same token check — your Android app needs exactly
one line changed once this is live (see bottom of this file).

## Why

`smizo.page.gd` (InfinityFree) sits behind Cloudflare's free Bot Fight
Mode, which can serve an HTML challenge page instead of your JSON to
non-browser clients like a WebView's `fetch()` — and that tier has no way
to exempt a specific path. Vercel runs your own function directly, with
no shared host's bot-wall in front of it.

## What's in this folder

```
smizo-api/
├── api/
│   └── api.js          ← the serverless function (1:1 port of api.php)
├── data/
│   └── channels.json    ← your real channel data, converted from channels.php
├── package.json
└── vercel.json
```

All 265 channels across 10 categories (FIFA, LIVE, SPORTS, BANGLA, HINDI,
NEWS, MUSIC, KIDS, ENGLISH, RELIGIOUS) were carried over exactly as they
appear in your `channels.php` — names, URLs (including the DASH/ClearKey
`dash||...` ones), and logos unchanged.

## Deploy steps (all from a browser, no terminal needed)

1. **Create a GitHub repo** (or reuse one) and upload this entire
   `smizo-api` folder to it — same drag-and-drop upload you've already
   done for the Android app repo.

2. **Go to [vercel.com](https://vercel.com)** → Sign up with your GitHub
   account (one click, no separate password).

3. **New Project** → select the repo you just created → **Deploy**.
   Vercel auto-detects the `api/` folder; no build configuration needed
   for this project.

4. **Set your token as an environment variable** (recommended, keeps the
   token out of your public repo):
   - In the Vercel project → **Settings → Environment Variables**
   - Name: `SMIZO_API_TOKEN`
   - Value: `smz_2710c51cc1461248e8088339fd51f1af3800ff9b6133548e`
     (or a new token if you want to rotate it now)
   - Redeploy after adding it (Vercel will prompt you, or go to
     **Deployments → ⋯ → Redeploy**)

   If you skip this step, `api.js` falls back to the same hardcoded token
   that's already in your app, so it'll still work — just less clean.

5. **Get your URL.** Vercel gives you something like:
   ```
   https://smizo-api.vercel.app/api/api?token=smz_2710c51cc1461248e8088339fd51f1af3800ff9b6133548e
   ```
   Open that exact URL in Chrome on your phone first — confirm you get
   JSON back, not an error.

6. **The real test:** this URL needs to work from inside the app's
   WebView, not just Chrome. Once you update the app (next step) and
   rebuild, that's the actual proof it's fixed.

## Updating the Android app

Once your Vercel URL is confirmed working in Chrome, tell me the exact
URL and I'll update `app/src/main/assets/web/index.html` (the
`SMIZO_API_URL` constant) to point at it instead of
`smizo.page.gd/php/api.php`, repackage the app zip, and you rebuild via
GitHub Actions exactly like before.

## Updating channels later

To add/remove/edit channels going forward: edit `data/channels.json`
directly in GitHub's web editor (pencil icon on the file) and commit —
Vercel redeploys automatically on every push, usually live within ~30
seconds. No more editing PHP arrays, no FTP, no control panel.
