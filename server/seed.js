import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

const collections = {
  users: 'users',
  restaurants: 'restaurants',
  menuItems: 'menuitems',
  reviews: 'reviews',
  coupons: 'coupons',
  categories: 'categories',
  trendingFoods: 'trendingfoods',
};

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
}

function toObjectId(value) {
  return new mongoose.Types.ObjectId(value);
}

function convertIds(document) {
  const converted = { ...document };

  if (converted._id) converted._id = toObjectId(converted._id);
  if (converted.restaurant) converted.restaurant = toObjectId(converted.restaurant);
  if (converted.restaurantId) converted.restaurantId = toObjectId(converted.restaurantId);
  if (converted.menuItemId) converted.menuItemId = toObjectId(converted.menuItemId);
  if (converted.user) converted.user = toObjectId(converted.user);

  for (const key of ['createdAt', 'updatedAt', 'expiryDate']) {
    if (converted[key]) converted[key] = new Date(converted[key]);
  }

  return converted;
}

function usersFromReviews(reviews) {
  const users = new Map();
  const seedPasswordHash = bcrypt.hashSync('TastePilot@123', 12);

  for (const review of reviews) {
    if (users.has(review.user)) continue;

    const slug = review.userName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
    users.set(review.user, {
      _id: toObjectId(review.user),
      name: review.userName,
      email: `${slug}.${review.user.slice(-6)}@tastepilot.local`,
      password: seedPasswordHash,
      role: 'user',
      addresses: [
        {
          label: 'Home',
          street: 'Seeded customer address',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          isDefault: true,
        },
      ],
      createdAt: new Date(review.createdAt),
      updatedAt: new Date(review.updatedAt),
    });
  }

  return [...users.values()];
}

async function clearCollections(db) {
  for (const collectionName of Object.values(collections)) {
    await db.collection(collectionName).deleteMany({});
  }
}

async function dropTextIndexes(db, collectionName) {
  const collection = db.collection(collectionName);
  const indexes = await collection.indexes();
  const textIndexes = indexes.filter((index) => Object.values(index.key).includes('text'));

  for (const index of textIndexes) {
    await collection.dropIndex(index.name);
  }
}

async function seed() {
  // Use local MongoDB as fallback
  const mongoUri = process.env.LOCAL_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taste-pilot';
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
  } catch (connectionError) {
    console.error('Primary connection failed, attempting local connection...');
    try {
      const localUri = 'mongodb://127.0.0.1:27017/taste-pilot';
      await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      console.log('Connected to local MongoDB for seeding');
    } catch (localError) {
      console.error('Local connection also failed:', localError.message);
      throw localError;
    }
  }

  const db = mongoose.connection.db;
  const restaurants = readJson('restaurants.json').map(convertIds);
  const menuItems = readJson('menu-items.json').map(convertIds);
  const reviews = readJson('reviews.json').map(convertIds);
  const coupons = readJson('coupons.json').map(convertIds);
  const categories = readJson('categories.json').map(convertIds);
  const trendingFoods = readJson('trending-foods.json').map(convertIds);
  const users = usersFromReviews(readJson('reviews.json'));

  await clearCollections(db);

  await db.collection(collections.users).insertMany(users, { ordered: false });
  await db.collection(collections.restaurants).insertMany(restaurants, { ordered: false });
  await db.collection(collections.menuItems).insertMany(menuItems, { ordered: false });
  await db.collection(collections.reviews).insertMany(reviews, { ordered: false });
  await db.collection(collections.coupons).insertMany(coupons, { ordered: false });
  await db.collection(collections.categories).insertMany(categories, { ordered: false });
  await db.collection(collections.trendingFoods).insertMany(trendingFoods, { ordered: false });

  await dropTextIndexes(db, collections.restaurants);
  await dropTextIndexes(db, collections.menuItems);

  await db.collection(collections.restaurants).createIndex({ name: 'text', cuisine: 'text', tags: 'text' });
  await db.collection(collections.restaurants).createIndex({ cuisine: 1, rating: -1 });
  await db.collection(collections.restaurants).createIndex({ slug: 1 }, { unique: true });
  await db.collection(collections.menuItems).createIndex({ restaurant: 1, category: 1 });
  await db.collection(collections.menuItems).createIndex({ name: 'text', category: 'text', ingredients: 'text' });
  await db.collection(collections.menuItems).createIndex({ popularityScore: -1, orderCount: -1 });
  await db.collection(collections.reviews).createIndex({ restaurant: 1, createdAt: -1 });
  await db.collection(collections.categories).createIndex({ slug: 1 }, { unique: true });
  await db.collection(collections.coupons).createIndex({ code: 1 }, { unique: true });
  await db.collection(collections.trendingFoods).createIndex({ rank: 1 });

  console.log('Taste Pilot seed complete');
  console.log(`Users: ${users.length}`);
  console.log(`Restaurants: ${restaurants.length}`);
  console.log(`Menu items: ${menuItems.length}`);
  console.log(`Reviews: ${reviews.length}`);
  console.log(`Coupons: ${coupons.length}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Trending foods: ${trendingFoods.length}`);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});