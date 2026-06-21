import asyncHandler from '../utils/asyncHandler.js';
import TrendingFood from '../models/TrendingFood.js';
import MenuItem from '../models/MenuItem.js';

export const getTrendingFoods = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  
  // Get trending foods sorted by popularity score, order count, and rating
  const trendingFoods = await TrendingFood.find({})
    .sort({ popularityScore: -1, orderCount: -1, rating: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit));

  // Populate menu items for each trending food
  const menuItemIds = trendingFoods.map(tf => tf.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } })
    .populate('restaurant', 'name rating deliveryTime deliveryFee')
    .lean();

  // Combine trending food data with menu item details
  const trendingWithDetails = trendingFoods.map(tf => {
    const menuItem = menuItems.find(mi => mi._id.toString() === tf.menuItemId.toString());
    return {
      ...tf.toObject(),
      menuItem: menuItem || null,
    };
  });

  res.json({
    success: true,
    count: trendingWithDetails.length,
    data: trendingWithDetails,
  });
});

export default { getTrendingFoods };