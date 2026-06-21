import express from 'express';
import { getTrendingFoods } from '../controllers/trendingFoodController.js';
import validate from '../middleware/validateMiddleware.js';
import { getTrendingFoodsValidation } from '../validations/trendingFoodValidation.js';

const router = express.Router();

router.route('/').get(getTrendingFoodsValidation, validate, getTrendingFoods);

export default router;