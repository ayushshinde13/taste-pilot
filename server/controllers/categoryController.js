import asyncHandler from '../utils/asyncHandler.js';
import Category from '../models/Category.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });

  res.json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

export default { getAllCategories };