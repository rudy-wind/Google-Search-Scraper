# Google Search Scraper


This script is used to **scrape links from Google search results** based on a list of keywords stored in `keywords.txt`.  
All scraped links will automatically be saved to `hasil.txt`.

## Features
- Uses **puppeteer-extra** with **stealth plugin** → helps bypass detection by Google.  
- Supports multiple keywords (from `keywords.txt`).  
- Can scrape up to **N pages** per keyword (`pagesLimit`).  
- Auto-handles Google consent popup (`Accept cookies`).  
- Auto-detects captcha with manual solving option.  
- Saves all links directly into `hasil.txt`.

---

## Requirements
- **Node.js** (v16 or higher recommended)  
- **NPM** (comes with Node.js)  

---

## Installation
1. Clone or download this repository/script.  
2. Navigate to the project folder.  
3. Install the required dependencies:

   ```bash
   npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer fs readline
> Note: `puppeteer` will download Chromium automatically, so make sure you have a stable internet connection.

---

## Usage

1. Create a file named `keywords.txt` in the project folder.

   * Put your keywords inside, **one keyword per line**.
   * Example:

     ```
     learn javascript
     python tutorial
     best laptop 2025
     ```

2. Run the script:

   ```bash
   node script.js
   ```

   > Replace `script.js` with your actual file name.

3. Chrome will launch automatically, and scraping will begin.

   * If a **consent popup** appears, the script will click it automatically.
   * If a **captcha** appears, solve it manually and press **ENTER** in the terminal to continue.

4. All results will be saved in `hasil.txt`.

---

## Output

* **hasil.txt** → contains all the scraped links from Google search results.
  Example:

  ```
  https://example.com/page1
  https://example.com/page2
  https://example.com/page3
  ```

---

## Important Notes

* Avoid scraping too fast or with too many keywords, or you may get blocked by Google.

* Adjust `pagesLimit` in the code to set how many pages to scrape per keyword:

  ```js
  const pagesLimit = 10; // default: 10 pages
  ```

* Use a **proxy or VPN** if needed to reduce captcha frequency.

---

## License

This project is intended for **educational and research purposes only**.
Any misuse is the sole responsibility of the user.
