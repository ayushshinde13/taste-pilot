import { body } from 'express-validator';

export const conciergeValidation = [
  body('budget')
    .isFloat({ min: 1 })
    .withMessage('Budget must be a positive number'),
  body('dietaryPreference')
    .notEmpty()
    .withMessage('Dietary preference is required')
    .isIn(['veg', 'non-veg', 'vegan', 'any'])
    .withMessage('Dietary preference must be veg, non-veg, vegan, or any'),
  body('cuisinePreference')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Cuisine preference cannot exceed 200 characters'),
];

export const mealPlannerValidation = [
  body('occasion')
    .trim()
    .notEmpty()
    .withMessage('Occasion is required')
    .isLength({ max: 200 })
    .withMessage('Occasion cannot exceed 200 characters'),
  body('budget')
    .isFloat({ min: 1 })
    .withMessage('Budget must be a positive number'),
  body('dietaryPreference')
    .notEmpty()
    .withMessage('Dietary preference is required')
    .isIn(['veg', 'non-veg', 'vegan', 'any'])
    .withMessage('Dietary preference must be veg, non-veg, vegan, or any'),
];
