import asyncHandler from '../utils/asyncHandler.js';
import Review from '../models/Review.js';
import { createReview } from '../services/reviewService.js';

export const addReview = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { rating, comment } = req.body;

  const { review, ratingStats } = await createReview({
    userId: req.user._id,
    restaurantId,
    rating,
    comment,
  });

  const populatedReview = await Review.findById(review._id).populate(
    'user',
    'name email'
  );

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: {
      review: populatedReview,
      restaurantRating: ratingStats,
    },
  });
});

export const getReviews = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ restaurant: restaurantId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email'),
    Review.countDocuments({ restaurant: restaurantId }),
  ]);

  res.json({
    success: true,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export default { addReview, getReviews };
