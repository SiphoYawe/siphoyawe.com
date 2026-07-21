import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
const shell = execSync('ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-mac/headless_shell | tail -1').toString().trim();
const browser = await chromium.launch({ executablePath: shell });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => { try { sessionStorage.setItem("sy-preloaded", "1"); } catch {} });
const page = await context.newPage();
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 200)));
await page.goto("http://localhost:3100", { waitUntil: "load" });
await page.waitForTimeout(1800);

const greeting = () => page.locator("section p").first().textContent();
console.log("EN greeting:", (await greeting())?.slice(0, 40));

await page.click("button[aria-label^='Language:']");
await page.waitForTimeout(300);
console.log("LG greeting:", (await greeting())?.slice(0, 40));

await page.click("button[aria-label^='Language:']");
await page.waitForTimeout(300);
console.log("RN greeting:", (await greeting())?.slice(0, 40));

// theme toggle
const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
console.log("dark before:", await isDark());
await page.click("button[aria-label^='Switch to']");
await page.waitForTimeout(300);
console.log("dark after:", await isDark());

// reduced motion: vinyl must not spin
const context2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await context2.addInitScript(() => { try { sessionStorage.setItem("sy-preloaded", "1"); } catch {} });
const page2 = await context2.newPage();
await page2.goto("http://localhost:3100", { waitUntil: "load" });
await page2.waitForTimeout(1500);
const spin = await page2.evaluate(() => {
  const el = document.querySelector("#now-playing [style*='animation'], #now-playing .vinyl-spin, #now-playing svg, #now-playing div");
  return el ? getComputedStyle(el).animationName : "none-found";
});
console.log("reduced-motion vinyl animation:", spin);

await browser.close();
console.log("done");
