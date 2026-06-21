import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

export const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  const filter = { restaurant: restaurantId };

  if (req.query.isVeg === 'true') filter.isVeg = true;
  if (req.query.isVeg === 'false') filter.isVeg = false;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.trending === 'true') filter.isTrending = true;
  if (req.query.available === 'true') filter.isAvailable = true;
  if (req.query.available === 'false') filter.isAvailable = false;

  // Add filtering for new metadata fields
  if (req.query.spicyLevel) filter.spicyLevel = parseInt(req.query.spicyLevel);
  if (req.query.dietaryType) filter.dietaryType = req.query.dietaryType;
  if (req.query.mealType) filter.mealType = req.query.mealType;
  if (req.query.proteinLevel) filter.proteinLevel = req.query.proteinLevel;
  if (req.query.cuisineType) filter.cuisineType = req.query.cuisineType;
  if (req.query.caloriesMin) filter.calories = { ...filter.calories, $gte: parseInt(req.query.caloriesMin) };
  if (req.query.caloriesMax) filter.calories = { ...filter.calories, $lte: parseInt(req.query.caloriesMax) };
  if (req.query.healthScoreMin) filter.healthScore = { ...filter.healthScore, $gte: parseInt(req.query.healthScoreMin) };
  if (req.query.healthScoreMax) filter.healthScore = { ...filter.healthScore, $lte: parseInt(req.query.healthScoreMax) };
  if (req.query.popularityScoreMin) filter.popularityScore = { ...filter.popularityScore, $gte: parseInt(req.query.popularityScoreMin) };
  if (req.query.popularityScoreMax) filter.popularityScore = { ...filter.popularityScore, $lte: parseInt(req.query.popularityScoreMax) };

  const menuItems = await MenuItem.find(filter).sort({
    isTrending: -1,
    category: 1,
    name: 1,
  });

  res.json({
    success: true,
    data: menuItems,
  });
});

export const addMenuItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  if (req.file) {
    throw new ApiError(400, 'File uploads are disabled. Provide an image URL or local image path in the image field.');
  }

  const menuItem = await MenuItem.create({
    ...req.body,
    image: req.body.image || '',
  });

  res.status(201).json({
    success: true,
    message: 'Menu item added successfully',
    data: menuItem,
  });
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    throw new ApiError(404, 'Menu item not found');
  }

  if (req.file) {
    throw new ApiError(400, 'File uploads are disabled. Provide an image URL or local image path in the image field.');
  }

  Object.assign(menuItem, req.body);
  await menuItem.save();

  res.json({
    success: true,
    message: 'Menu item updated successfully',
    data: menuItem,
  });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    throw new ApiError(404, 'Menu item not found');
  }

  menuItem.isAvailable = false;
  await menuItem.save();

  res.json({
    success: true,
    message: 'Menu item deleted successfully',
  });
});

export const getTrendingItems = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const trendingItems = await MenuItem.find({
    isAvailable: true,
    $or: [{ isTrending: true }, { orderCount: { $gt: 0 } }],
  })
    .sort({ isTrending: -1, orderCount: -1 })
    .limit(limit)
    .populate('restaurant', 'name image cuisine rating');

  res.json({
    success: true,
    data: trendingItems,
  });
});

// Enhanced search function with new metadata fields
export const searchMenuItems = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    isVeg,
    spicyLevel,
    dietaryType,
    mealType,
    proteinLevel,
    cuisineType,
    caloriesMin,
    caloriesMax,
    healthScoreMin,
    healthScoreMax,
    popularityScoreMin,
    popularityScoreMax,
    page = 1,
    limit = 10
  } = req.query;

  const filter = { isAvailable: true };

  // Text search
  if (q) {
    filter.$text = { $search: q };
  }

  // Apply filters
  if (category) filter.category = category;
  if (isVeg !== undefined) filter.isVeg = isVeg === 'true';
  if (spicyLevel !== undefined) filter.spicyLevel = parseInt(spicyLevel);
  if (dietaryType) filter.dietaryType = dietaryType;
  if (mealType) filter.mealType = mealType;
  if (proteinLevel) filter.proteinLevel = proteinLevel;
  if (cuisineType) filter.cuisineType = cuisineType;

  // Range filters
  if (caloriesMin !== undefined || caloriesMax !== undefined) {
    filter.calories = {};
    if (caloriesMin !== undefined) filter.calories.$gte = parseInt(caloriesMin);
    if (caloriesMax !== undefined) filter.calories.$lte = parseInt(caloriesMax);
  }

  if (healthScoreMin !== undefined || healthScoreMax !== undefined) {
    filter.healthScore = {};
    if (healthScoreMin !== undefined) filter.healthScore.$gte = parseInt(healthScoreMin);
    if (healthScoreMax !== undefined) filter.healthScore.$lte = parseInt(healthScoreMax);
  }

  if (popularityScoreMin !== undefined || popularityScoreMax !== undefined) {
    filter.popularityScore = {};
    if (popularityScoreMin !== undefined) filter.popularityScore.$gte = parseInt(popularityScoreMin);
    if (popularityScoreMax !== undefined) filter.popularityScore.$lte = parseInt(popularityScoreMax);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const menuItems = await MenuItem.find(filter)
    .populate('restaurant', 'name image cuisine rating')
    .sort({ popularityScore: -1, orderCount: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await MenuItem.countDocuments(filter);

  res.json({
    success: true,
    count: menuItems.length,
    data: menuItems,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

export default {
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getTrendingItems,
  searchMenuItems,
};