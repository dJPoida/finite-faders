const puppeteer = require('puppeteer');

async function testHydrationAndFunctionality() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false,  // Set to true for headless mode
      devtools: true
    });

    const page = await page.newPage();

    // Listen for console errors that might indicate hydration issues
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('Console Error:', msg.text());
      }
    });

    // Listen for page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log('Page Error:', error.message);
    });

    console.log('Navigating to application...');
    await page.goto('http://localhost:3002', {
      waitUntil: 'networkidle0',
      timeout: 10000
    });

    console.log('Waiting for page to load completely...');
    await page.waitForTimeout(2000);

    // Test desktop viewport
    console.log('\n=== DESKTOP TESTING ===');
    await page.setViewport({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);

    // Check for hydration-specific errors
    const hydrationErrors = consoleErrors.filter(error =>
      error.includes('hydration') ||
      error.includes('Hydration') ||
      error.includes('Text content does not match') ||
      error.includes('Prop `') ||
      error.includes('Warning: Expected server HTML')
    );

    console.log(`Hydration errors found: ${hydrationErrors.length}`);
    hydrationErrors.forEach(error => console.log('  -', error));

    // Test slider functionality
    console.log('\n=== TESTING SLIDER FUNCTIONALITY ===');

    // Find all sliders
    const sliders = await page.$$('[role="slider"]');
    console.log(`Found ${sliders.length} sliders`);

    if (sliders.length > 0) {
      const firstSlider = sliders[0];

      // Get initial value
      const initialValue = await firstSlider.getAttribute('aria-label');
      console.log('Initial slider value:', initialValue);

      // Try to interact with the slider using keyboard
      await firstSlider.focus();
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(500);

      // Check if value changed
      const newValue = await firstSlider.getAttribute('aria-label');
      console.log('Value after ArrowUp:', newValue);

      // Test clicking on the slider track
      const sliderBounds = await firstSlider.boundingBox();
      if (sliderBounds) {
        await page.mouse.click(
          sliderBounds.x + sliderBounds.width / 2,
          sliderBounds.y + sliderBounds.height / 4
        );
        await page.waitForTimeout(500);

        const clickValue = await firstSlider.getAttribute('aria-label');
        console.log('Value after click:', clickValue);
      }
    }

    // Test mobile viewport
    console.log('\n=== MOBILE TESTING ===');
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Test touch interaction if possible
    if (sliders.length > 0) {
      const firstSlider = sliders[0];
      const sliderBounds = await firstSlider.boundingBox();

      if (sliderBounds) {
        // Simulate touch drag
        await page.touchscreen.tap(
          sliderBounds.x + sliderBounds.width / 2,
          sliderBounds.y + sliderBounds.height / 2
        );
        await page.waitForTimeout(500);
      }
    }

    // Test add/remove entity buttons
    console.log('\n=== TESTING ADD/REMOVE FUNCTIONALITY ===');

    // Test add entity
    const addButton = await page.$('[aria-label="Add new entity"]');
    if (addButton) {
      const initialEntityCount = sliders.length;
      await addButton.click();
      await page.waitForTimeout(1000);

      const newSliders = await page.$$('[role="slider"]');
      console.log(`Entities before: ${initialEntityCount}, after: ${newSliders.length}`);
    }

    // Final error summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total console errors: ${consoleErrors.length}`);
    console.log(`Hydration-specific errors: ${hydrationErrors.length}`);
    console.log(`Page errors: ${pageErrors.length}`);

    if (hydrationErrors.length > 0) {
      console.log('\nHydration issues detected:');
      hydrationErrors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    }

    if (pageErrors.length > 0) {
      console.log('\nPage errors detected:');
      pageErrors.forEach((error, i) => console.log(`${i + 1}. ${error}`));
    }

    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for manual inspection. Close manually when done.');

  } catch (error) {
    console.error('Test failed:', error);
  }

  // Don't close browser automatically to allow manual inspection
  // if (browser) await browser.close();
}

testHydrationAndFunctionality();