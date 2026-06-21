import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import ApiError from '../utils/ApiError.js';

export const updateRestaurantRating = async (restaurantId) => {
  const stats = await Review.aggregate([
    { $match: { restaurant: restaurantId } },
    {
      $group: {
        _id: '$restaurant',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length === 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: 0,
      reviewCount: 0,
    });
    return { rating: 0, reviewCount: 0 };
  }

  const avgRating = Math.round(stats[0].avgRating * 10) / 10;
  const reviewCount = stats[0].reviewCount;

  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: avgRating,
    reviewCount,
  });

  return { rating: avgRating, reviewCount };
};

export const createReview = async ({ userId, restaurantId, rating, comment }) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, 'Restaurant not found');
  }

  const existingReview = await Review.findOne({
    user: userId,
    restaurant: restaurantId,
  });

  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this restaurant');
  }

  const review = await Review.create({
    user: userId,
    restaurant: restaurantId,
    rating,
    comment: comment || '',
  });

  const ratingStats = await updateRestaurantRating(restaurantId);

  return { review, ratingStats };
};

export default { updateRestaurantRating, createReview };
