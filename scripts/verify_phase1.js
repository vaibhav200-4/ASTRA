import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

async function run() {
  console.log('--- STARTING PHASE 1 PLAYWRIGHT VERIFICATION ---');

  // Start Vite dev server in background
  const viteProcess = spawn('npx', ['vite', '--host'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe',
  });

  viteProcess.stdout.on('data', (data) => {
    console.log(`[Vite] ${data.toString().trim()}`);
  });

  viteProcess.stderr.on('data', (data) => {
    console.error(`[Vite ERR] ${data.toString().trim()}`);
  });

  // Wait 6 seconds for Vite server to boot
  await new Promise((resolve) => setTimeout(resolve, 6000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleLogs = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`[UNCAUGHT EXCEPTION] ${err.message}`);
  });

  let loaded = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Navigating to http://localhost:5173 ...`);
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
      loaded = true;
      break;
    } catch (e) {
      console.log(`Attempt ${attempt} failed, waiting 2s...`);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  if (loaded) {
    await page.waitForTimeout(3000);

    const screenshotPath = path.join(process.cwd(), 'phase1_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n✓ Phase 1 Screenshot successfully saved to: ${screenshotPath}`);

    console.log(`\n--- CONSOLE ERRORS COUNT: ${consoleErrors.length} ---`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach((e, idx) => console.log(`${idx + 1}. ${e}`));
    } else {
      console.log('✓ ZERO console errors reported across all Phase 1 components!');
    }
  } else {
    console.error('Failed to load http://localhost:5173 after 5 attempts.');
  }

  await browser.close();
  viteProcess.kill();
  process.exit(0);
}

run();
