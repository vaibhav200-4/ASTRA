import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

async function run() {
  console.log('--- STARTING PHASE 3 PLAYWRIGHT VERIFICATION ---');

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

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
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
    await page.waitForTimeout(2000);

    // 1. AI Monitor Page Screenshot
    console.log('Navigating to AI Monitor tab...');
    const aiNavButton = await page.locator('button[title="AI Monitor"], button:has-text("AI Monitor")').first();
    if (await aiNavButton.isVisible()) {
      await aiNavButton.click();
      await page.waitForTimeout(3000);
    }
    const aiMonitorPath = path.join(process.cwd(), 'ai_monitor_phase3_screenshot.png');
    await page.screenshot({ path: aiMonitorPath, fullPage: false });
    console.log(`✓ AI Monitor Screenshot saved to: ${aiMonitorPath}`);

    // 2. Live Console Page Screenshot
    console.log('Navigating to Live Console tab...');
    const liveNavButton = await page.locator('button[title="Live Console"], button:has-text("Live Console")').first();
    if (await liveNavButton.isVisible()) {
      await liveNavButton.click();
      await page.waitForTimeout(3000);
    }
    const livePath = path.join(process.cwd(), 'live_phase3_screenshot.png');
    await page.screenshot({ path: livePath, fullPage: false });
    console.log(`✓ Live Console Screenshot saved to: ${livePath}`);

    // 3. Test Viewport 3D Mode
    console.log('Testing 3D Viewport mode...');
    const btn3D = await page.locator('button:has-text("3D VIEW")').first();
    if (await btn3D.isVisible()) {
      await btn3D.click();
      await page.waitForTimeout(2000);
      const vp3dPath = path.join(process.cwd(), 'viewport_3d_screenshot.png');
      await page.screenshot({ path: vp3dPath, fullPage: false });
      console.log(`✓ 3D Viewport Screenshot saved to: ${vp3dPath}`);
    }

    // 4. Test Viewport Dual Mode
    console.log('Testing Dual Viewport mode...');
    const btnDual = await page.locator('button:has-text("2D / 3D DUAL")').first();
    if (await btnDual.isVisible()) {
      await btnDual.click();
      await page.waitForTimeout(2000);
      const vpDualPath = path.join(process.cwd(), 'viewport_dual_screenshot.png');
      await page.screenshot({ path: vpDualPath, fullPage: false });
      console.log(`✓ Dual Viewport Screenshot saved to: ${vpDualPath}`);
    }

    console.log(`\n--- CONSOLE ERRORS COUNT: ${consoleErrors.length} ---`);
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach((e, idx) => console.log(`${idx + 1}. ${e}`));
    } else {
      console.log('✓ ZERO console errors reported across all Phase 3 tests!');
    }
  } else {
    console.error('Failed to load http://localhost:5173 after 5 attempts.');
  }

  await browser.close();
  viteProcess.kill();
  process.exit(0);
}

run();
