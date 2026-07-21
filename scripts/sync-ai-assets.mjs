#!/usr/bin/env node
/**
 * Syncs AI-generated assets from the staging area into the site.
 *
 * Flow (see AI-ASSET-PROMPTS.md): finals land in
 *   ../content-drop/ai-assets/<section>/<name>.(png|webp)
 * get copied to
 *   public/assets/ai/<section>/<name>.<ext>
 * and registered in lib/generated/ai-assets.json, keyed "<section>/<name>"
 * (no extension). Components ask lib/ai-assets.ts for a slot and render the
 * AI image when present, their hand-drawn SVG/CSS fallback otherwise.
 *
 * Run manually with `node scripts/sync-ai-assets.mjs`, automatically on
 * predev/prebuild, and after any new drop. Commit public/assets/ai/** and
 * lib/generated/ai-assets.json so Vercel gets the finals.
 */
import { existsSync, mkdirSync, readdirSync, copyFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.resolve(siteRoot, "../content-drop/ai-assets");
const PUBLIC_DIR = path.join(siteRoot, "public/assets/ai");
const MANIFEST_DIR = path.join(siteRoot, "lib/generated");
const MANIFEST = path.join(MANIFEST_DIR, "ai-assets.json");

const ACCEPT = new Set([".png", ".webp", ".jpg", ".jpeg"]);

/** @returns {Record<string, string>} slot -> public url */
function scan() {
  const out = {};
  if (!existsSync(SOURCE)) return out;
  for (const section of readdirSync(SOURCE, { withFileTypes: true })) {
    if (!section.isDirectory()) continue;
    const dir = path.join(SOURCE, section.name);
    for (const file of readdirSync(dir)) {
      const ext = path.extname(file).toLowerCase();
      if (!ACCEPT.has(ext)) continue;
      const name = path.basename(file, ext);
      out[`${section.name}/${name}`] = `/assets/ai/${section.name}/${file}`;
    }
  }
  return out;
}

const slots = scan();

rmSync(PUBLIC_DIR, { recursive: true, force: true });
mkdirSync(PUBLIC_DIR, { recursive: true });
mkdirSync(MANIFEST_DIR, { recursive: true });

for (const [slot, url] of Object.entries(slots)) {
  const [section, filename] = slot.split("/");
  const ext = path.extname(url);
  mkdirSync(path.join(PUBLIC_DIR, section), { recursive: true });
  copyFileSync(
    path.join(SOURCE, section, filename + ext),
    path.join(PUBLIC_DIR, section, filename + ext),
  );
}

writeFileSync(MANIFEST, JSON.stringify(slots, null, 2) + "\n");

const count = Object.keys(slots).length;
console.log(
  count === 0
    ? "[ai-assets] no finals found in content-drop/ai-assets yet; fallbacks stay on"
    : `[ai-assets] synced ${count} asset(s): ${Object.keys(slots).join(", ")}`,
);
