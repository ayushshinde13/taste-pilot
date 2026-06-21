import asyncHandler from '../utils/asyncHandler.js';
import { getFoodConcierge, getMealPlan } from '../services/geminiService.js';

export const foodConcierge = asyncHandler(async (req, res) => {
  const { budget, dietaryPreference, cuisinePreference } = req.body;

  const result = await getFoodConcierge({
    budget,
    dietaryPreference,
    cuisinePreference,
  });

  res.json({
    success: true,
    data: result,
  });
});

export const mealPlanner = asyncHandler(async (req, res) => {
  const { occasion, budget, dietaryPreference } = req.body;

  const result = await getMealPlan({
    occasion,
    budget,
    dietaryPreference,
  });

  res.json({
    success: true,
    data: result,
  });
});

export default { foodConcierge, mealPlanner };
