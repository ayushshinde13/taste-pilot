import asyncHandler from '../utils/asyncHandler.js';
import { getAnalytics } from '../services/analyticsService.js';
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from './restaurantController.js';
import { addMenuItem, updateMenuItem, deleteMenuItem } from './menuController.js';
import { getAllOrders, updateOrderStatus } from './orderController.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import TrendingFood from '../models/TrendingFood.js';
import MenuItem from '../models/MenuItem.js';

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getAnalytics();

  res.json({
    success: true,
    data: analytics,
  });
});

// Category Management
export const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const categories = await Category.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Category.countDocuments();

  res.json({
    success: true,
    count: categories.length,
    data: categories,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existingCategory) {
    return res.status(400).json({
      success: false,
      message: 'Category with this name already exists',
    });
  }

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const categoryData = {
    name,
    slug,
    description: description || '',
    icon: icon || 'utensils',
  };

  // Handle image if provided
  if (req.file) {
    categoryData.image = `/uploads/categories/${req.file.filename}`;
  }

  const category = await Category.create(categoryData);

  res.status(201).json({
    success: true,
    data: category,
    message: 'Category created successfully',
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, icon } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  const updateData = {};
  if (name) {
    // Check if name is being changed and if new name already exists
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') }, 
        _id: { $ne: id } 
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
      // Generate new slug
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }
    updateData.name = name;
  }
  if (description !== undefined) updateData.description = description;
  if (icon !== undefined) updateData.icon = icon;

  // Handle image if provided
  if (req.file) {
    updateData.image = `/uploads/categories/${req.file.filename}`;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedCategory,
    message: 'Category updated successfully',
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      success: true,
      message: 'Category not found',
    });
  }

  await Category.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

// Coupon Management
export const getAllCouponsAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, activeOnly } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (activeOnly === 'true') {
    filter.active = true;
  }

  const coupons = await Coupon.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Coupon.countDocuments(filter);

  res.json({
    success: true,
    count: coupons.length,
    data: coupons,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderValue,
    maximumDiscount,
    expiryDate,
    usageLimit,
    active
  } = req.body;

  // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    return res.status(400).json({
      success: false,
      message: 'Coupon with this code already exists',
    });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    minimumOrderValue,
    maximumDiscount,
    expiryDate,
    usageLimit,
    active,
  });

  res.status(201).json({
    success: true,
    data: coupon,
    message: 'Coupon created successfully',
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderValue,
    maximumDiscount,
    expiryDate,
    usageLimit,
    active
  } = req.body;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Coupon not found',
    });
  }

  const updateData = {};
  if (code) {
    // Check if code is being changed and if new code already exists
    if (code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: code.toUpperCase(), 
        _id: { $ne: id } 
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon with this code already exists',
        });
      }
    }
    updateData.code = code.toUpperCase();
  }
  if (description !== undefined) updateData.description = description;
  if (discountType !== undefined) updateData.discountType = discountType;
  if (discountValue !== undefined) updateData.discountValue = discountValue;
  if (minimumOrderValue !== undefined) updateData.minimumOrderValue = minimumOrderValue;
  if (maximumDiscount !== undefined) updateData.maximumDiscount = maximumDiscount;
  if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
  if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
  if (active !== undefined) updateData.active = active;

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedCoupon,
    message: 'Coupon updated successfully',
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Coupon not found',
    });
  }

  await Coupon.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Coupon deleted successfully',
  });
});

// Trending Food Management
export const getAllTrendingFoodsAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const trendingFoods = await TrendingFood.find({})
    .populate('menuItemId', 'name price image restaurant')
    .populate('restaurantId', 'name')
    .sort({ popularityScore: -1, orderCount: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await TrendingFood.countDocuments();

  res.json({
    success: true,
    count: trendingFoods.length,
    data: trendingFoods,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

export const createTrendingFood = asyncHandler(async (req, res) => {
  const { menuItemId, restaurantId, orderCount, rating, popularityScore } = req.body;

  // Check if menu item exists
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found',
    });
  }

  const trendingFood = await TrendingFood.create({
    menuItemId,
    restaurantId,
    orderCount: orderCount || 0,
    rating: rating || 0,
    popularityScore: popularityScore || 0,
  });

  res.status(201).json({
    success: true,
    data: trendingFood,
    message: 'Trending food added successfully',
  });
});

export const updateTrendingFood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderCount, rating, popularityScore } = req.body;

  const trendingFood = await TrendingFood.findById(id);
  if (!trendingFood) {
    return res.status(404).json({
      success: false,
      message: 'Trending food not found',
    });
  }

  const updateData = {};
  if (orderCount !== undefined) updateData.orderCount = orderCount;
  if (rating !== undefined) updateData.rating = rating;
  if (popularityScore !== undefined) updateData.popularityScore = popularityScore;

  const updatedTrendingFood = await TrendingFood.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedTrendingFood,
    message: 'Trending food updated successfully',
  });
});

export const deleteTrendingFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trendingFood = await TrendingFood.findById(id);
  if (!trendingFood) {
    return res.status(404).json({
      success: false,
      message: 'Trending food not found',
    });
  }

  await TrendingFood.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Trending food removed successfully',
  });
});

// Default export with all functions
const adminController = {
  getDashboardAnalytics,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllOrders,
  updateOrderStatus,
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
};

export default adminController;