import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Taste Pilot - Restaurant Page Rendering and Assets Verification', () => {
  const testPassword = 'Password123!';
  const testName = 'Test User';
  let testEmail: string;
  
  // Artifacts directory for screenshots
  const screenshotDir = 'C:/Users/Lenovo/.gemini/antigravity/brain/27d9b139-2826-4307-a4a8-77807f059eba';

  test.beforeEach(async ({ page }) => {
    // Add console and request error listeners
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', err => {
      console.log('[BROWSER UNHANDLED ERROR]', err.stack);
    });

    page.on('requestfailed', request => {
      console.log(`[BROWSER NETWORK FAIL] ${request.url()}: ${request.failure()?.errorText}`);
    });

    testEmail = `testrender-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

    // 1. Register a test user
    await page.goto('/auth/register?redirect=/restaurants');
    await page.waitForTimeout(1500); // wait for page hydration
    
    // Capture screenshot of registration page
    await page.screenshot({ path: path.join(screenshotDir, '1_register_page.png') });

    await page.fill('input[id="fullName"]', testName);
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.fill('input[id="confirmPassword"]', testPassword);
    await page.check('input[name="agreeTerms"]');
    await page.click('button[type="submit"]');

    // 2. Wait for redirect to login
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await page.waitForTimeout(1000);

    // 3. Log in
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // 4. Wait for redirection to restaurants listing
    await page.waitForURL(/\/restaurants/, { timeout: 10000 });
  });

  test('Verify restaurant names, location, food names, and AVIF images', async ({ page }) => {
    // Assert we are on the restaurants listing page
    await expect(page).toHaveURL(/\/restaurants/);

    // Wait for the restaurant cards to render
    const firstCard = page.locator('a[href^="/restaurant/"]').first();
    await firstCard.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(2000); // Wait for images to load fully

    // Capture screenshot of restaurants listing page
    await page.screenshot({ path: path.join(screenshotDir, '2_restaurants_page.png') });

    // 1. Verify restaurant name rendering in listing card
    const cardTitle = firstCard.locator('h3, .text-xl, .font-bold').first();
    await expect(cardTitle).toBeVisible();
    const restaurantNameText = await cardTitle.innerText();
    console.log(`First restaurant in listing: "${restaurantNameText}"`);
    expect(restaurantNameText.length).toBeGreaterThan(0);

    // 2. Click the restaurant card to navigate to its details page
    await firstCard.click();
    await page.waitForURL(/\/restaurant\/[a-f0-9]+/, { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for menu to load fully
    console.log(`Navigated to detail page: ${page.url()}`);

    // Capture screenshot of restaurant detail page
    await page.screenshot({ path: path.join(screenshotDir, '3_restaurant_detail_page.png') });

    // 3. Verify restaurant name is rendered on details page
    const detailHeaderName = page.locator('h1').first();
    await expect(detailHeaderName).toBeVisible();
    const detailNameText = await detailHeaderName.innerText();
    console.log(`Restaurant header title: "${detailNameText}"`);
    expect(detailNameText).toBe(restaurantNameText);

    // 4. Verify location/city is rendered on the details page
    const locationInfo = page.locator('p:has-text("Raipur"), p:has-text("Pune"), p:has-text("Mumbai"), p:has-text("Bangalore"), p:has-text("Hyderabad"), .text-gray-500, .text-sm');
    const countLocs = await locationInfo.count();
    let locationText = '';
    for (let i = 0; i < countLocs; i++) {
      const text = await locationInfo.nth(i).innerText();
      if (text.toLowerCase().includes('raipur') || text.toLowerCase().includes('pune') || text.toLowerCase().includes('mumbai') || text.toLowerCase().includes('bangalore') || text.toLowerCase().includes('hyderabad')) {
        locationText = text;
        break;
      }
    }
    console.log(`Location text found on details page: "${locationText}"`);
    expect(locationText.length).toBeGreaterThan(0);
    expect(locationText).not.toContain('undefined');

    // 5. Verify food item names and food images render correctly
    const foodItemNames = page.locator('h3, .font-semibold, .text-lg');
    const foodNamesCount = await foodItemNames.count();
    console.log(`Total food names element count in menu: ${foodNamesCount}`);
    expect(foodNamesCount).toBeGreaterThanOrEqual(1);

    const foodImages = page.locator('img');
    const imagesCount = await foodImages.count();
    console.log(`Total images count on details page: ${imagesCount}`);

    const imageUrls: string[] = [];
    for (let i = 0; i < imagesCount; i++) {
      const src = await foodImages.nth(i).getAttribute('src');
      if (src) {
        imageUrls.push(src);
      }
    }

    const avifImages = imageUrls.filter(url => url.includes('.avif') && url.includes('/images/'));
    console.log('AVIF Images found on details page:', avifImages);
    expect(avifImages.length).toBeGreaterThanOrEqual(1);

    // 6. Test Zoom/Bigger Image Modal on Click
    const firstFoodImage = page.locator('.relative.h-48.cursor-pointer img').first();
    const originalSrc = await firstFoodImage.getAttribute('src');
    
    console.log('Clicking food image to zoom:', originalSrc);
    await firstFoodImage.click();

    // Verify modal overlay is visible
    const zoomModal = page.locator('div.fixed.inset-0.bg-black\\/85');
    await expect(zoomModal).toBeVisible();
    await page.waitForTimeout(1000); // wait for modal fade-in

    // Capture screenshot of zoomed image modal
    await page.screenshot({ path: path.join(screenshotDir, '4_zoomed_image_modal.png') });

    // Verify image in modal matches original source
    const zoomedImage = zoomModal.locator('img');
    await expect(zoomedImage).toBeVisible();
    const zoomedSrc = await zoomedImage.getAttribute('src');
    expect(zoomedSrc).toBe(originalSrc);
    console.log('Zoomed image matches original source:', zoomedSrc);

    // Close the modal by clicking the close button
    const closeButton = zoomModal.locator('button');
    await closeButton.click();

    // Verify modal is closed
    await expect(zoomModal).toBeHidden();
  });
});
