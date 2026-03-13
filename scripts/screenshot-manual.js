/**
 * 自动截取使用说明书配图（图1.png～图38.png）。
 * 需要应用已运行（npm run dev 或已部署），且本机可访问 BASE_URL。
 * 使用 Puppeteer（支持 Node 16）。
 *
 * 使用：BASE_URL=http://localhost:3001 node scripts/screenshot-manual.js
 * 截图保存到项目根目录 screenshots/ 下，供 gen_manual_docx.py 嵌入 Word。
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'screenshots');

/** Inject CJK web font so Chinese renders in headless Chromium (no system fonts). */
async function ensureChineseFont(page) {
  await page.addStyleTag({
    url: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.0/chinese-400-normal.css',
  });
  await page.addStyleTag({
    url: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.0/chinese-700-normal.css',
  });
  await page.addStyleTag({
    content:
      'body, body * { font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif !important; }',
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
}

const FIGURES = [
  { num: 1, path: '/' },
  { num: 2, path: '/' },
  { num: 3, path: '/project/new' },
  { num: 4, path: '/case-01/evidence' },
  { num: 5, path: '/case-01/evidence' },
  { num: 6, path: '/case-01/export' },
  { num: 7, path: '/case-01/evidence' },
  { num: 8, path: '/case-01/evidence' },
  { num: 9, path: '/case-01/evidence' },
  { num: 10, path: '/' },
  { num: 11, path: '/' },
  { num: 12, path: '/' },
  { num: 13, path: '/case-01/evidence' },
  { num: 14, path: '/project/new' },
  { num: 15, path: '/case-01/evidence' },
  { num: 16, path: '/case-01/evidence' },
  { num: 17, path: '/case-01/evidence' },
  { num: 18, path: '/case-01/evidence' },
  { num: 19, path: '/case-01/evidence' },
  { num: 20, path: '/case-01/mapping' },
  { num: 21, path: '/case-01/mapping' },
  { num: 22, path: '/case-01/mapping' },
  { num: 23, path: '/case-01/reasoning' },
  { num: 24, path: '/case-01/reasoning' },
  { num: 25, path: '/case-01/reasoning' },
  { num: 26, path: '/case-01/reasoning' },
  { num: 27, path: '/case-01/overview' },
  { num: 28, path: '/case-01/overview' },
  { num: 29, path: '/case-01/overview' },
  { num: 30, path: '/case-01/overview' },
  { num: 31, path: '/case-01/overview' },
  { num: 32, path: '/case-01/overview' },
  { num: 33, path: '/case-01/overview' },
  { num: 34, path: '/case-01/export' },
  { num: 35, path: '/case-01/export' },
  { num: 36, path: '/case-01/export' },
  { num: 37, path: '/case-01/export' },
  { num: 38, path: '/case-01/export' },
];

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const fig of FIGURES) {
    const url = BASE_URL.replace(/\/$/, '') + fig.path;
    const outFile = path.join(OUT_DIR, `图${fig.num}.png`);
    console.log(`图${fig.num} ${fig.path} -> 图${fig.num}.png`);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1200);
      await ensureChineseFont(page);
      await page.screenshot({ path: outFile, fullPage: true });
      await page.close();
    } catch (e) {
      console.error(`图${fig.num} 失败:`, e.message);
    }
  }

  await browser.close();
  console.log('截图已保存到', OUT_DIR);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
