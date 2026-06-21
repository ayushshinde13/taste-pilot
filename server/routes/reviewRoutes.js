import { Router } from 'express';
import { addReview, getReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  createReviewValidation,
  getReviewsValidation,
} from '../validations/reviewValidation.js';

const router = Router();

router.get('/:restaurantId', getReviewsValidation, validate, getReviews);
router.post(
  '/:restaurantId',
  protect,
  createReviewValidation,
  validate,
  addReview
);

export default router;
