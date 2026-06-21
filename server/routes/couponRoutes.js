import express from 'express';
import { getAllCoupons, validateCoupon } from '../controllers/couponController.js';
import validate from '../middleware/validateMiddleware.js';
import { getAllCouponsValidation, validateCouponValidation } from '../validations/couponValidation.js';

const router = express.Router();

router.route('/').get(getAllCouponsValidation, validate, getAllCoupons);
router.route('/validate').post(validateCouponValidation, validate, validateCoupon);

export default router;