import { Router } from 'express';
import { toggleWishlist, getWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/toggle', toggleWishlist);
router.get('/', getWishlist);

export default router;
