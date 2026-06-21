import { query, body, param } from 'express-validator';

export const getTrendingFoodsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
    .toInt(),
];

export const createTrendingFoodValidation = [
  body('menuItemId')
    .isMongoId()
    .withMessage('Valid menu item ID is required'),
  body('restaurantId')
    .optional()
    .isMongoId()
    .withMessage('Valid restaurant ID must be provided'),
  body('orderCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order count must be a non-negative integer'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('popularityScore')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Popularity score must be between 0 and 100'),
];

export const updateTrendingFoodValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid trending food ID'),
  body('orderCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order count must be a non-negative integer'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('popularityScore')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Popularity score must be between 0 and 100'),
];

export const trendingFoodIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid trending food ID'),
];