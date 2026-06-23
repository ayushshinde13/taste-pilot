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

const buildMenuContext = async (dietaryPreference, userLocation) => {
  const restaurantFilter = { isActive: true };
  const menuFilter = { isAvailable: true };

  if (dietaryPreference === 'veg') {
    menuFilter.isVeg = true;
  } else if (dietaryPreference === 'vegan') {
    menuFilter.dietaryType = { $in: ['Vegan'] };
  } else if (dietaryPreference === 'non-veg') {
    menuFilter.isVeg = false;
  }

  let restaurants = await Restaurant.find(restaurantFilter).lean();

  if (userLocation && userLocation.lat && userLocation.lng) {
    const getHaversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    restaurants = restaurants.filter((restaurant) => {
      if (restaurant.latitude === undefined || restaurant.longitude === undefined) {
        return false;
      }
      const dist = getHaversineDistance(
        parseFloat(userLocation.lat),
        parseFloat(userLocation.lng),
        restaurant.latitude,
        restaurant.longitude
      );
      return dist <= (restaurant.serviceRadiusKm || 5);
    });
  } else if (userLocation && userLocation.city) {
    restaurants = restaurants.filter(
      (restaurant) => restaurant.city.toLowerCase() === userLocation.city.toLowerCase()
    );
  }

  if (restaurants.length === 0) {
    restaurants = await Restaurant.find(restaurantFilter).limit(20).lean();
  } else {
    restaurants = restaurants.slice(0, 20);
  }

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
    restaurantId: item.restaurant?._id?.toString(),
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

export const getMealPlan = async ({ occasion, budget, dietaryPreference, userLocation }) => {
  const { menuItems } = await buildMenuContext(dietaryPreference, userLocation);

  if (menuItems.length === 0) {
    throw new ApiError(404, 'No menu items available for your preferences');
  }

  const genAI = getGenAI();
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
    "starter": { "menuItemId": "id", "name": "", "restaurant": "", "restaurantId": "id from list", "price": 0, "spicyLevel": 0, "proteinLevel": "", "healthScore": 0, "reason": "" },
    "main": { "menuItemId": "id", "name": "", "restaurant": "", "restaurantId": "id from list", "price": 0, "spicyLevel": 0, "proteinLevel": "", "healthScore": 0, "reason": "" },
    "dessert": { "menuItemId": "id or null", "name": "", "restaurant": "", "restaurantId": "id from list or null", "price": 0, "spicyLevel": 0, "proteinLevel": "", "healthScore": 0, "reason": "" }
  },
  "totalCost": 0,
  "withinBudget": true
}`;

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite'];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI Planner] Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const parsed = parseGeminiJson(response);
      console.log(`[AI Planner] ✅ Success with model: ${modelName}`);
      return {
        ...parsed,
        preferences: { occasion, budget, dietaryPreference },
      };
    } catch (err) {
      console.warn(`[AI Planner] ⚠️ Model ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  throw new ApiError(500, `AI Generation failed. Last error: ${lastError.message}`);
};

export default { getMealPlan };