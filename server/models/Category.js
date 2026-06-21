import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: '/images/categories/default.jpg',
    },
    icon: {
      type: String,
      default: 'utensils',
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Only add indexes that don't conflict with unique constraints
// The unique: true already creates indexes, so we don't need to add them again

const Category = mongoose.model('Category', categorySchema);

export default Category;