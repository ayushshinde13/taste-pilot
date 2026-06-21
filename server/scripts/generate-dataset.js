import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(serverRoot, '..');
const csvPath = path.join(projectRoot, 'dataset', 'HyderabadResturants.csv');
const dataDir = path.join(serverRoot, 'data');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const food101 = [
  'pizza',
  'hamburger',
  'cheesecake',
  'ice_cream',
  'club_sandwich',
  'french_fries',
  'fried_rice',
  'ramen',
  'spaghetti_bolognese',
  'donuts',
];

const hyderabadAreas = [
  { area: 'Banjara Hills', pincode: '500034', lat: 17.4126, lng: 78.4482 },
  { area: 'Jubilee Hills', pincode: '500033', lat: 17.4326, lng: 78.4071 },
  { area: 'Gachibowli', pincode: '500032', lat: 17.4401, lng: 78.3489 },
  { area: 'Madhapur', pincode: '500081', lat: 17.4484, lng: 78.3915 },
  { area: 'Hitech City', pincode: '500081', lat: 17.4435, lng: 78.3772 },
  { area: 'Secunderabad', pincode: '500003', lat: 17.4399, lng: 78.4983 },
  { area: 'Kukatpally', pincode: '500072', lat: 17.4933, lng: 78.3995 },
  { area: 'Ameerpet', pincode: '500016', lat: 17.4375, lng: 78.4483 },
  { area: 'Kondapur', pincode: '500084', lat: 17.4647, lng: 78.3667 },
  { area: 'Charminar', pincode: '500002', lat: 17.3616, lng: 78.4747 },
  { area: 'Abids', pincode: '500001', lat: 17.3898, lng: 78.4766 },
  { area: 'Tolichowki', pincode: '500008', lat: 17.3982, lng: 78.4099 },
];

const categoryAssets = [
  ['Biryani', 'bowl-food', '/images/categories/biryani.jpg'],
  ['Pizza', 'pizza', '/images/categories/pizza.jpg'],
  ['Burger', 'burger', '/images/categories/burger.jpg'],
  ['Chinese', 'noodles', '/images/categories/chinese.jpg'],
  ['South Indian', 'dosa', '/images/categories/south-indian.jpg'],
  ['North Indian', 'curry', '/images/categories/north-indian.jpg'],
  ['Desserts', 'cake', '/images/categories/desserts.jpg'],
  ['Beverages', 'cup-soda', '/images/categories/beverages.jpg'],
  ['Sandwiches', 'sandwich', '/images/categories/sandwiches.jpg'],
  ['Fast Food', 'fries', '/images/categories/fast-food.jpg'],
];

