import mongoose from 'mongoose';

const trendingFoodSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null,
    },
    orderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rank: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

trendingFoodSchema.index({ popularityScore: -1, orderCount: -1, rating: -1 });
trendingFoodSchema.index({ rank: 1 });

const TrendingFood = mongoose.model('TrendingFood', trendingFoodSchema);

export default TrendingFood;
