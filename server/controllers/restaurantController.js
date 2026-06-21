import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

export const getRestaurants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  if (req.query.cuisine) {
    filter.cuisine = { $in: [req.query.cuisine] };
  }

  if (req.query.isVeg === 'true') {
    filter.isVeg = true;
  } else if (req.query.isVeg === 'false') {
    filter.isVeg = false;
  }

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter)
      .sort(req.query.search ? { score: { $meta: 'textScore' } } : { rating: -1 })
      .skip(skip)
      .limit(limit),
    Restaurant.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: restaurants,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, 'Restaurant not found');
  }

  const menuItems = await MenuItem.find({
    restaurant: restaurant._id,
    isAvailable: true,
  }).sort({ category: 1, name: 1 });

  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      restaurant,
      menu: menuItems,
      menuByCategory,
    },
  });
});

export const getRestaurantMenu = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, 'Restaurant not found');
  }

  const filter = { restaurant: restaurant._id, isAvailable: true };

  if (req.query.isVeg === 'true') filter.isVeg = true;
  if (req.query.isVeg === 'false') filter.isVeg = false;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.trending === 'true') filter.isTrending = true;

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

export const createRestaurant = asyncHandler(async (req, res) => {
  if (req.file) {
    throw new ApiError(400, 'File uploads are disabled. Provide an image URL or local image path in the image field.');
  }

  const restaurant = await Restaurant.create({
    ...req.body,
    image: req.body.image || '',
  });

  res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    data: restaurant,
  });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  if (req.file) {
    throw new ApiError(400, 'File uploads are disabled. Provide an image URL or local image path in the image field.');
  }

  Object.assign(restaurant, req.body);
  await restaurant.save();

  res.json({
    success: true,
    message: 'Restaurant updated successfully',
    data: restaurant,
  });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  restaurant.isActive = false;
  await restaurant.save();

  await MenuItem.updateMany(
    { restaurant: restaurant._id },
    { isAvailable: false }
  );

  res.json({
    success: true,
    message: 'Restaurant deleted successfully',
  });
});

export const getAllRestaurantsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.isActive === 'true') filter.isActive = true;
  if (req.query.isActive === 'false') filter.isActive = false;

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Restaurant.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: restaurants,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export default {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
};
