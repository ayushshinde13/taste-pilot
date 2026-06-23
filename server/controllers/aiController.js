import asyncHandler from '../utils/asyncHandler.js';
import { getMealPlan } from '../services/geminiService.js';

export const mealPlanner = asyncHandler(async (req, res) => {
  const { occasion, budget, dietaryPreference } = req.body;

  const defaultAddress = req.user?.addresses?.find((a) => a.isDefault);
  const userLocation = defaultAddress
    ? {
        lat: defaultAddress.latitude,
        lng: defaultAddress.longitude,
        city: defaultAddress.city,
      }
    : null;

  const result = await getMealPlan({
    occasion,
    budget,
    dietaryPreference,
    userLocation,
  });

  res.json({
    success: true,
    data: result,
  });
});

export default { mealPlanner };