const dishCatalog = {
  Biryani: [
    ['Hyderabadi Chicken Dum Biryani', false, ['Basmati Rice', 'Chicken', 'Saffron', 'Fried Onion', 'Biryani Masala'], 'Main Course', 279],
    ['Mutton Dum Biryani', false, ['Basmati Rice', 'Mutton', 'Mint', 'Saffron', 'Whole Spices'], 'Main Course', 349],
    ['Paneer Biryani', true, ['Basmati Rice', 'Paneer', 'Yogurt', 'Mint', 'Spices'], 'Main Course', 249],
    ['Veg Dum Biryani', true, ['Basmati Rice', 'Vegetables', 'Saffron', 'Mint', 'Cashew'], 'Main Course', 219],
    ['Egg Biryani', false, ['Basmati Rice', 'Egg', 'Fried Onion', 'Masala'], 'Main Course', 229],
    ['Chicken 65 Biryani', false, ['Rice', 'Chicken 65', 'Curry Leaves', 'Spices'], 'Main Course', 299],
  ],
  Pizza: [
    ['Margherita Pizza', true, ['Pizza Base', 'Mozzarella', 'Tomato Sauce', 'Basil'], 'Main Course', 199],
    ['Farmhouse Veg Pizza', true, ['Pizza Base', 'Capsicum', 'Onion', 'Tomato', 'Cheese'], 'Main Course', 289],
    ['Paneer Tikka Pizza', true, ['Pizza Base', 'Paneer', 'Tikka Sauce', 'Cheese'], 'Main Course', 329],
    ['Chicken Pepperoni Pizza', false, ['Pizza Base', 'Pepperoni', 'Mozzarella', 'Tomato Sauce'], 'Main Course', 379],
    ['BBQ Chicken Pizza', false, ['Pizza Base', 'Chicken', 'BBQ Sauce', 'Onion', 'Cheese'], 'Main Course', 359],
  ],
  Burger: [
    ['Classic Veg Burger', true, ['Bun', 'Veg Patty', 'Lettuce', 'Tomato', 'Mayo'], 'Main Course', 129],
    ['Crispy Chicken Burger', false, ['Bun', 'Chicken Patty', 'Lettuce', 'Cheese', 'Mayo'], 'Main Course', 179],
    ['Paneer Makhani Burger', true, ['Bun', 'Paneer Patty', 'Makhani Sauce', 'Onion'], 'Main Course', 169],
    ['Double Cheese Burger', false, ['Bun', 'Chicken Patty', 'Cheese', 'Pickle', 'Sauce'], 'Main Course', 229],
  ],
  Chinese: [
    ['Veg Fried Rice', true, ['Rice', 'Carrot', 'Beans', 'Spring Onion', 'Soy Sauce'], 'Main Course', 189],
    ['Chicken Fried Rice', false, ['Rice', 'Chicken', 'Egg', 'Spring Onion', 'Soy Sauce'], 'Main Course', 229],
    ['Veg Hakka Noodles', true, ['Noodles', 'Cabbage', 'Capsicum', 'Soy Sauce'], 'Main Course', 179],
    ['Chicken Manchurian', false, ['Chicken', 'Garlic', 'Soy Sauce', 'Spring Onion'], 'Main Course', 249],
    ['Chilli Paneer', true, ['Paneer', 'Capsicum', 'Onion', 'Chilli Sauce'], 'Starter', 239],
    ['Schezwan Noodles', true, ['Noodles', 'Schezwan Sauce', 'Vegetables'], 'Main Course', 199],
  ],
  'South Indian': [
    ['Masala Dosa', true, ['Rice Batter', 'Potato Masala', 'Ghee', 'Chutney'], 'Breakfast', 119],
    ['Ghee Idli Sambar', true, ['Idli', 'Ghee', 'Sambar', 'Coconut Chutney'], 'Breakfast', 99],
    ['Onion Uttapam', true, ['Rice Batter', 'Onion', 'Green Chilli', 'Chutney'], 'Breakfast', 129],
    ['Andhra Veg Meals', true, ['Rice', 'Dal', 'Sambar', 'Poriyal', 'Pickle'], 'Main Course', 189],
    ['Chicken Chettinad', false, ['Chicken', 'Coconut', 'Pepper', 'Curry Leaves'], 'Main Course', 279],
  ],
  'North Indian': [
    ['Butter Chicken', false, ['Chicken', 'Tomato', 'Butter', 'Cream', 'Spices'], 'Main Course', 329],
    ['Paneer Butter Masala', true, ['Paneer', 'Tomato', 'Butter', 'Cream', 'Spices'], 'Main Course', 259],
    ['Dal Makhani', true, ['Black Lentils', 'Butter', 'Cream', 'Spices'], 'Main Course', 219],
    ['Tandoori Roti', true, ['Wheat Flour', 'Salt', 'Ghee'], 'Bread', 35],
    ['Chicken Tikka', false, ['Chicken', 'Yogurt', 'Tandoori Masala'], 'Starter', 289],
    ['Chole Bhature', true, ['Chickpeas', 'Flour', 'Spices', 'Onion'], 'Main Course', 189],
  ],
  Desserts: [
    ['Chocolate Donut', true, ['Flour', 'Cocoa', 'Sugar', 'Chocolate Glaze'], 'Dessert', 99],
    ['Classic Cheesecake', true, ['Cream Cheese', 'Biscuit Base', 'Sugar', 'Cream'], 'Dessert', 189],
    ['Gulab Jamun', true, ['Khoya', 'Sugar Syrup', 'Cardamom'], 'Dessert', 89],
    ['Vanilla Ice Cream', true, ['Milk', 'Cream', 'Vanilla', 'Sugar'], 'Dessert', 109],
    ['Double Chocolate Brownie', true, ['Chocolate', 'Flour', 'Butter', 'Walnut'], 'Dessert', 149],
  ],
  Beverages: [
    ['Cold Coffee', true, ['Coffee', 'Milk', 'Sugar', 'Ice'], 'Beverage', 129],
    ['Fresh Lime Soda', true, ['Lime', 'Soda', 'Sugar', 'Salt'], 'Beverage', 89],
    ['Mango Lassi', true, ['Mango', 'Yogurt', 'Sugar', 'Cardamom'], 'Beverage', 119],
    ['Masala Chai', true, ['Tea', 'Milk', 'Ginger', 'Cardamom'], 'Beverage', 49],
  ],
  Sandwiches: [
    ['Club Sandwich', false, ['Bread', 'Chicken', 'Egg', 'Lettuce', 'Mayo'], 'Snack', 199],
    ['Veg Cheese Sandwich', true, ['Bread', 'Cheese', 'Tomato', 'Cucumber', 'Chutney'], 'Snack', 139],
    ['Paneer Tikka Sandwich', true, ['Bread', 'Paneer', 'Mint Chutney', 'Onion'], 'Snack', 169],
    ['Grilled Chicken Sandwich', false, ['Bread', 'Chicken', 'Cheese', 'Mayo'], 'Snack', 189],
  ],
  'Fast Food': [
    ['French Fries', true, ['Potato', 'Salt', 'Seasoning'], 'Snack', 99],
    ['Peri Peri Fries', true, ['Potato', 'Peri Peri Spice', 'Salt'], 'Snack', 129],
    ['Chicken Nuggets', false, ['Chicken', 'Breadcrumbs', 'Spices'], 'Snack', 169],
    ['Veg Wrap', true, ['Tortilla', 'Vegetables', 'Sauce', 'Cheese'], 'Snack', 149],
  ],
};

