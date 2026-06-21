import { Router } from 'express';
import {
  getDashboardAnalytics,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCouponsAdmin,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllTrendingFoodsAdmin,
  createTrendingFood,
  updateTrendingFood,
  deleteTrendingFood,
} from '../controllers/adminController.js';
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import {
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { getAllRestaurantsAdmin } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  createRestaurantValidation,
  updateRestaurantValidation,
  restaurantIdValidation,
} from '../validations/restaurantValidation.js';
import {
  createMenuItemValidation,
  updateMenuItemValidation,
  menuItemIdValidation,
} from '../validations/menuValidation.js';
import {
  updateOrderStatusValidation,
  orderIdValidation,
  orderQueryValidation,
} from '../validations/orderValidation.js';
import {
  getAllCategoriesValidation,
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
} from '../validations/categoryValidation.js';
import {
  getAllCouponsValidation,
  validateCouponValidation,
  createCouponValidation,
  updateCouponValidation,
  couponIdValidation,
} from '../validations/couponValidation.js';
import {
  getTrendingFoodsValidation,
  createTrendingFoodValidation,
  updateTrendingFoodValidation,
  trendingFoodIdValidation,
} from '../validations/trendingFoodValidation.js';

const router = Router();

router.use(protect, admin);

router.get('/analytics', getDashboardAnalytics);

router.get('/restaurants', getAllRestaurantsAdmin);
router.post(
  '/restaurants',
  createRestaurantValidation,
  validate,
  createRestaurant
);
router.put(
  '/restaurants/:id',
  updateRestaurantValidation,
  validate,
  updateRestaurant
);
router.delete(
  '/restaurants/:id',
  restaurantIdValidation,
  validate,
  deleteRestaurant
);

router.get('/categories', getAllCategoriesValidation, validate, getAllCategoriesAdmin);
router.post('/categories', createCategoryValidation, validate, createCategory);
router.put('/categories/:id', updateCategoryValidation, validate, updateCategory);
router.delete('/categories/:id', categoryIdValidation, validate, deleteCategory);

router.get('/coupons', getAllCouponsValidation, validate, getAllCouponsAdmin);
router.post('/coupons', createCouponValidation, validate, createCoupon);
router.put('/coupons/:id', updateCouponValidation, validate, updateCoupon);
router.delete('/coupons/:id', couponIdValidation, validate, deleteCoupon);

router.get('/trending-foods', getTrendingFoodsValidation, validate, getAllTrendingFoodsAdmin);
router.post('/trending-foods', createTrendingFoodValidation, validate, createTrendingFood);
router.put('/trending-foods/:id', updateTrendingFoodValidation, validate, updateTrendingFood);
router.delete('/trending-foods/:id', trendingFoodIdValidation, validate, deleteTrendingFood);

router.post(
  '/menu',
  createMenuItemValidation,
  validate,
  addMenuItem
);
router.put(
  '/menu/:id',
  updateMenuItemValidation,
  validate,
  updateMenuItem
);
router.delete('/menu/:id', menuItemIdValidation, validate, deleteMenuItem);

router.get('/orders', orderQueryValidation, validate, getAllOrders);
router.put(
  '/orders/:id/status',
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);

export default router;