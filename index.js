const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const readline = require("readline");

puppeteer.use(StealthPlugin());

const pagesLimit = 10; // berapa halaman maksimal per keyword
let currentPage = 1;

// Fungsi untuk ambil link dari halaman
async function getPageLinks(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div.g, div.MjjYud"))
      .map((el) => {
        const linkElement = el.querySelector(".yuRUbf > a, a.zReHs");
        return linkElement ? linkElement.getAttribute("href") : null;
      })
      .filter(Boolean);
  });
}

// Fungsi scrape per keyword
async function scrapeKeyword(keyword, browser) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);

  const URL = "https://www.google.com/search?q=" + encodeURIComponent(keyword);
  await page.goto(URL);

  // Klik consent jika ada
  try {
    await page.waitForSelector("button#L2AGLb", { timeout: 5000 });
    await page.click("button#L2AGLb");
    console.log("Consent clicked");
  } catch {
    console.log("No consent popup");
  }

  // Cek captcha
  try {
    await page.waitForSelector("#captcha-form, #recaptcha", { timeout: 5000 });
    console.log("⚠️ CAPTCHA detected, solve manually...");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise((resolve) =>
      rl.question("Tekan ENTER setelah captcha selesai...", () => {
        rl.close();
        resolve();
      })
    );
  } catch {
    console.log("No captcha, continue...");
  }

  currentPage = 1;

  while (currentPage <= pagesLimit) {
    const links = await getPageLinks(page);

    // Simpan langsung ke file hasil.txt
    if (links.length > 0) {
      fs.appendFileSync("hasil.txt", links.join("\n") + "\n");
      console.log(`✅ ${links.length} links saved from page ${currentPage}`);
    }

    const nextBtn = await page.$("a#pnnext");
    if (nextBtn && currentPage < pagesLimit) {
      await Promise.all([
        page.click("a#pnnext"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      currentPage++;
    } else {
      break;
    }
  }

  await page.close();
}

(async () => {
  const keywords = fs.readFileSync("keywords.txt", "utf-8")
    .split("\n")
    .map((k) => k.trim())
    .filter(Boolean);

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const keyword of keywords) {
    console.log(`🔎 Scraping keyword: ${keyword}`);
    await scrapeKeyword(keyword, browser);
  }

  await browser.close();
  console.log("✅ Scraping selesai! Semua link sudah di simpan di hasil.txt");
})();
