import { chromium } from "playwright-core";
import { execSync } from "node:child_process";

const shell = execSync(
  'ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-mac/headless_shell 2>/dev/null | tail -1'
).toString().trim();

const [url, out, width = "1440", height = "900", fullPage = "false", dark = "false", hoverSel = "", hoverMs = "0"] =
  process.argv.slice(2);
const browser = await chromium.launch({ executablePath: shell });
const context = await browser.newContext({
  viewport: { width: +width, height: +height },
  colorScheme: dark === "true" ? "dark" : "light",
});
// Skip the preloader in screenshot runs.
await context.addInitScript(() => {
  try { window.sessionStorage.setItem("sy-preloaded", "1"); } catch {}
});
const page = await context.newPage();
// "load" not networkidle: the cal.com embed keeps connections open forever.
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2500);

// Scroll through so whileInView reveals fire, then settle back at the top.
// behaviour:"instant" overrides the site's CSS smooth scrolling.
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = () => {
      y += window.innerHeight * 0.7;
      window.scrollTo({ top: y, behavior: "instant" });
      if (y < document.body.scrollHeight) setTimeout(step, 90);
      else resolve();
    };
    step();
  });
});
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(400);

if (hoverSel) {
  await page.hover(hoverSel);
  await page.waitForTimeout(+hoverMs);
}

await page.screenshot({ path: out, fullPage: fullPage === "true" });
await browser.close();
console.log("saved", out);
