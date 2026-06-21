import { body, param, query } from 'express-validator';

export const createReviewValidation = [
  param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
];

export const getReviewsValidation = [
  param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];
