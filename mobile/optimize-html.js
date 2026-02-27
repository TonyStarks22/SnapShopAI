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

  // 3. Find and optimize the main script tag
  const scriptRegex = /<script\s+[^>]*type="module"[^>]*src="([^"]+\.js)"[^>]*>[\s\S]*?<\/script>/i;
  const scriptMatch = html.match(scriptRegex);
  if (scriptMatch) {
    const scriptTag = scriptMatch[0]; // full tag with closing
    const jsSrc = scriptMatch[1];

    // Add preload for this script
    const preloadLink = `<link rel="preload" as="script" href="${jsSrc}" crossorigin>`;
    if (!html.includes(preloadLink)) {
      html = html.replace('</head>', preloadLink + '\n</head>');
      console.log('✅ Main JS preload added for:', jsSrc);
    }

    // Move script to end of body
    html = html.replace(scriptTag, '');
    const bodyEndIndex = html.lastIndexOf('</body>');
    if (bodyEndIndex !== -1) {
      html = html.slice(0, bodyEndIndex) + scriptTag + '\n' + html.slice(bodyEndIndex);
      console.log('✅ Main script moved to end of body.');
    } else {
      console.log('❌ </body> not found, cannot move script.');
    }
  } else {
    console.log('❌ Main JS script not found! Searching for any <script>...');
    const allScripts = html.match(/<script[^>]*>/g);
    if (allScripts) {
      console.log('Found script tags:', allScripts);
    } else {
      console.log('No script tags found.');
    }
  }

  // 4. Add preconnect for own origin
  const preconnectOrigin = 'https://www.snapshop.net';
  const preconnectTag = `<link rel="preconnect" href="${preconnectOrigin}">`;
  if (!html.includes(preconnectTag)) {
    html = html.replace('<head>', '<head>\n  ' + preconnectTag);
    console.log('✅ Preconnect added for own origin.');
  } else {
    console.log('ℹ️ Preconnect already present.');
  }

  // 5. Font preloads removed (caused 404 errors)

  await writeFile(htmlPath, html);
  console.log('🎉 HTML optimization complete!');
}

optimizeHtml().catch(console.error);