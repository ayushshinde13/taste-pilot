import express from 'express';
import { getAllCategories } from '../controllers/categoryController.js';
import validate from '../middleware/validateMiddleware.js';
import { getAllCategoriesValidation } from '../validations/categoryValidation.js';

const router = express.Router();

router.route('/').get(getAllCategoriesValidation, validate, getAllCategories);

export default router;