const cuisineMap = {
  Biryani: 'Biryani',
  Pizza: 'Pizza',
  Burger: 'Burger',
  Fast: 'Fast Food',
  Chinese: 'Chinese',
  Sichuan: 'Chinese',
  South: 'South Indian',
  Andhra: 'South Indian',
  North: 'North Indian',
  Mughlai: 'North Indian',
  Desserts: 'Desserts',
  Bakery: 'Desserts',
  Mithai: 'Desserts',
  Beverages: 'Beverages',
  Sandwich: 'Sandwiches',
  Wraps: 'Fast Food',
  Rolls: 'Fast Food',
};

function seededRandom(seed) {
  let state = parseInt(crypto.createHash('sha256').update(seed).digest('hex').slice(0, 8), 16);
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick(list, rand) {
  return list[Math.floor(rand() * list.length)];
}

function int(min, max, rand) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function decimal(min, max, rand, digits = 1) {
  return Number((min + rand() * (max - min)).toFixed(digits));
}

function objectId(seed) {
  return crypto.createHash('sha256').update(seed).digest('hex').slice(0, 24);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.trim());
  return rows.map((values) =>
    headers.reduce((record, header, index) => {
      record[header] = (values[index] || '').trim();
      return record;
    }, {})
  );
}

function normalizeCuisine(rawCuisine) {
  const detected = new Set();
  rawCuisine.split(',').map((item) => item.trim()).forEach((item) => {
    Object.entries(cuisineMap).forEach(([key, value]) => {
      if (item.toLowerCase().includes(key.toLowerCase())) detected.add(value);
    });
  });

  if (!detected.size) detected.add('Fast Food');
  return [...detected].slice(0, 5);
}

function openingHours(rand) {
  const lateNight = rand() > 0.72;
  return days.map((day) => ({
    day,
    open: lateNight ? '11:00' : '09:00',
    close: lateNight ? '01:00' : '23:00',
    isClosed: false,
  }));
}

function restaurantDescription(name, cuisines, area) {
  return `${name} serves ${cuisines.join(', ')} favorites from ${area}, Hyderabad with reliable delivery, generous portions, and crowd-friendly pricing.`;
}

function imageCategoryFor(category, itemName = '') {
  const normalizedName = itemName.toLowerCase();
  if (normalizedName.includes('donut')) return 'donuts';
  if (normalizedName.includes('ice cream') || normalizedName.includes('lassi') || normalizedName.includes('coffee')) return 'ice_cream';
  if (normalizedName.includes('noodle') || normalizedName.includes('sambar') || normalizedName.includes('chettinad')) return 'ramen';
  if (normalizedName.includes('sandwich')) return 'club_sandwich';
  if (normalizedName.includes('fries')) return 'french_fries';

  const map = {
    Biryani: 'fried_rice',
    Pizza: 'pizza',
    Burger: 'hamburger',
    Chinese: 'fried_rice',
    'South Indian': 'ramen',
    'North Indian': 'spaghetti_bolognese',
    Desserts: 'cheesecake',
    Beverages: 'ice_cream',
    Sandwiches: 'club_sandwich',
    'Fast Food': 'french_fries',
  };
  return map[category] || 'fried_rice';
}

