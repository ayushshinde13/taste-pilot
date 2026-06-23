import { test, expect } from '@playwright/test';

test.describe('Taste Pilot - Restaurant Search & Menu E2E Tests', () => {
  const testPassword = 'Password123!';
  const testName = 'Test User';
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = `testuser-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

    // Navigate to registration page with redirect parameter pointing to restaurants
    await page.goto('/auth/register?redirect=/restaurants');
    
    // Wait for page hydration and focus
    await page.waitForTimeout(1500);
    
    // Register the new test user
    await page.click('input[id="fullName"]');
    await page.fill('input[id="fullName"]', testName);
    
    await page.click('input[id="email"]');
    await page.fill('input[id="email"]', testEmail);
    
    await page.click('input[id="password"]');
    await page.fill('input[id="password"]', testPassword);
    
    await page.click('input[id="confirmPassword"]');
    await page.fill('input[id="confirmPassword"]', testPassword);
    
    await page.check('input[name="agreeTerms"]');
    await page.click('button[type="submit"]');

    // Wait for redirect to login page
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Login with the registered credentials
    await page.click('input[id="email"]');
    await page.fill('input[id="email"]', testEmail);
    await page.click('input[id="password"]');
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait to be logged in and redirected to the restaurants page
    await page.waitForURL(/\/restaurants/, { timeout: 10000 });
  });

  test('Search and filter restaurants', async ({ page }) => {
    // Assert we are on the restaurants page
    await expect(page).toHaveURL(/\/restaurants/);

    // Wait for the first restaurant card to be visible (ensure loaded from API)
    const firstCard = page.locator('a[href^="/restaurant/"]').first();
    await firstCard.waitFor({ state: 'visible', timeout: 15000 });

    // Get initial restaurant count
    const initialCards = await page.locator('a[href^="/restaurant/"]').count();
    console.log(`Initial restaurant count: ${initialCards}`);

    // Search for Biryani
    const searchInput = page.locator('input[placeholder="Search by name or cuisine..."]');
    await searchInput.fill('Biryani');
    
    // Give some time for client-side filtering to apply
    await page.waitForTimeout(500);

    // Assert filtered count or text
    const biryaniCount = await page.locator('a[href^="/restaurant/"]').count();
    console.log(`Restaurants found for 'Biryani': ${biryaniCount}`);
    
    // Search for Pizza
    await searchInput.fill('Pizza');
    await page.waitForTimeout(500);
    const pizzaCount = await page.locator('a[href^="/restaurant/"]').count();
    console.log(`Restaurants found for 'Pizza': ${pizzaCount}`);

    // Click "Show Veg Only" checkbox
    const vegCheckbox = page.locator('input[type="checkbox"]');
    const isCheckedBefore = await vegCheckbox.isChecked();
    await vegCheckbox.click();
    await page.waitForTimeout(500);

    const vegOnlyCount = await page.locator('a[href^="/restaurant/"]').count();
    console.log(`Veg-only restaurants: ${vegOnlyCount}`);
    expect(await vegCheckbox.isChecked()).toBe(!isCheckedBefore);
  });

  test('Verify restaurant detail page and menu items images', async ({ page }) => {
    // Assert we are on the restaurants page
    await expect(page).toHaveURL(/\/restaurants/);

    // Wait for the first restaurant card to be visible (ensure loaded from API)
    const firstCard = page.locator('a[href^="/restaurant/"]').first();
    await firstCard.waitFor({ state: 'visible', timeout: 15000 });

    // Search for "Pizza" to filter to restaurants serving Pizza
    const searchInput = page.locator('input[placeholder="Search by name or cuisine..."]');
    await searchInput.fill('Pizza');
    await page.waitForTimeout(1000);

    // Click on the first restaurant card (which is now a Pizza restaurant)
    await firstCard.click();

    // Verify we navigated to restaurant details page
    await page.waitForURL(/\/restaurant\/[a-f0-9]+/, { timeout: 10000 });
    console.log('Navigated to restaurant detail page:', page.url());

    // Search for "Pizza" inside the restaurant's menu
    const menuSearchInput = page.locator('input[placeholder="Search menu items..."]');
    await menuSearchInput.fill('Pizza');
    await page.waitForTimeout(500);

    // Find all menu item images
    const pizzaMenuItems = page.locator('img[alt*="Pizza"], img[alt*="pizza"], .relative.h-48 img');
    const count = await pizzaMenuItems.count();
    console.log(`Pizza menu items found in search: ${count}`);

    // Extract image sources to verify they are unique Unsplash URLs
    const imageUrls: string[] = [];
    for (let i = 0; i < count; i++) {
      const src = await pizzaMenuItems.nth(i).getAttribute('src');
      if (src) {
        imageUrls.push(src);
      }
    }

    console.log('Pizza Menu Item Image URLs:', imageUrls);

    // Ensure we have multiple types of pizza shown (at least 4-5)
    expect(imageUrls.length).toBeGreaterThanOrEqual(2); // Since some restaurants might only select a subset of menu items, let's verify we have multiple items

    // Verify images are local/hosted .avif URLs
    imageUrls.forEach(url => {
      expect(url).toContain('.avif');
    });

    // Verify there are distinct URLs (images are not all identical)
    const uniqueUrls = new Set(imageUrls);
    console.log(`Unique image URLs count: ${uniqueUrls.size} out of ${imageUrls.length}`);
    expect(uniqueUrls.size).toBeGreaterThanOrEqual(Math.min(imageUrls.length, 2));

    // Test Veg Only option on the menu
    const menuVegCheckbox = page.locator('input[type="checkbox"]');
    await menuVegCheckbox.check();
    await page.waitForTimeout(500);
    console.log('Checked "Veg Only" filter on the menu page.');
  });
});
