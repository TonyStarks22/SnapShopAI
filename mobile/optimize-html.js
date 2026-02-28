import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function optimizeHtml() {
  const htmlPath = path.join(__dirname, 'dist', 'index.html');
  console.log('🔍 Optimizing HTML at:', htmlPath);

  let html = await readFile(htmlPath, 'utf-8');
  console.log(`📄 Original HTML length: ${html.length}`);

  // 1. Make main CSS non‑blocking
  const cssRegex = /<link[^>]*href="([^"]+\.css)"[^>]*>/;
  const cssMatch = html.match(cssRegex);
  if (cssMatch) {
    const cssHref = cssMatch[1];
    const newCssLink = `<link rel="stylesheet" href="${cssHref}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${cssHref}"></noscript>`;
    html = html.replace(cssRegex, newCssLink);
    console.log('✅ CSS link replaced for:', cssHref);
  } else {
    console.log('❌ CSS link not found!');
  }

  // 2. Make Google Fonts stylesheet non‑blocking
  const googleFontsRegex = /<link[^>]*href="https:\/\/fonts\.googleapis\.com[^"]+"[^>]*>/;
  const googleMatch = html.match(googleFontsRegex);
  if (googleMatch) {
    const googleHref = googleMatch[0].match(/href="([^"]+)"/)[1];
    const newGoogleLink = `<link rel="stylesheet" href="${googleHref}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${googleHref}"></noscript>`;
    html = html.replace(googleFontsRegex, newGoogleLink);
    console.log('✅ Google Fonts link made non‑blocking.');
  } else {
    console.log('❌ Google Fonts link not found.');
  }

  await writeFile(htmlPath, html);
  console.log('🎉 HTML optimization complete!');
}

optimizeHtml().catch(console.error);