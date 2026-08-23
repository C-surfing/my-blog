const { chromium } = require('/home/enovo/.nvm/versions/node/v24.12.0/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const taskDir = '/home/enovo/my-blog/xhs-blog-intro';
  const htmlPath = path.join(taskDir, 'index.html');
  const outputDir = path.join(taskDir, 'output');
  
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const posters = await page.$$('.poster.xhs');
  console.log(`Found ${posters.length} posters`);

  for (let i = 0; i < posters.length; i++) {
    const poster = posters[i];
    const clip = await poster.boundingBox();
    if (!clip) { console.log(`Poster ${i+1} has no bounding box`); continue; }
    
    // Take screenshot of just this poster
    const filename = `xhs-${String(i+1).padStart(2,'0')}-${['cover','stats','articles','features','roadmap','series','closing'][i]}.png`;
    await poster.screenshot({ path: path.join(outputDir, filename) });
    console.log(`Saved: ${filename} (${Math.round(clip.width)}x${Math.round(clip.height)})`);
  }

  await browser.close();
  console.log('Done!');
})();
