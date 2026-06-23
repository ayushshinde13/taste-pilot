import { test, expect } from '@playwright/test';

test.describe('Taste Pilot - Full User Journey E2E Test', () => {
  const testEmail = `journeyuser-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Journey User';

  test('Complete user flow: Home -> Register -> Login -> Browse -> Add to Cart -> Checkout -> Order Detail', async ({ page }) => {
    // 1. Setup Dialog handler to automatically accept any alerts (e.g. order placed success)
    page.on('dialog', async dialog => {
      console.log('Dialog popped up:', dialog.message());
      await dialog.accept();
    });

    // 2. Navigate to Home Page
    await page.goto('/');
    await expect(page).toHaveTitle(/Taste Pilot/i);
    console.log('Navigated to Home page.');

    // 3. Click Primary CTA "Explore Restaurants"
    const exploreBtn = page.locator('button:has-text("Explore Restaurants"), a:has-text("Explore Restaurants")').first();
    await exploreBtn.click();

    // 4. Verify auto-redirection to Register page (for unauthenticated users)
    await page.waitForURL(/\/auth\/register/, { timeout: 10000 });
    console.log('Successfully redirected to Register page.');

    // 5. Fill out the registration form
    await page.waitForTimeout(1000); // Wait for hydration
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

    // 6. Verify redirect to login page
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await page.waitForTimeout(1000);
    console.log('Registered successfully. Redirected to Login.');

    // 7. Log in with the new credentials
    await page.click('input[id="email"]');
    await page.fill('input[id="email"]', testEmail);
    
    await page.click('input[id="password"]');
    await page.fill('input[id="password"]', testPassword);
    
    await page.click('button[type="submit"]');

    // 8. Verify redirect to restaurants page
    await page.waitForURL(/\/restaurants/, { timeout: 10000 });
    console.log('Logged in successfully. Redirected to Restaurants list.');

    // 9. Wait for restaurant cards to load, filter by Pizza
    const restaurantCard = page.locator('a[href^="/restaurant/"]').first();
    await restaurantCard.waitFor({ state: 'visible', timeout: 15000 });

    const searchInput = page.locator('input[placeholder="Search by name or cuisine..."]');
    await searchInput.fill('Pizza');
    await page.waitForTimeout(1000);

    // 10. Click on the first restaurant (a Pizza serving one)
    await restaurantCard.click();
    await page.waitForURL(/\/restaurant\/[a-f0-9]+/, { timeout: 10000 });
    console.log('Entered restaurant detail page:', page.url());

    // 11. Add a menu item to the cart
    const addBtn = page.locator('button:has-text("Add to Cart")').first();
    await addBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addBtn.click();

    // Click the "Add" button to confirm adding it
    const confirmAddBtn = page.locator('button:has-text("Add")').first();
    await confirmAddBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmAddBtn.click();
    console.log('Added a menu item to the cart.');

    // 12. Click view/checkout cart button in sticky cart or header
    // The sticky cart has a "Checkout" button, or we can go to /cart directly
    await page.goto('/cart');
    await page.waitForURL(/\/cart/);
    console.log('Navigated to Shopping Cart page.');

    // 13. Fill in Delivery Address Details
    await page.fill('input[id="street"]', 'Flat 302, Gachibowli Heights');
    await page.fill('input[id="pincode"]', '500032');
    console.log('Filled checkout delivery address details.');

    // 14. Place the order
    const placeOrderBtn = page.locator('button:has-text("Place Order")');
    await placeOrderBtn.click();

    // 15. Verify redirect to order tracking page
    await page.waitForURL(/\/orders\/[a-f0-9]+/, { timeout: 15000 });
    console.log('Order placed successfully! Landed on order tracking page:', page.url());

    // Verify order details page is loaded
    await expect(page.locator('text=ORDER ID:').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Delivery Progress")')).toBeVisible();
    console.log('Full user journey test completed successfully!');
  });
});
