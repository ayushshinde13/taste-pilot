import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Wishlist from '../models/Wishlist.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Toggle restaurant in user wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { restaurantId } = req.body;

  if (!restaurantId) {
    throw new ApiError(400, 'Restaurant ID is required');
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      restaurants: [restaurantId],
    });
  } else {
    const isWishlisted = wishlist.restaurants.includes(restaurantId);

    if (isWishlisted) {
      wishlist.restaurants = wishlist.restaurants.filter(
        (id) => id.toString() !== restaurantId
      );
    } else {
      wishlist.restaurants.push(restaurantId);
    }
    await wishlist.save();
  }

  res.json({
    success: true,
    message: 'Wishlist updated successfully',
    data: wishlist.restaurants,
  });
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'restaurants',
    'name image rating cuisine priceForOne deliveryTime isVeg'
  );

  res.json({
    success: true,
    data: wishlist ? wishlist.restaurants : [],
  });
});

export default { toggleWishlist, getWishlist };
