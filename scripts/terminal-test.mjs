import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
const shell = execSync('ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-mac/headless_shell | tail -1').toString().trim();
const browser = await chromium.launch({ executablePath: shell });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => { try { sessionStorage.setItem("sy-preloaded", "1"); } catch {} });
const page = await context.newPage();
await page.goto("http://localhost:3100", { waitUntil: "load" });
await page.waitForTimeout(1500);
await page.keyboard.press("`");
await page.waitForTimeout(500);
await page.keyboard.type("whoami");
await page.keyboard.press("Enter");
await page.keyboard.type("verse");
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
await page.screenshot({ path: "shots/terminal.png" });
// konami
await page.keyboard.press("Escape");
for (const k of ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]) {
  await page.keyboard.press(k);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(600);
await page.screenshot({ path: "shots/konami.png" });
await browser.close();
console.log("done");
