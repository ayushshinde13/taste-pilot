import { Router } from 'express';
import {
  previewCart,
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  placeOrderValidation,
  cartPreviewValidation,
  orderIdValidation,
  cancelOrderValidation,
  orderQueryValidation,
} from '../validations/orderValidation.js';

const router = Router();

router.use(protect);

router.post('/preview', cartPreviewValidation, validate, previewCart);
router.post('/', placeOrderValidation, validate, placeOrder);
router.get('/my', orderQueryValidation, validate, getMyOrders);
router.get('/:id', orderIdValidation, validate, getOrderById);
router.put('/:id/cancel', cancelOrderValidation, validate, cancelOrder);

export default router;
