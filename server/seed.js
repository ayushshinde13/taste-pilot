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

function usersFromReviews(reviews, restaurants) {
  const users = new Map();
  const seedPasswordHash = bcrypt.hashSync('TastePilot@123', 12);
  const restaurantMap = new Map(restaurants.map((r) => [r._id.toString(), r]));

  for (const review of reviews) {
    if (users.has(review.user)) continue;

    const restId = review.restaurantId?.toString() || review.restaurant?.toString();
    const rest = restaurantMap.get(restId);
    
    const address = rest ? {
      label: 'Home',
      street: `${rest.locality} Customer Quarter`,
      city: rest.city,
      state: rest.address?.state || 'State',
      pincode: rest.pincode,
      locality: rest.locality,
      latitude: rest.latitude,
      longitude: rest.longitude,
      isDefault: true,
    } : {
      label: 'Home',
      street: 'Seeded customer address',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      locality: 'Banjara Hills',
      latitude: 17.4126,
      longitude: 78.4482,
      isDefault: true,
    };

    const slug = review.userName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
    
    // Convert the user ID to string to safely perform slice operation
    const userIdString = review.user.toString();
    users.set(review.user, {
      _id: toObjectId(review.user),
      name: review.userName,
      email: `${slug}.${userIdString.slice(-6)}@tastepilot.local`,
      password: seedPasswordHash,
      role: 'user',
      addresses: [address],
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

// Function to categorize images by their food type
function categorizeImages(imageFiles) {
  const categorizedImages = {
    'Burger': [],
    'Pizza': [],
    'Momos': [],
    'Biryani': [],
    'Beverages': [],
    'Chinese': [],
    'South Indian': [],
    'Rice': [],
    'Roti': [],
    'Veg': [],
    'default': []
  };

  for (const imageFile of imageFiles) {
    const lowerImageName = imageFile.toLowerCase();
    
    // Match images to specific categories based on the actual file names
    if (lowerImageName.includes('burger')) {
      categorizedImages['Burger'].push(imageFile);
    } else if (lowerImageName.includes('pizza')) {
      categorizedImages['Pizza'].push(imageFile);
    } else if (lowerImageName.includes('momo') || lowerImageName.includes('momos')) {
      categorizedImages['Momos'].push(imageFile);
    } else if (lowerImageName.includes('biryani')) {
      categorizedImages['Biryani'].push(imageFile);
    } else if (lowerImageName.includes('beverage') || lowerImageName.includes('drink') || 
               lowerImageName.includes('coke') || lowerImageName.includes('cold') || 
               lowerImageName.includes('shake') || lowerImageName.includes('coffee') ||
               lowerImageName.includes('buttermilk') || lowerImageName.includes('tea') || 
               lowerImageName.includes('juice') || lowerImageName.includes('ice cream') ||
               lowerImageName.includes('frappuccino')) {
      categorizedImages['Beverages'].push(imageFile);
    } else if (lowerImageName.includes('chinese') || lowerImageName.includes('fried') || 
               lowerImageName.includes('noodles') || lowerImageName.includes('manchurian') ||
               lowerImageName.includes('chilli') || lowerImageName.includes('bhel') || 
               lowerImageName.includes('thali')) {
      categorizedImages['Chinese'].push(imageFile);
    } else if (lowerImageName.includes('dosa') || lowerImageName.includes('idly') || 
               lowerImageName.includes('sambar') || lowerImageName.includes('south')) {
      categorizedImages['South Indian'].push(imageFile);
    } else if (lowerImageName.includes('rice')) {
      categorizedImages['Rice'].push(imageFile);
    } else if (lowerImageName.includes('roti') || lowerImageName.includes('naan') || 
               lowerImageName.includes('paratha')) {
      categorizedImages['Roti'].push(imageFile);
    } else if (lowerImageName.includes('veg') || lowerImageName.includes('paneer') ||
               lowerImageName.includes('dal') || lowerImageName.includes('masala') ||
               lowerImageName.includes('gobi') || lowerImageName.includes('manchurian') ||
               lowerImageName.includes('biryani') && lowerImageName.includes('veg')) {
      categorizedImages['Veg'].push(imageFile);
    } else {
      categorizedImages['default'].push(imageFile);
    }
  }
  
  return categorizedImages;
}

// Function to match specific menu items to corresponding images based on name similarity
function matchItemImage(menuItemName, categoryName, categorizedImages) {
  const itemName = menuItemName.toLowerCase();
  
  // Look for direct name matches in the available images
  for (const imageFile of categorizedImages[categoryName] || []) {
    const imageFileName = imageFile.toLowerCase().replace(/\.[^/.]+$/, ""); // Remove extension
    
    // Clean the image name to make matching easier
    const cleanImageName = imageFileName.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    const cleanItemName = itemName.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    
    // Check if the image name contains the item name or vice versa
    if (cleanImageName.includes(cleanItemName) || cleanItemName.includes(cleanImageName) ||
        calculateSimilarity(cleanItemName, cleanImageName) > 0.4) {
      return imageFile;
    }
  }
  
  // If no direct match, return a default image from the category
  if (categorizedImages[categoryName] && categorizedImages[categoryName].length > 0) {
    // Cycle through images in the category to distribute them
    const imageIndex = Array.from(itemName).reduce((acc, char) => acc + char.charCodeAt(0), 0) % categorizedImages[categoryName].length;
    return categorizedImages[categoryName][imageIndex];
  }
  
  return null;
}

// Helper function to calculate string similarity
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const editDistance = computeEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function computeEditDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
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
  
  const slugify = (text) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  const rawRestaurants = [
    // RAIPUR
    { name: "Biryani House", city: "Raipur" },
    { name: "Pizza Palace", city: "Raipur" },
    { name: "Burger Junction", city: "Raipur" },
    { name: "Momos Express", city: "Raipur" },
    { name: "Sweet Cravings", city: "Raipur" },
    { name: "Rice Bowl", city: "Raipur" },
    { name: "Royal Tandoor", city: "Raipur" },
    { name: "Chinese Wok", city: "Raipur" },
    { name: "South Spice", city: "Raipur" },
    { name: "Cafe Delight", city: "Raipur" },

    // PUNE
    { name: "Urban Biryani", city: "Pune" },
    { name: "Pizza Hub", city: "Pune" },
    { name: "Burger Factory", city: "Pune" },
    { name: "Momo Point", city: "Pune" },
    { name: "Dessert Heaven", city: "Pune" },
    { name: "Rice Republic", city: "Pune" },
    { name: "Tandoori Nights", city: "Pune" },
    { name: "Dragon Bowl", city: "Pune" },
    { name: "South Kitchen", city: "Pune" },
    { name: "Food Street", city: "Pune" },

    // MUMBAI
    { name: "Mumbai Biryani", city: "Mumbai" },
    { name: "Marine Pizza", city: "Mumbai" },
    { name: "Burger Club", city: "Mumbai" },
    { name: "Momo Corner", city: "Mumbai" },
    { name: "Cake Studio", city: "Mumbai" },
    { name: "Rice Kingdom", city: "Mumbai" },
    { name: "Tandoor Express", city: "Mumbai" },
    { name: "Chinese Dragon", city: "Mumbai" },
    { name: "Dosa Hub", city: "Mumbai" },
    { name: "Taste Cafe", city: "Mumbai" },

    // BANGALORE
    { name: "Bangalore Biryani", city: "Bangalore" },
    { name: "Pizza Corner", city: "Bangalore" },
    { name: "Burger Lab", city: "Bangalore" },
    { name: "Momo Nation", city: "Bangalore" },
    { name: "Sweet Treats", city: "Bangalore" },
    { name: "Rice Hub", city: "Bangalore" },
    { name: "Tandoor Kitchen", city: "Bangalore" },
    { name: "Wok Express", city: "Bangalore" },
    { name: "South Bowl", city: "Bangalore" },
    { name: "Cafe Aroma", city: "Bangalore" },

    // HYDERABAD
    { name: "Hyderabad Biryani", city: "Hyderabad" },
    { name: "Pizza World", city: "Hyderabad" },
    { name: "Burger Town", city: "Hyderabad" },
    { name: "Momo Street", city: "Hyderabad" },
    { name: "Dessert Hub", city: "Hyderabad" },
    { name: "Rice House", city: "Hyderabad" },
    { name: "Tandoori Hub", city: "Hyderabad" },
    { name: "Chinese Point", city: "Hyderabad" },
    { name: "South Flavours", city: "Hyderabad" },
    { name: "Cafe Central", city: "Hyderabad" }
  ];

  const cityCoordinates = {
    'Raipur': { lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh', pin: '492001' },
    'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra', pin: '411001' },
    'Mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra', pin: '400001' },
    'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka', pin: '560001' },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana', pin: '500001' }
  };

  const restaurants = rawRestaurants.map((raw, index) => {
    const nameLower = raw.name.toLowerCase();
    const coords = cityCoordinates[raw.city] || { lat: 17.3850, lng: 78.4867, state: 'Telangana', pin: '500001' };

    // Determine cuisine based on name
    let cuisine = ['Beverages', 'Fast Food'];
    if (nameLower.includes('biryani')) {
      cuisine = ['Biryani', 'North Indian'];
    } else if (nameLower.includes('pizza')) {
      cuisine = ['Pizza', 'Fast Food', 'Italian'];
    } else if (nameLower.includes('burger')) {
      cuisine = ['Burger', 'Fast Food'];
    } else if (nameLower.includes('momo')) {
      cuisine = ['Street Food', 'Chinese'];
    } else if (nameLower.includes('sweet') || nameLower.includes('dessert') || nameLower.includes('cake') || nameLower.includes('cravings') || nameLower.includes('treats')) {
      cuisine = ['Desserts', 'Bakery'];
    } else if (nameLower.includes('rice') || nameLower.includes('wok') || nameLower.includes('dragon') || nameLower.includes('chinese') || nameLower.includes('bowl')) {
      cuisine = ['Chinese', 'Asian'];
    } else if (nameLower.includes('tandoor') || nameLower.includes('tandoori')) {
      cuisine = ['North Indian', 'Mughlai'];
    } else if (nameLower.includes('south') || nameLower.includes('dosa') || nameLower.includes('spice') || nameLower.includes('kitchen') || nameLower.includes('flavours')) {
      cuisine = ['South Indian', 'Breakfast'];
    } else if (nameLower.includes('cafe')) {
      cuisine = ['Beverages', 'Fast Food'];
    }

    const slug = `${slugify(raw.name)}-${slugify(raw.city)}`;
    const rating = +(4.0 + Math.random() * 0.9).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500) + 50;

    return {
      _id: new mongoose.Types.ObjectId(),
      name: raw.name,
      city: raw.city,
      slug,
      cuisine,
      rating,
      totalRatings: reviewCount,
      reviewCount,
      priceForOne: 150 + Math.floor(Math.random() * 4) * 100,
      deliveryTime: 15 + Math.floor(Math.random() * 6) * 5,
      deliveryFee: 30,
      isPureVeg: nameLower.includes('sweet') || nameLower.includes('dessert') || nameLower.includes('cake') || nameLower.includes('dosa') || nameLower.includes('south'),
      isVeg: nameLower.includes('sweet') || nameLower.includes('dessert') || nameLower.includes('cake') || nameLower.includes('dosa') || nameLower.includes('south'),
      isOpen: true,
      isActive: true,
      featured: Math.random() > 0.8,
      trending: Math.random() > 0.8,
      tags: [...cuisine, raw.city],
      latitude: coords.lat + (Math.random() - 0.5) * 0.05,
      longitude: coords.lng + (Math.random() - 0.5) * 0.05,
      serviceRadiusKm: 10,
      description: `${raw.name} is a popular dining spot in ${raw.city} serving delicious ${cuisine.join(' and ')} cuisines.`,
      address: {
        street: `Main Road, Sector ${index + 1}`,
        city: raw.city,
        state: coords.state,
        pincode: coords.pin
      },
      openingHours: [
        { day: 'Monday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Tuesday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Wednesday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Thursday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Saturday', open: '09:00', close: '23:00', isClosed: false },
        { day: 'Sunday', open: '09:00', close: '23:00', isClosed: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
  
  // Read available images from public/images
  const imageDir = path.join(__dirname, 'public', 'images');
  let availableImages = [];
  try {
    availableImages = fs.readdirSync(imageDir).filter(file => file.endsWith('.avif'));
  } catch (error) {
    console.error('Failed to read public/images:', error);
  }

  const restaurantGroups = {
    Biryani: [
      "Biryani House", "Urban Biryani", "Mumbai Biryani", "Bangalore Biryani", "Hyderabad Biryani"
    ],
    Pizza: [
      "Pizza Palace", "Pizza Hub", "Marine Pizza", "Pizza Corner", "Pizza World"
    ],
    Burger: [
      "Burger Junction", "Burger Factory", "Burger Club", "Burger Lab", "Burger Town"
    ],
    Momos: [
      "Momos Express", "Momo Point", "Momo Corner", "Momo Nation", "Momo Street"
    ],
    Chinese: [
      "Chinese Wok", "Dragon Bowl", "Chinese Dragon", "Wok Express", "Chinese Point"
    ],
    SouthIndian: [
      "South Spice", "South Kitchen", "Dosa Hub", "South Bowl", "South Flavours"
    ],
    Rice: [
      "Rice Bowl", "Rice Republic", "Rice Kingdom", "Rice Hub", "Rice House"
    ],
    Tandoor: [
      "Royal Tandoor", "Tandoori Nights", "Tandoor Express", "Tandoor Kitchen", "Tandoori Hub"
    ],
    Dessert: [
      "Sweet Cravings", "Dessert Heaven", "Cake Studio", "Sweet Treats", "Dessert Hub"
    ],
    Cafe: [
      "Cafe Delight", "Food Street", "Taste Cafe", "Cafe Aroma", "Cafe Central"
    ]
  };

  // Helper functions for categorization and cleaning
  function getCategoryAndVeg(filename) {
    const lower = filename.toLowerCase();
    let isVeg = true;
    if (lower.includes('chicken') || lower.includes('egg') || lower.includes('murgh') || lower.includes('meat') || lower.includes('mutton') || lower.includes('fish') || lower.includes('zinger') || lower.includes('barbeque')) {
      isVeg = false;
    }

    if (lower.includes('biryani')) return { category: 'Biryani', isVeg };
    if (lower.includes('pizza')) return { category: 'Pizza', isVeg };
    if (lower.includes('burger')) return { category: 'Burger', isVeg };
    if (lower.includes('momo')) return { category: 'Momos', isVeg };
    
    if (lower.includes('shake') || lower.includes('coffee') || lower.includes('frappuccino') || lower.includes('beverage') || lower.includes('coke') || lower.includes('buttermilk') || lower.includes('drink') || lower.includes('milk')) {
      return { category: 'Beverages', isVeg: true };
    }
    if (lower.includes('cake') || lower.includes('cheesecake') || lower.includes('cream') || lower.includes('pastry') || lower.includes('dessert') || lower.includes('biscoff')) {
      return { category: 'Dessert', isVeg: true };
    }
    if (lower.includes('dosa') || lower.includes('idly') || lower.includes('sambar') || lower.includes('vada') && !lower.includes('sabudana')) {
      return { category: 'South Indian', isVeg: true };
    }
    if (lower.includes('roti') || lower.includes('naan') || lower.includes('paratha')) {
      return { category: 'Roti', isVeg: true };
    }
    if (lower.includes('chinese') || lower.includes('noodle') || lower.includes('manchurian') || lower.includes('bhel') || lower.includes('chilli') || lower.includes('chilly')) {
      return { category: 'Chinese', isVeg };
    }
    if (lower.includes('rice')) {
      return { category: 'Rice', isVeg };
    }
    return { category: 'Veg', isVeg: true };
  }

  function cleanFoodName(filename) {
    let name = filename.replace(/\.avif$/i, '');
    name = name.replace(/[-_]+/g, ' ');
    name = name.replace(/\s+/g, ' ').trim();

    return name.split(' ').map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  function getPrice(category, index) {
    switch (category) {
      case 'Biryani': return 250 + (index % 5) * 20;
      case 'Pizza': return 299 + (index % 5) * 30;
      case 'Burger': return 120 + (index % 5) * 15;
      case 'Momos': return 140 + (index % 5) * 10;
      case 'Chinese': return 180 + (index % 5) * 15;
      case 'South Indian': return 120 + (index % 5) * 10;
      case 'Rice': return 160 + (index % 5) * 15;
      case 'Roti': return 40 + (index % 5) * 10;
      case 'Dessert': return 150 + (index % 5) * 20;
      case 'Beverages': return 80 + (index % 5) * 10;
      case 'Veg': return 170 + (index % 5) * 15;
      default: return 150;
    }
  }

  const menuItems = [];

  availableImages.forEach((file, index) => {
    const foodName = cleanFoodName(file);
    const { category, isVeg } = getCategoryAndVeg(file);
    const price = getPrice(category, index);
    
    // Determine which groups this item goes to based on Rule 6
    let targetGroups = [];
    if (category === 'Burger') targetGroups = ['Burger', 'Cafe'];
    else if (category === 'Pizza') targetGroups = ['Pizza', 'Cafe'];
    else if (category === 'Biryani') targetGroups = ['Biryani'];
    else if (category === 'Momos') targetGroups = ['Momos'];
    else if (category === 'Chinese') targetGroups = ['Chinese'];
    else if (category === 'South Indian') targetGroups = ['SouthIndian'];
    else if (category === 'Rice') targetGroups = ['Rice'];
    else if (category === 'Roti') targetGroups = ['Tandoor'];
    else if (category === 'Dessert') targetGroups = ['Dessert'];
    else if (category === 'Veg') targetGroups = ['Rice', 'Tandoor'];
    else if (category === 'Beverages') targetGroups = ['Biryani', 'Pizza', 'Burger', 'Momos', 'Chinese', 'SouthIndian', 'Rice', 'Tandoor', 'Dessert', 'Cafe'];

    // Map each target group to the corresponding restaurants and add to menuItems
    targetGroups.forEach(groupName => {
      const restNames = restaurantGroups[groupName] || [];
      restNames.forEach(restName => {
        const matchingRestaurant = restaurants.find(r => r.name === restName);
        if (matchingRestaurant) {
          menuItems.push({
            _id: new mongoose.Types.ObjectId(),
            restaurant: matchingRestaurant._id,
            name: foodName,
            category: category,
            price: price,
            isVeg: isVeg,
            image: `/images/${file}`,
            description: `Fresh and delicious ${foodName}, prepared with high-quality ingredients and cooked to perfection.`,
            isAvailable: true,
            isTrending: Math.random() > 0.8,
            rating: +(4.0 + Math.random() * 0.8).toFixed(1),
            orderCount: Math.floor(Math.random() * 500) + 10,
            popularityScore: Math.floor(Math.random() * 50) + 50,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      });
    });
  });

  // Assign images to restaurants based on their specialization category
  restaurants.forEach((r) => {
    const nameLower = r.name.toLowerCase();
    let cat = 'Veg';
    if (nameLower.includes('biryani')) cat = 'Biryani';
    else if (nameLower.includes('pizza')) cat = 'Pizza';
    else if (nameLower.includes('burger')) cat = 'Burger';
    else if (nameLower.includes('momo')) cat = 'Momos';
    else if (nameLower.includes('sweet') || nameLower.includes('dessert') || nameLower.includes('cake') || nameLower.includes('cravings') || nameLower.includes('treats')) cat = 'Dessert';
    else if (nameLower.includes('rice')) cat = 'Rice';
    else if (nameLower.includes('wok') || nameLower.includes('dragon') || nameLower.includes('chinese') || nameLower.includes('bowl') || nameLower.includes('point')) cat = 'Chinese';
    else if (nameLower.includes('tandoor') || nameLower.includes('tandoori')) cat = 'Roti';
    else if (nameLower.includes('south') || nameLower.includes('dosa') || nameLower.includes('spice') || nameLower.includes('kitchen') || nameLower.includes('flavours')) cat = 'South Indian';
    else if (nameLower.includes('cafe') || nameLower.includes('aroma') || nameLower.includes('central') || nameLower.includes('street') || nameLower.includes('delight')) cat = 'Beverages';

    const matchingItem = menuItems.find(item => item.category === cat && item.restaurant.toString() === r._id.toString());
    if (matchingItem) {
      r.image = matchingItem.image;
      r.bannerImage = matchingItem.image;
    } else {
      const fallbackItem = menuItems.find(item => item.category === cat);
      if (fallbackItem) {
        r.image = fallbackItem.image;
        r.bannerImage = fallbackItem.image;
      } else {
        r.image = '/images/sweetcorn Pizza.avif';
        r.bannerImage = '/images/sweetcorn Pizza.avif';
      }
    }
  });
  
  // Read other data files and apply limits where needed
  const allCategories = readJson('categories.json').map(convertIds);
  const categories = allCategories.slice(0, 10); // Limit to 10 categories
  
  const coupons = readJson('coupons.json').map(convertIds);
  
  // Create a small subset of reviews for demo purposes
  const allReviews = readJson('reviews.json').map(convertIds);
  const demoReviews = allReviews.slice(0, 5); // Just a few demo reviews
  
  // Create demo users for the demo reviews
  const users = usersFromReviews(demoReviews, restaurants);

  await clearCollections(db);

  await db.collection(collections.users).insertMany(users, { ordered: false });
  await db.collection(collections.restaurants).insertMany(restaurants, { ordered: false });
  await db.collection(collections.menuItems).insertMany(menuItems, { ordered: false });
  await db.collection(collections.reviews).insertMany(demoReviews, { ordered: false });
  await db.collection(collections.coupons).insertMany(coupons, { ordered: false });
  await db.collection(collections.categories).insertMany(categories, { ordered: false });

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
  console.log(`Reviews: ${demoReviews.length}`);
  console.log(`Coupons: ${coupons.length}`);
  console.log(`Categories: ${categories.length}`);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});