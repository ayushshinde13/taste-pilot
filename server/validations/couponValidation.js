import { body, query, param } from 'express-validator';

export const getAllCouponsValidation = [
  query('activeOnly')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('activeOnly must be either true or false'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
];

export const validateCouponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required')
    .toUpperCase()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters'),
  body('orderValue')
    .isFloat({ min: 0 })
    .withMessage('Order value must be a non-negative number'),
];

export const createCouponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('discountType')
    .isIn(['percentage', 'fixed', 'free_delivery'])
    .withMessage('Discount type must be percentage, fixed, or free_delivery'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number'),
  body('minimumOrderValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a non-negative number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a non-negative number'),
  body('expiryDate')
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO date'),
  body('usageLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Usage limit must be a non-negative integer'),
  body('active')
    .isBoolean()
    .withMessage('Active status must be a boolean'),
];

export const updateCouponValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid coupon ID'),
  body('code')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Coupon code cannot be empty')
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed', 'free_delivery'])
    .withMessage('Discount type must be percentage, fixed, or free_delivery'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number'),
  body('minimumOrderValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a non-negative number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a non-negative number'),
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO date'),
  body('usageLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Usage limit must be a non-negative integer'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean'),
];

export const couponIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid coupon ID'),
];