function menuImage(category, index, itemName) {
  const folder = imageCategoryFor(category, itemName);
  return `/images/food-101/${folder}/${folder}${(index % 12) + 1}.jpg`;
}

function caloriesFor(category, price, rand) {
  const ranges = {
    Biryani: [650, 980],
    Pizza: [520, 900],
    Burger: [430, 760],
    Chinese: [420, 780],
    'South Indian': [280, 650],
    'North Indian': [420, 820],
    Desserts: [250, 560],
    Beverages: [80, 320],
    Sandwiches: [330, 620],
    'Fast Food': [300, 700],
  };
  const [min, max] = ranges[category] || [300, 700];
  return int(min, max + Math.floor(price / 10), rand);
}

function dietaryType(item, category) {
  if (!item[1]) return 'Non-Veg';
  if (category === 'Beverages') return 'Vegetarian';
  if (item[4] < 130 || category === 'South Indian') return 'Vegetarian';
  return 'Vegetarian';
}

function mealTypeFor(subCategory, category) {
  if (subCategory === 'Breakfast') return 'Breakfast';
  if (subCategory === 'Dessert') return 'Dessert';
  if (subCategory === 'Beverage') return 'Snack';
  if (['Snack', 'Starter', 'Bread'].includes(subCategory)) return 'Snack';
  if (category === 'Biryani' || category === 'North Indian') return 'Lunch/Dinner';
  return 'Anytime';
}

function proteinLevel(item, category) {
  if (!item[1]) return 'High';
  if (item[0].toLowerCase().includes('paneer') || category === 'North Indian') return 'Medium';
  if (category === 'Beverages' || category === 'Desserts') return 'Low';
  return 'Medium';
}

function spicyLevel(category, itemName, rand) {
  const spicyNames = ['biryani', 'schezwan', 'chilli', 'tikka', 'chettinad', 'peri peri', 'andhra'];
  if (spicyNames.some((word) => itemName.toLowerCase().includes(word))) return int(3, 5, rand);
  if (['Biryani', 'Chinese', 'North Indian', 'South Indian'].includes(category)) return int(2, 4, rand);
  return int(0, 2, rand);
}

function itemDescription(item, restaurantName) {
  const [name, , ingredients, subCategory] = item;
  const style = subCategory === 'Dessert' ? 'freshly prepared' : 'made to order';
  return `${style} ${name} from ${restaurantName}, featuring ${ingredients.slice(0, 3).join(', ')} and balanced house seasoning.`;
}

function generateRestaurants(rows) {
  const slugCounts = new Map();
  return rows.map((row, index) => {
    const name = row.names || `Hyderabad Restaurant ${index + 1}`;
    const rand = seededRandom(`${name}-${index}`);
    const area = pick(hyderabadAreas, rand);
    const cuisines = normalizeCuisine(row.cuisine);
    const baseSlug = slugify(name) || `restaurant-${index + 1}`;
    const seen = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, seen + 1);
    const slug = seen ? `${baseSlug}-${seen + 1}` : baseSlug;
    const rating = Math.min(5, Math.max(3.2, Number(row.ratings) || decimal(3.5, 4.7, rand)));
    const totalRatings = int(120, 8200, rand);
    const priceForOne = Number(row['price for one']) || int(120, 450, rand);
    const createdAt = new Date(Date.UTC(2025, int(0, 10, rand), int(1, 28, rand))).toISOString();
    const updatedAt = new Date(Date.UTC(2026, int(0, 5, rand), int(1, 20, rand))).toISOString();
    const locationJitter = () => decimal(-0.012, 0.012, rand, 6);
    const isPureVeg = cuisines.every((cuisine) => !['Biryani', 'Burger'].includes(cuisine)) && rand() > 0.38;
    const featured = rating >= 4.1 || totalRatings > 5000;
    const trending = rating >= 4 || rand() > 0.68;

    return {
      _id: objectId(`restaurant-${slug}-${index}`),
      name,
      slug,
      cuisine: cuisines,
      rating,
      totalRatings,
      reviewCount: totalRatings,
      priceForOne,
      description: restaurantDescription(name, cuisines, area.area),
      image: `/images/restaurants/${slug}.jpg`,
      bannerImage: `/images/restaurants/banners/${slug}-banner.jpg`,
      address: {
        street: `${int(1, 95, rand)}, ${area.area} Main Road`,
        area: area.area,
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: area.pincode,
        landmark: `${area.area} Metro Corridor`,
      },
      city: 'Hyderabad',
      deliveryTime: int(22, 48, rand),
      deliveryFee: priceForOne <= 150 ? int(25, 45, rand) : int(0, 35, rand),
      isPureVeg,
      isVeg: isPureVeg,
      isOpen: rand() > 0.08,
      isActive: true,
      openingHours: openingHours(rand),
      latitude: Number((area.lat + locationJitter()).toFixed(6)),
      longitude: Number((area.lng + locationJitter()).toFixed(6)),
      tags: [...new Set([...cuisines, featured ? 'Featured' : 'Local Favorite', trending ? 'Trending' : 'Value Meals'])],
      featured,
      trending,
      sourceUrl: row.links || '',
      createdAt,
      updatedAt,
    };
  });
}

