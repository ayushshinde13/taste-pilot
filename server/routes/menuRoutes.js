import { Router } from 'express';
import {
  getMenuByRestaurant,
  getTrendingItems,
  searchMenuItems,
} from '../controllers/menuController.js';
import validate from '../middleware/validateMiddleware.js';
import { menuQueryValidation } from '../validations/menuValidation.js';

const router = Router();

router.get('/trending', getTrendingItems);
router.get(
  '/restaurant/:restaurantId',
  menuQueryValidation,
  validate,
  getMenuByRestaurant
);
router.get('/', menuQueryValidation, validate, searchMenuItems);

export default router;