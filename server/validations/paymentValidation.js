import { body } from 'express-validator';

export const createPaymentOrderValidation = [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
];

export const verifyPaymentValidation = [
  body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required'),
];
