import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const shell = execSync(
  'ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-mac/headless_shell 2>/dev/null | tail -1'
).toString().trim();

const svgText = readFileSync("public/brand/crest-full-colour.svg", "utf8");
const browser = await chromium.launch({ executablePath: shell });
const page = await browser.newPage();
await page.setContent(`<div id="wrap">${svgText}</div>`);
const box = await page.evaluate(() => {
  const svg = document.querySelector("svg");
  const b = svg.getBBox();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
});
await browser.close();
const pad = Math.round(Math.max(box.w, box.h) * 0.02);
const vb = `${Math.floor(box.x - pad)} ${Math.floor(box.y - pad)} ${Math.ceil(box.w + pad * 2)} ${Math.ceil(box.h + pad * 2)}`;
const cropped = svgText.replace(/viewBox="[^"]*"/, `viewBox="${vb}"`);
writeFileSync("public/brand/crest-badge.svg", cropped);
console.log("bbox viewBox:", vb);
