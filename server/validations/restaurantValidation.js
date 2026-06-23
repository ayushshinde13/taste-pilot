import { body, param, query } from 'express-validator';

export const createRestaurantValidation = [
  body('name').trim().notEmpty().withMessage('Restaurant name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('cuisine')
    .isArray({ min: 1 })
    .withMessage('At least one cuisine is required'),
  body('address.street').trim().notEmpty().withMessage('Street is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('isVeg').optional().isBoolean().withMessage('isVeg must be a boolean'),
];

export const updateRestaurantValidation = [
  param('id').isMongoId().withMessage('Invalid restaurant ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('cuisine')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one cuisine is required'),
  body('isVeg').optional().isBoolean().withMessage('isVeg must be a boolean'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const restaurantIdValidation = [
  param('id').isMongoId().withMessage('Invalid restaurant ID'),
];

export const restaurantQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 150 }).withMessage('Limit must be between 1 and 150'),
  query('search').optional().trim(),
  query('cuisine').optional().trim(),
  query('isVeg').optional().isIn(['true', 'false']).withMessage('isVeg must be true or false'),
  query('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('city').optional().trim(),
  query('locality').optional().trim(),
  query('pincode').optional().trim(),
];
