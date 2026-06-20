// Smizo Channel API — Vercel serverless function
// GET /api/api?token=YOUR_TOKEN
// Replaces the old php/api.php which was being blocked by InfinityFree's
// Cloudflare bot protection when called from the Android app's WebView.
//
// This is a 1:1 behavioral port of api.php + config.php + channels.php:
//   - same token check (query param OR X-Smizo-Token header)
//   - same JSON response shape: { app, version, cats, channels }
//   - same 401 response on bad/missing token

const channels = require("../data/channels.json");

const APP_NAME = "Smizo";
const APP_VERSION = "19.08.2006";
// Set this in Vercel's dashboard under Project Settings → Environment
// Variables as SMIZO_API_TOKEN. Falling back to the original hardcoded
// token here only so this works immediately on first deploy — replace
// the fallback or (better) set the env var and remove the fallback once
// you've rotated the token.
const API_TOKEN = process.env.SMIZO_API_TOKEN || "smz_2710c51cc1461248e8088339fd51f1af3800ff9b6133548e";

const cats = Object.keys(channels);

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  const token = (req.query && req.query.token) || req.headers["x-smizo-token"] || "";

  if (token !== API_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.status(200).json({
    app: APP_NAME,
    version: APP_VERSION,
    cats: cats,
    channels: channels,
  });
};
