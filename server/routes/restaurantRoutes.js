import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
} from '../controllers/restaurantController.js';
import validate from '../middleware/validateMiddleware.js';
import {
  restaurantIdValidation,
  restaurantQueryValidation,
} from '../validations/restaurantValidation.js';

const router = Router();

router.get('/', restaurantQueryValidation, validate, getRestaurants);
router.get('/:id', restaurantIdValidation, validate, getRestaurantById);
router.get('/:id/menu', restaurantIdValidation, validate, getRestaurantMenu);

export default router;