function generateMenuItems(restaurants) {
  return restaurants.flatMap((restaurant, restaurantIndex) => {
    const rand = seededRandom(`menu-${restaurant._id}`);
    const categories = restaurant.cuisine.length ? restaurant.cuisine : ['Fast Food'];
    const targetCount = int(15, 30, rand);
    const items = [];

    for (let index = 0; index < targetCount; index += 1) {
      const category = categories[index % categories.length] || pick(Object.keys(dishCatalog), rand);
      const catalog = dishCatalog[category] || dishCatalog['Fast Food'];
      const baseItem = pick(catalog, rand);
      const suffixes = ['', 'Combo', 'Family Pack', 'Regular', 'Signature', 'Chef Special'];
      const suffix = index >= catalog.length ? pick(suffixes, rand) : '';
      const name = `${baseItem[0]}${suffix ? ` ${suffix}` : ''}`;
      const priceVariance = int(-20, 95, rand);
      const price = Math.max(49, baseItem[4] + priceVariance + Math.round(restaurant.priceForOne * 0.15));
      const popularityScore = int(45, 99, rand);
      const rating = decimal(Math.max(3.5, restaurant.rating - 0.4), 4.9, rand);
      const totalReviews = int(25, Math.max(80, Math.floor(restaurant.totalRatings / 4)), rand);
      const calories = caloriesFor(category, price, rand);
      const createdAt = restaurant.createdAt;
      const updatedAt = restaurant.updatedAt;

      items.push({
        _id: objectId(`menu-${restaurant._id}-${index}-${name}`),
        restaurantId: restaurant._id,
        restaurant: restaurant._id,
        restaurantName: restaurant.name,
        name,
        category,
        subCategory: baseItem[3],
        description: itemDescription(baseItem, restaurant.name),
        price,
        isVeg: restaurant.isPureVeg ? true : baseItem[1],
        isAvailable: rand() > 0.04,
        preparationTime: int(10, category === 'Biryani' ? 32 : 24, rand),
        calories,
        ingredients: baseItem[2],
        image: menuImage(category, restaurantIndex + index, name),
        popularityScore,
        rating,
        totalReviews,
        isTrending: popularityScore >= 84,
        orderCount: int(75, 3200, rand),
        spicyLevel: spicyLevel(category, name, rand),
        dietaryType: restaurant.isPureVeg ? 'Vegetarian' : dietaryType(baseItem, category),
        mealType: mealTypeFor(baseItem[3], category),
        proteinLevel: proteinLevel(baseItem, category),
        healthScore: Math.max(35, Math.min(96, 100 - Math.floor(calories / 18) + (baseItem[1] ? 8 : 0) - spicyLevel(category, name, rand))),
        cuisineType: category,
        createdAt,
        updatedAt,
      });
    }

    return items;
  });
}

