import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
const shell = execSync('ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-mac/headless_shell | tail -1').toString().trim();
const browser = await chromium.launch({ executablePath: shell });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2], { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return "no h1";
  const r = h1.getBoundingClientRect();
  const cs = getComputedStyle(h1);
  return {
    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
    fontSize: cs.fontSize, color: cs.color, opacity: cs.opacity,
    fontFamily: cs.fontFamily.slice(0, 60), visibility: cs.visibility,
    text: h1.textContent?.slice(0, 30),
    innerSpans: h1.querySelectorAll("span").length,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
