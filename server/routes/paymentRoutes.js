import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  createPaymentOrderValidation,
  verifyPaymentValidation,
} from '../validations/paymentValidation.js';

const router = Router();

router.use(protect);

router.post('/create-order', createPaymentOrderValidation, validate, createPaymentOrder);
router.post('/verify', verifyPaymentValidation, validate, verifyPayment);

export default router;