function generateReviews(restaurants) {
  const names = ['Aarav Sharma', 'Ananya Reddy', 'Rohan Mehta', 'Sana Khan', 'Vikram Rao', 'Isha Nair', 'Kabir Singh', 'Meera Joshi', 'Aditya Varma', 'Nisha Patel', 'Rahul Das', 'Priya Menon', 'Farhan Ali', 'Neha Kapoor', 'Kiran Kumar', 'Divya Iyer', 'Manish Jain', 'Ayesha Mirza', 'Siddharth Bose', 'Tanvi Shah'];
  const comments = [
    'Great packaging and the food arrived hot.',
    'Portions were generous and flavors felt consistent.',
    'Good weekday meal option with quick delivery.',
    'The spice balance was excellent.',
    'Fresh food, neat packing, and worth reordering.',
    'Loved the taste and the delivery timing was accurate.',
    'Good value for the price.',
    'Reliable place when ordering for family.',
  ];

  return restaurants.flatMap((restaurant) => {
    const rand = seededRandom(`reviews-${restaurant._id}`);
    const count = int(5, 20, rand);
    return Array.from({ length: count }, (_, index) => {
      const userName = names[(index + int(0, names.length - 1, rand)) % names.length];
      const rating = decimal(Math.max(3, restaurant.rating - 0.8), 5, rand);
      const daysAgo = int(2, 240, rand);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      return {
        _id: objectId(`review-${restaurant._id}-${index}`),
        user: objectId(`user-${restaurant._id}-${index}-${userName}`),
        userName,
        restaurantId: restaurant._id,
        restaurant: restaurant._id,
        rating,
        reviewText: pick(comments, rand),
        comment: pick(comments, rand),
        createdAt,
        updatedAt: createdAt,
      };
    });
  });
}

function generateCoupons() {
  const expires = (months) => new Date(Date.UTC(2026, months, 30, 23, 59, 59)).toISOString();
  return [
    ['WELCOME50', 'percentage', 50, 249, expires(11), 5000],
    ['FIRSTORDER', 'fixed', 125, 299, expires(9), 3000],
    ['FREEDELIVERY', 'free_delivery', 100, 199, expires(8), 10000],
    ['FESTIVE20', 'percentage', 20, 399, expires(10), 4500],
    ['BIRYANI30', 'percentage', 30, 349, expires(7), 2500],
  ].map(([code, discountType, discountValue, minimumOrderValue, expiryDate, usageLimit]) => ({
    _id: objectId(`coupon-${code}`),
    code,
    discountType,
    discountValue,
    minimumOrderValue,
    expiryDate,
    usageLimit,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function generateCategories() {
  return categoryAssets.map(([name, icon, image]) => ({
    _id: objectId(`category-${name}`),
    name,
    icon,
    image,
    slug: slugify(name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function generateTrendingFoods(menuItems) {
  return [...menuItems]
    .sort((a, b) => b.popularityScore - a.popularityScore || b.orderCount - a.orderCount)
    .slice(0, 60)
    .map((item, index) => ({
      _id: objectId(`trending-${item._id}`),
      menuItemId: item._id,
      restaurantId: item.restaurantId,
      name: item.name,
      category: item.category,
      orderCount: item.orderCount + (60 - index) * 11,
      rating: item.rating,
      image: item.image,
      rank: index + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
}

function writeJson(filename, data) {
  fs.writeFileSync(path.join(dataDir, filename), `${JSON.stringify(data, null, 2)}\n`);
}

function main() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}`);
  }

  fs.mkdirSync(dataDir, { recursive: true });
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8')).filter((row) => row.names);
  const restaurants = generateRestaurants(rows);
  const menuItems = generateMenuItems(restaurants);
  const reviews = generateReviews(restaurants);
  const coupons = generateCoupons();
  const categories = generateCategories();
  const trendingFoods = generateTrendingFoods(menuItems);

  writeJson('restaurants.json', restaurants);
  writeJson('menu-items.json', menuItems);
  writeJson('reviews.json', reviews);
  writeJson('coupons.json', coupons);
  writeJson('categories.json', categories);
  writeJson('trending-foods.json', trendingFoods);

  console.log(`Generated ${restaurants.length} restaurants`);
  console.log(`Generated ${menuItems.length} menu items`);
  console.log(`Generated ${reviews.length} reviews`);
  console.log(`Generated ${coupons.length} coupons`);
  console.log(`Generated ${categories.length} categories`);
  console.log(`Generated ${trendingFoods.length} trending foods`);
}

main();
