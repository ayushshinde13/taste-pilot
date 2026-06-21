import { body, param, query } from 'express-validator';

export const placeOrderValidation = [
  body('restaurantId').isMongoId().withMessage('Valid restaurant ID is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItemId')
    .isMongoId()
    .withMessage('Each item must have a valid menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Delivery street is required'),
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Delivery city is required'),
  body('deliveryAddress.state')
    .trim()
    .notEmpty()
    .withMessage('Delivery state is required'),
  body('deliveryAddress.pincode')
    .trim()
    .notEmpty()
    .withMessage('Delivery pincode is required'),
];

export const cartPreviewValidation = [
  body('restaurantId').isMongoId().withMessage('Valid restaurant ID is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Cart must contain at least one item'),
  body('items.*.menuItemId')
    .isMongoId()
    .withMessage('Each item must have a valid menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

export const orderIdValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
];

export const cancelOrderValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason cannot exceed 200 characters'),
];

export const updateOrderStatusValidation = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status'),
];

export const orderQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'])
    .withMessage('Invalid status filter'),
];
