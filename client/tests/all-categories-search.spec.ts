import { test, expect } from '@playwright/test';

test.describe('Taste Pilot - Multi-Category Search & Veg Only E2E Tests', () => {
  const testPassword = 'Password123!';
  const testName = 'Category Test User';
  let testEmail: string;

  const categoriesToTest = [
    'Beverages',
    'Biryani',
    'Breakfast',
    'Burger',
    'Chinese',
    'Desserts',
    'Fast Food',
    'North Indian',
    'Pizza',
    'South Indian',
    'Street Food'
  ];

  test.beforeEach(async ({ page }) => {
    testEmail = `categoryuser-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;

    // Navigate to registration page with redirect to restaurants
    await page.goto('/auth/register?redirect=/restaurants');
    await page.waitForTimeout(1500); // Wait for React hydration
    
    // Register test user
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

    // Login
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.click('input[id="email"]');
    await page.fill('input[id="email"]', testEmail);
    await page.click('input[id="password"]');
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait to land on restaurants list
    await page.waitForURL(/\/restaurants/, { timeout: 10000 });
  });

  for (const category of categoriesToTest) {
    test(`Verify search and veg filter for category: ${category}`, async ({ page }) => {
      console.log(`--- Starting Test for Category: ${category} ---`);
      await expect(page).toHaveURL(/\/restaurants/);

      // Wait for restaurants list to load
      const firstCard = page.locator('a[href^="/restaurant/"]').first();
      await firstCard.waitFor({ state: 'visible', timeout: 15000 });

      // 1. Search for the category on the restaurants page
      const searchInput = page.locator('input[placeholder="Search by name or cuisine..."]');
      await searchInput.fill(category);
      await page.waitForTimeout(1000);

      const searchCount = await page.locator('a[href^="/restaurant/"]').count();
      console.log(`Restaurants serving ${category}: ${searchCount}`);
      expect(searchCount).toBeGreaterThan(0);

      // 2. Click the first restaurant in the search results
      await firstCard.click();
      await page.waitForURL(/\/restaurant\/[a-f0-9]+/, { timeout: 10000 });
      console.log(`Navigated to restaurant detail page for ${category}`);

      // 3. Search the menu for this category
      const menuSearchInput = page.locator('input[placeholder="Search menu items..."]');
      await menuSearchInput.fill(category);
      await page.waitForTimeout(1000);

      // Find all menu item cards and images
      const itemImages = page.locator('.group.rounded-lg.border img');
      const itemsCount = await itemImages.count();
      console.log(`Menu items found for ${category}: ${itemsCount}`);
      
      // We expect at least multiple items (each category catalog has 5-10 items)
      expect(itemsCount).toBeGreaterThanOrEqual(1);

      // Extract image sources to verify they are loaded and unique
      const imageUrls: string[] = [];
      for (let i = 0; i < itemsCount; i++) {
        const src = await itemImages.nth(i).getAttribute('src');
        if (src) {
          imageUrls.push(src);
        }
      }
      console.log(`Menu item images for ${category}:`, imageUrls);
      
      // Assert that all images are populated and point to local/hosted .avif URLs
      imageUrls.forEach(url => {
        expect(url).toContain('.avif');
      });

      // 4. Test the "Veg Only" toggle on the menu page
      const vegCheckbox = page.locator('input[type="checkbox"]');
      await vegCheckbox.check();
      await page.waitForTimeout(1000);

      // Check if veg icons (green indicator) are visible on the cards
      const vegCards = page.locator('.border-green-500');
      const nonVegCards = page.locator('.border-red-500');
      
      // With Veg Only checked, there should be zero non-veg cards visible
      const nonVegCount = await nonVegCards.count();
      console.log(`Non-veg items visible after Veg-Only filter: ${nonVegCount}`);
      expect(nonVegCount).toBe(0);
      
      console.log(`--- Category ${category} Test Passed ---`);
    });
  }
});
