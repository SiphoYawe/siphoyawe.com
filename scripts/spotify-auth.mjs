// One-time Spotify authorization helper.
//
// Mints a long-lived refresh token for the now-playing endpoint using the
// authorization-code flow. Run it once from your machine:
//
//   1. Create an app at https://developer.spotify.com/dashboard
//   2. Add this exact Redirect URI to the app settings:
//        http://127.0.0.1:8888/callback
//   3. Export your app credentials, then run this script:
//        SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy npm run spotify:auth
//   4. Open the printed URL, approve, and copy the SPOTIFY_REFRESH_TOKEN it
//      prints into your .env / Vercel env vars.
//
// No dependencies beyond Node's stdlib.

import http from "node:http";
import crypto from "node:crypto";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.\n" +
      "Run: SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy npm run spotify:auth",
  );
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");

const authorizeUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
  }).toString();

async function exchangeCode(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${auth}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end("Not found");
    return;
  }

  const error = url.searchParams.get("error");
  if (error) {
    res.writeHead(400).end(`Authorization failed: ${error}`);
    server.close();
    process.exit(1);
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  if (returnedState !== state) {
    res.writeHead(400).end("State mismatch — aborting.");
    server.close();
    process.exit(1);
  }

  try {
    const tokens = await exchangeCode(code);
    res
      .writeHead(200, { "content-type": "text/html" })
      .end(
        "<h1>Done.</h1><p>Refresh token printed in your terminal. You can close this tab.</p>",
      );
    console.log("\n=== Spotify refresh token ===\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    console.log("Paste that into your .env / Vercel environment variables.\n");
  } catch (err) {
    res.writeHead(500).end(String(err));
    console.error(err);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log("\nOpen this URL in your browser to authorize:\n");
  console.log(authorizeUrl + "\n");
  console.log(`Waiting for the redirect to ${REDIRECT_URI} ...\n`);
});
