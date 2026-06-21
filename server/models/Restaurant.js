import mongoose from 'mongoose';

const openingHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    open: { type: String, required: true },
    close: { type: String, required: true },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    cuisine: {
      type: [String],
      required: [true, 'At least one cuisine is required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one cuisine is required',
      },
    },
    image: {
      type: String,
      default: '/images/default-restaurant.jpg',
    },
    bannerImage: {
      type: String,
      default: '/images/default-restaurant.jpg',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    isPureVeg: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    deliveryTime: {
      type: Number,
      default: 30,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    openingHours: [openingHoursSchema],
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', cuisine: 'text' });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ featured: -1, rating: -1 });
restaurantSchema.index({ trending: -1, rating: -1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
