import { GoogleGenerativeAI } from '@google/generative-ai';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import ApiError from '../utils/ApiError.js';

const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new ApiError(500, 'Gemini API key is not configured');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const buildMenuContext = async (dietaryPreference) => {
  const restaurantFilter = { isActive: true };
  const menuFilter = { isAvailable: true };

  if (dietaryPreference === 'veg') {
    menuFilter.isVeg = true;
  } else if (dietaryPreference === 'non-veg') {
    menuFilter.isVeg = false;
  }

  const restaurants = await Restaurant.find(restaurantFilter)
    .select('name cuisine rating address.city deliveryTime deliveryFee isPureVeg isOpen featured trending tags')
    .limit(20)
    .lean();

  const restaurantIds = restaurants.map((r) => r._id);
  const menuItems = await MenuItem.find({
    ...menuFilter,
    restaurant: { $in: restaurantIds },
  })
    .select('name price category isVeg isTrending restaurant spicyLevel dietaryType mealType proteinLevel healthScore cuisineType calories ingredients popularityScore preparationTime')
    .populate('restaurant', 'name cuisine isPureVeg')
    .limit(100)
    .lean();

  const context = menuItems.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    price: item.price,
    category: item.category,
    isVeg: item.isVeg,
    isTrending: item.isTrending,
    restaurant: item.restaurant?.name,
    cuisine: item.restaurant?.cuisine,
    spicyLevel: item.spicyLevel,
    dietaryType: item.dietaryType,
    mealType: item.mealType,
    proteinLevel: item.proteinLevel,
    healthScore: item.healthScore,
    cuisineType: item.cuisineType,
    calories: item.calories,
    ingredients: item.ingredients,
    popularityScore: item.popularityScore,
    preparationTime: item.preparationTime,
  }));

  return { restaurants, menuItems: context };
};

const parseGeminiJson = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new ApiError(500, 'Failed to parse AI response');
  }
  return JSON.parse(jsonMatch[0]);
};

export const getFoodConcierge = async ({
  budget,
  dietaryPreference,
  cuisinePreference,
}) => {
  const { menuItems } = await buildMenuContext(dietaryPreference);

  if (menuItems.length === 0) {
    throw new ApiError(404, 'No menu items available for your preferences');
  }

  const filteredItems = cuisinePreference
    ? menuItems.filter((item) =>
        item.cuisine?.some((c) =>
          c.toLowerCase().includes(cuisinePreference.toLowerCase())
        ) ||
        item.cuisineType?.toLowerCase().includes(cuisinePreference.toLowerCase())
      )
    : menuItems;

  const itemsForPrompt = (filteredItems.length > 0 ? filteredItems : menuItems).slice(
    0,
    50
  );

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a food concierge for Taste Pilot, a food delivery app in India.

User preferences:
- Budget: ₹${budget}
- Dietary preference: ${dietaryPreference}
- Cuisine preference: ${cuisinePreference || 'any'}

Available menu items (JSON):
${JSON.stringify(itemsForPrompt, null, 2)}

Recommend 3-5 dishes that best match the user's budget and preferences. Consider factors like spicy level, protein level, health score, and cuisine type. Stay within budget for a single meal unless the user budget allows a combo.

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief friendly recommendation summary",
  "suggestions": [
    {
      "menuItemId": "id from the list",
      "name": "dish name",
      "restaurant": "restaurant name",
      "price": 0,
      "spicyLevel": 0,
      "proteinLevel": "level",
      "healthScore": 0,
      "cuisineType": "cuisine type",
      "calories": 0,
      "reason": "why this dish fits"
    }
  ],
  "totalEstimatedCost": 0
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const parsed = parseGeminiJson(response);

  return {
    ...parsed,
    preferences: { budget, dietaryPreference, cuisinePreference },
  };
};

export const getMealPlan = async ({ occasion, budget, dietaryPreference }) => {
  const { menuItems } = await buildMenuContext(dietaryPreference);

  if (menuItems.length === 0) {
    throw new ApiError(404, 'No menu items available for your preferences');
  }

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a meal planner for Taste Pilot, a food delivery app in India.

User request:
- Occasion: ${occasion}
- Budget: ₹${budget}
- Dietary preference: ${dietaryPreference}

Available menu items (JSON):
${JSON.stringify(menuItems.slice(0, 60), null, 2)}

Create a complete meal plan (starter/appetizer + main course + dessert/drink if budget allows). Consider spicy levels, protein content, health scores, and meal types for balanced nutrition. Total cost must not exceed ₹${budget}.

Respond ONLY with valid JSON in this exact format:
{
  "occasion": "${occasion}",
  "summary": "Brief description of the meal plan",
  "mealPlan": {
    "starter": { "menuItemId": "id", "name": "", "restaurant": "", "price": 0, "spicyLevel": 0, "proteinLevel": "", "healthScore": 0, "reason": "" },
    "main": { "menuItemId": "id", "name": "", "restaurant": "", "price": 0, "spicyLevel": 0, "proteinLevel": "", "healthScore": 0, "reason": "" },
    "dessert": { "menuItemId": "id or null", "name": "", "restaurant": "", "price": 0, "spicyLevel": 0, "proteinLevel": "", "healthScore": 0, "reason": "" }
  },
  "totalCost": 0,
  "withinBudget": true
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const parsed = parseGeminiJson(response);

  return {
    ...parsed,
    preferences: { occasion, budget, dietaryPreference },
  };
};

export default { getFoodConcierge, getMealPlan };