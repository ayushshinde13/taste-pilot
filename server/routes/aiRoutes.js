import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { mealPlanner } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  mealPlannerValidation,
} from '../validations/aiValidation.js';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many AI requests. Please try again in a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(protect, aiLimiter);

router.post('/meal-planner', mealPlannerValidation, validate, mealPlanner);

export default router;
