import { body, param, query } from 'express-validator';

export const createMenuItemValidation = [
  body('restaurant').isMongoId().withMessage('Valid restaurant ID is required'),
  body('name').trim().notEmpty().withMessage('Menu item name is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('isVeg').optional().isBoolean().withMessage('isVeg must be a boolean'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  body('isTrending')
    .optional()
    .isBoolean()
    .withMessage('isTrending must be a boolean'),
];

export const updateMenuItemValidation = [
  param('id').isMongoId().withMessage('Invalid menu item ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('isVeg').optional().isBoolean().withMessage('isVeg must be a boolean'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  body('isTrending')
    .optional()
    .isBoolean()
    .withMessage('isTrending must be a boolean'),
];

export const menuItemIdValidation = [
  param('id').isMongoId().withMessage('Invalid menu item ID'),
];

export const menuQueryValidation = [
  param('restaurantId').optional().isMongoId().withMessage('Invalid restaurant ID'),
  query('isVeg').optional().isIn(['true', 'false']).withMessage('isVeg must be true or false'),
  query('category').optional().trim(),
  query('trending').optional().isIn(['true', 'false']).withMessage('trending must be true or false'),
  query('available').optional().isIn(['true', 'false']).withMessage('available must be true or false'),
  query('spicyLevel').optional().isInt({ min: 0, max: 5 }).withMessage('spicyLevel must be an integer between 0 and 5'),
  query('dietaryType').optional().trim().isIn(['Vegetarian', 'Non-Veg', 'Vegan', 'Eggetarian', 'Jain', 'any']).withMessage('dietaryType must be Vegetarian, Non-Veg, Vegan, Eggetarian, Jain, or any'),
  query('mealType').optional().trim(),
  query('proteinLevel').optional().trim().isIn(['Low', 'Medium', 'High']).withMessage('proteinLevel must be Low, Medium, or High'),
  query('cuisineType').optional().trim(),
  query('caloriesMin').optional().isInt({ min: 0 }).withMessage('caloriesMin must be a non-negative integer'),
  query('caloriesMax').optional().isInt({ min: 0 }).withMessage('caloriesMax must be a non-negative integer'),
  query('healthScoreMin').optional().isInt({ min: 0, max: 100 }).withMessage('healthScoreMin must be an integer between 0 and 100'),
  query('healthScoreMax').optional().isInt({ min: 0, max: 100 }).withMessage('healthScoreMax must be an integer between 0 and 100'),
  query('popularityScoreMin').optional().isInt({ min: 0, max: 100 }).withMessage('popularityScoreMin must be an integer between 0 and 100'),
  query('popularityScoreMax').optional().isInt({ min: 0, max: 100 }).withMessage('popularityScoreMax must be an integer between 0 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be an integer between 1 and 100'),
  query('q').optional().trim().isLength({ max: 100 }).withMessage('search query cannot exceed 100 characters'),
];