import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..');
const dataDir = path.join(serverRoot, 'data');

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

const restaurantsByCity = {
  Delhi: [
    'Delhi Darbar', 'Punjab Grill', 'Tandoori Junction', 'Mughal Feast',
    'Spice Empire', 'Curry Palace', 'Royal Tandoor', 'North Spice Kitchen',
    'Capital Biryani', 'Delhi Street Kitchen', 'Urban Curry House', 'Chaat Bazaar',
    'Butter Chicken Co.', 'Roti & Curry', 'Nawabi Flavors'
  ],
  Mumbai: [
    'Mumbai Street Kitchen', 'Bombay Biryani House', 'Marine Drive Cafe', 'Vada Pav Express',
    'Mumbai Masala', 'Gateway Grill', 'Spice Route Mumbai', 'Coastal Curry',
    'Bombay Food Factory', 'Mumbai Tadka', 'Chai & Snacks', 'City Bites',
    'Food Junction', 'Maharashtra Darbar', 'Bollywood Bites'
  ],
  Bangalore: [
    'Bangalore Biryani Club', 'Koshy\'s Corner', 'MTR Heritage', 'Nagarjuna Flavors',
    'Koramangala Kitchen', 'Vidyarthi Bhavan Delights', 'Curry & Rice Bangalore', 'Garden City Bistro',
    'Silk Board Express', 'Kannada Feast', 'Coastal Karnataka', 'Indiranagar Grill',
    'Tech Park Bites', 'Nandi Hills Cafe', 'Filter Coffee & More'
  ],
  Hyderabad: [
    'Paradise Heritage', 'Bawarchi Palace', 'Cafe Bahar', 'Shah Ghouse Dum Biryani',
    'Biryani Wala', 'Hyderabad Spice', 'Deccan Pavilion', 'Charminar Street Food',
    'Nizami Feast', 'Kakatiya Mess', 'Rayalaseema Ruchulu', 'Telangana Spice',
    'Gachibowli Grill', 'Jubilee Bistro', 'Madhapur Masala'
  ],
  Pune: [
    'Pune Parsi Cafe', 'Shabree Maharashtrian', 'Vaishali Delights', 'Goodluck Cafe Heritage',
    'Durvankur Dining Hall', 'Pune Spice Junction', 'Deccan Gymkhana Eats', 'Deccan Queen Cafe',
    'Maratha Feast', 'Koregaon Park Grill', 'Viman Nagar Bistro', 'Baner Curry House',
    'Kothrud Kitchen', 'Pune Street Chaat', 'Camp Biryani House'
  ],
  Chennai: [
    'Saravana Bhavan Delights', 'Murugan Idli Shop', 'Anjappar Chettinad', 'Ponnusamy Heritage',
    'Mylapore Filter Coffee', 'Chennai Curry Co.', 'Marina Beach Grill', 'Adyar Ananda Bhavan',
    'Sangeetha Veg', 'Karaikudi Spice', 'Dakshin Feast', 'Madras Masala',
    'Namma Chennai Bistro', 'T-Nagar Biryani', 'East Coast Cafe'
  ],
  Kolkata: [
    'Peter Cat Heritage', 'Flurys Corner', 'Aminia Biryani', 'Arsalan Palace',
    'Bhojohori Manna', 'Kusum Rolls', 'Kolkata Street Chaat', 'Howrah Bridge Grill',
    'Royal Indian Hotel', 'Oudh 1590 Feast', 'Sonar Bangla Kitchen', 'Park Street Bistro',
    'Macher Jhol Co.', 'Sweet Bengal Desserts', 'Bengali Spice'
  ]
};

const cityLocalities = {
  Delhi: [
    { area: 'Connaught Place', pincode: '110001', lat: 28.6304, lng: 77.2177, state: 'Delhi' },
    { area: 'South Extension', pincode: '110049', lat: 28.5683, lng: 77.2198, state: 'Delhi' },
    { area: 'Karol Bagh', pincode: '110005', lat: 28.6508, lng: 77.1915, state: 'Delhi' },
    { area: 'Hauz Khas', pincode: '110016', lat: 28.5494, lng: 77.2044, state: 'Delhi' },
    { area: 'Dwarka', pincode: '110075', lat: 28.5861, lng: 77.0589, state: 'Delhi' }
  ],
  Mumbai: [
    { area: 'Bandra West', pincode: '400050', lat: 19.0596, lng: 72.8295, state: 'Maharashtra' },
    { area: 'Andheri West', pincode: '400053', lat: 19.1363, lng: 72.8277, state: 'Maharashtra' },
    { area: 'Colaba', pincode: '400005', lat: 18.9067, lng: 72.8147, state: 'Maharashtra' },
    { area: 'Worli', pincode: '400018', lat: 19.0178, lng: 72.8172, state: 'Maharashtra' },
    { area: 'Powai', pincode: '400076', lat: 19.1176, lng: 72.9060, state: 'Maharashtra' }
  ],
  Bangalore: [
    { area: 'Indiranagar', pincode: '560038', lat: 12.9719, lng: 77.6412, state: 'Karnataka' },
    { area: 'Koramangala', pincode: '560034', lat: 12.9352, lng: 77.6245, state: 'Karnataka' },
    { area: 'Jayanagar', pincode: '560041', lat: 12.9299, lng: 77.5824, state: 'Karnataka' },
    { area: 'Whitefield', pincode: '560066', lat: 12.9698, lng: 77.7499, state: 'Karnataka' },
    { area: 'Malleshwaram', pincode: '560003', lat: 13.0031, lng: 77.5701, state: 'Karnataka' }
  ],
  Hyderabad: [
    { area: 'Banjara Hills', pincode: '500034', lat: 17.4126, lng: 78.4482, state: 'Telangana' },
    { area: 'Jubilee Hills', pincode: '500033', lat: 17.4326, lng: 78.4071, state: 'Telangana' },
    { area: 'Gachibowli', pincode: '500032', lat: 17.4401, lng: 78.3489, state: 'Telangana' },
    { area: 'Madhapur', pincode: '500081', lat: 17.4484, lng: 78.3915, state: 'Telangana' },
    { area: 'Hitech City', pincode: '500081', lat: 17.4435, lng: 78.3772, state: 'Telangana' }
  ],
  Pune: [
    { area: 'Koregaon Park', pincode: '411001', lat: 18.5362, lng: 73.8930, state: 'Maharashtra' },
    { area: 'Kothrud', pincode: '411038', lat: 18.5074, lng: 73.8077, state: 'Maharashtra' },
    { area: 'Viman Nagar', pincode: '411014', lat: 18.5679, lng: 73.9143, state: 'Maharashtra' },
    { area: 'Baner', pincode: '411045', lat: 18.5590, lng: 73.7797, state: 'Maharashtra' },
    { area: 'Hinjewadi', pincode: '411057', lat: 18.5913, lng: 73.7389, state: 'Maharashtra' }
  ],
  Chennai: [
    { area: 'Nungambakkam', pincode: '600034', lat: 13.0569, lng: 80.2425, state: 'Tamil Nadu' },
    { area: 'Mylapore', pincode: '600004', lat: 13.0330, lng: 80.2685, state: 'Tamil Nadu' },
    { area: 'T-Nagar', pincode: '600017', lat: 13.0418, lng: 80.2341, state: 'Tamil Nadu' },
    { area: 'Adyar', pincode: '600020', lat: 13.0012, lng: 80.2565, state: 'Tamil Nadu' },
    { area: 'Velachery', pincode: '600042', lat: 12.9796, lng: 80.2223, state: 'Tamil Nadu' }
  ],
  Kolkata: [
    { area: 'Park Street', pincode: '700016', lat: 22.5484, lng: 88.3560, state: 'West Bengal' },
    { area: 'Salt Lake', pincode: '700091', lat: 22.5804, lng: 88.4173, state: 'West Bengal' },
    { area: 'Ballygunge', pincode: '700019', lat: 22.5278, lng: 88.3658, state: 'West Bengal' },
    { area: 'Gariahat', pincode: '700029', lat: 22.5186, lng: 88.3683, state: 'West Bengal' },
    { area: 'Howrah', pincode: '711101', lat: 22.5958, lng: 88.2636, state: 'West Bengal' }
  ]
};

const categoryAssets = [
  { name: 'Biryani', icon: 'bowl-food', image: '/images/categories/biryani.jpg', slug: 'biryani' },
  { name: 'North Indian', icon: 'curry', image: '/images/categories/north-indian.jpg', slug: 'north-indian' },
  { name: 'South Indian', icon: 'dosa', image: '/images/categories/south-indian.jpg', slug: 'south-indian' },
  { name: 'Chinese', icon: 'noodles', image: '/images/categories/chinese.jpg', slug: 'chinese' },
  { name: 'Street Food', icon: 'street-food', image: '/images/categories/street-food.jpg', slug: 'street-food' },
  { name: 'Fast Food', icon: 'fries', image: '/images/categories/fast-food.jpg', slug: 'fast-food' },
  { name: 'Pizza', icon: 'pizza', image: '/images/categories/pizza.jpg', slug: 'pizza' },
  { name: 'Burger', icon: 'burger', image: '/images/categories/burger.jpg', slug: 'burger' },
  { name: 'Rolls', icon: 'rolls', image: '/images/categories/rolls.jpg', slug: 'rolls' },
  { name: 'Sandwiches', icon: 'sandwich', image: '/images/categories/sandwiches.jpg', slug: 'sandwiches' },
  { name: 'Momos', icon: 'momos', image: '/images/categories/momos.jpg', slug: 'momos' },
  { name: 'Healthy Bowls', icon: 'healthy-bowls', image: '/images/categories/healthy-bowls.jpg', slug: 'healthy-bowls' },
  { name: 'Salads', icon: 'salads', image: '/images/categories/salads.jpg', slug: 'salads' },
  { name: 'Protein Meals', icon: 'protein-meals', image: '/images/categories/protein-meals.jpg', slug: 'protein-meals' },
  { name: 'Keto Meals', icon: 'keto-meals', image: '/images/categories/keto-meals.jpg', slug: 'keto-meals' },
  { name: 'Vegan Meals', icon: 'vegan-meals', image: '/images/categories/vegan-meals.jpg', slug: 'vegan-meals' },
  { name: 'Jain Food', icon: 'jain-food', image: '/images/categories/jain-food.jpg', slug: 'jain-food' },
  { name: 'Breakfast', icon: 'breakfast', image: '/images/categories/breakfast.jpg', slug: 'breakfast' },
  { name: 'Lunch Specials', icon: 'lunch-specials', image: '/images/categories/lunch-specials.jpg', slug: 'lunch-specials' },
  { name: 'Dinner Combos', icon: 'dinner-combos', image: '/images/categories/dinner-combos.jpg', slug: 'dinner-combos' },
  { name: 'Desserts', icon: 'cake', image: '/images/categories/desserts.jpg', slug: 'desserts' },
  { name: 'Ice Creams', icon: 'ice-creams', image: '/images/categories/ice-creams.jpg', slug: 'ice-creams' },
  { name: 'Beverages', icon: 'cup-soda', image: '/images/categories/beverages.jpg', slug: 'beverages' },
  { name: 'Fresh Juices', icon: 'fresh-juices', image: '/images/categories/fresh-juices.jpg', slug: 'fresh-juices' },
  { name: 'Milkshakes', icon: 'milkshakes', image: '/images/categories/milkshakes.jpg', slug: 'milkshakes' },
  { name: 'Smoothies', icon: 'smoothies', image: '/images/categories/smoothies.jpg', slug: 'smoothies' },
  { name: 'Coffee', icon: 'coffee', image: '/images/categories/coffee.jpg', slug: 'coffee' },
  { name: 'Tea', icon: 'tea', image: '/images/categories/tea.jpg', slug: 'tea' },
  { name: 'Energy Drinks', icon: 'energy-drinks', image: '/images/categories/energy-drinks.jpg', slug: 'energy-drinks' },
  { name: 'Protein Shakes', icon: 'protein-shakes', image: '/images/categories/protein-shakes.jpg', slug: 'protein-shakes' }
];

const categorySlugMap = {
  'Biryani': 'biryani',
  'North Indian': 'north-indian',
  'South Indian': 'south-indian',
  'Chinese': 'chinese',
  'Street Food': 'street-food',
  'Fast Food': 'fast-food',
  'Pizza': 'pizza',
  'Burger': 'burger',
  'Rolls': 'rolls',
  'Sandwiches': 'sandwiches',
  'Momos': 'momos',
  'Healthy Bowls': 'healthy',
  'Salads': 'healthy',
  'Protein Meals': 'healthy',
  'Keto Meals': 'healthy',
  'Vegan Meals': 'healthy',
  'Jain Food': 'jain',
  'Breakfast': 'breakfast',
  'Lunch Specials': 'lunch',
  'Dinner Combos': 'dinner',
  'Desserts': 'desserts',
  'Ice Creams': 'desserts',
  'Beverages': 'beverages',
  'Fresh Juices': 'beverages',
  'Milkshakes': 'beverages',
  'Smoothies': 'beverages',
  'Coffee': 'beverages',
  'Tea': 'beverages',
  'Energy Drinks': 'beverages',
  'Protein Shakes': 'beverages'
};

const dishCatalog = {
  'Biryani': [
    ['Hyderabadi Chicken Dum Biryani', false, ['Basmati Rice', 'Chicken', 'Saffron', 'Yogurt', 'Fried Onion', 'Biryani Masala'], 'Main Course', 279, []],
    ['Lucknowi Mutton Biryani', false, ['Basmati Rice', 'Mutton', 'Kewra Water', 'Spices', 'Ghee'], 'Main Course', 349, []],
    ['Paneer Tikka Biryani', true, ['Basmati Rice', 'Paneer Tikka', 'Spices', 'Mint', 'Yogurt'], 'Main Course', 249, []],
    ['Egg Biryani', false, ['Basmati Rice', 'Boiled Egg', 'Fried Onion', 'Biryani Masala'], 'Main Course', 219, []],
    ['Kolkata Chicken Biryani', false, ['Basmati Rice', 'Chicken', 'Potato', 'Boiled Egg', 'Spices'], 'Main Course', 289, []],
    ['Veg Dum Biryani', true, ['Basmati Rice', 'Carrot', 'Beans', 'Paneer', 'Saffron', 'Mint'], 'Main Course', 229, []],
    ['Thalassery Biryani', false, ['Kaima Rice', 'Chicken', 'Cashew Nuts', 'Raisins', 'Ghee', 'Spices'], 'Main Course', 259, []]
  ],
  'North Indian': [
    ['Butter Chicken Masala', false, ['Chicken Tikka', 'Tomato', 'Cream', 'Butter', 'Kasoori Methi'], 'Main Course', 329, []],
    ['Paneer Butter Masala', true, ['Paneer', 'Tomato', 'Cream', 'Butter', 'Kasoori Methi'], 'Main Course', 269, []],
    ['Dal Makhani', true, ['Black Urad Dal', 'Rajma', 'Butter', 'Cream', 'Spices'], 'Main Course', 219, []],
    ['Kadhai Paneer', true, ['Paneer', 'Capsicum', 'Onion', 'Kadhai Masala'], 'Main Course', 259, []],
    ['Murgh Lababdar', false, ['Chicken', 'Onion Tomato Gravy', 'Cream', 'Cheese'], 'Main Course', 319, []],
    ['Aloo Gobhi Adraki', true, ['Potato', 'Cauliflower', 'Ginger', 'Spices'], 'Main Course', 189, []],
    ['Palak Paneer', true, ['Paneer', 'Spinach', 'Garlic', 'Spices', 'Cream'], 'Main Course', 249, []],
    ['Malai Kofta', true, ['Paneer Potato Balls', 'Cashew Cream Onion Gravy', 'Spices'], 'Main Course', 279, []]
  ],
  'South Indian': [
    ['Masala Dosa', true, ['Rice Batter', 'Potato Masala', 'Ghee', 'Chutney', 'Sambar'], 'Main Course', 120, []],
    ['Mysore Masala Dosa', true, ['Rice Batter', 'Red Spicy Chutney', 'Potato Masala', 'Ghee'], 'Main Course', 130, []],
    ['Ghee Podi Idli', true, ['Idli', 'Ghee', 'Podi Spice Mix', 'Coconut Chutney'], 'Snack', 99, []],
    ['Onion Uttapam', true, ['Rice Batter', 'Onion', 'Green Chilli', 'Curry Leaves'], 'Main Course', 115, []],
    ['Rava Onion Masala Dosa', true, ['Semolina Batter', 'Onion', 'Potato Masala', 'Ghee'], 'Main Course', 140, []],
    ['Coorg Chicken Curry', false, ['Chicken', 'Coconut Milk', 'Coorg Masala', 'Curry Leaves'], 'Main Course', 289, []]
  ],
  'Chinese': [
    ['Veg Hakka Noodles', true, ['Noodles', 'Cabbage', 'Capsicum', 'Onion', 'Soy Sauce'], 'Main Course', 189, []],
    ['Chicken Fried Rice', false, ['Rice', 'Chicken', 'Egg', 'Soy Sauce', 'Spring Onion'], 'Main Course', 229, []],
    ['Gobi Manchurian Dry', true, ['Cauliflower Florets', 'Soy Sauce', 'Ginger', 'Garlic', 'Spring Onion'], 'Starter', 199, []],
    ['Chilli Paneer Gravy', true, ['Paneer', 'Capsicum', 'Onion', 'Chilli Sauce', 'Soy Sauce'], 'Main Course', 239, []],
    ['Chicken Manchurian', false, ['Chicken', 'Garlic', 'Soy Sauce', 'Green Chillies', 'Spring Onion'], 'Main Course', 249, []],
    ['Schezwan Noodles Veg', true, ['Noodles', 'Schezwan Sauce', 'Mix Veggies', 'Garlic'], 'Main Course', 199, []]
  ],
  'Street Food': [
    ['Delhi Style Pani Puri', true, ['Puri', 'Spiced Water', 'Sweet Tamarind Chutney', 'Potato Chickpea filling'], 'Snack', 69, []],
    ['Mumbai Vada Pav', true, ['Pav', 'Potato Vada', 'Garlic Chutney', 'Green Chilli'], 'Snack', 49, []],
    ['Samosa Chaat', true, ['Samosa', 'Chole Curry', 'Yogurt', 'Tamarind Mint Chutney', 'Sev'], 'Snack', 89, []],
    ['Dahi Puri', true, ['Puri', 'Boiled Potato', 'Sweet Yogurt', 'Sev', 'Tamarind Chutney'], 'Snack', 99, []],
    ['Pav Bhaji', true, ['Bhaji', 'Butter Pav', 'Onion', 'Lemon'], 'Main Course', 129, []],
    ['Bhel Puri', true, ['Puffed Rice', 'Onion', 'Tomato', 'Tamarind Mint Chutney', 'Sev'], 'Snack', 79, []]
  ],
  'Fast Food': [
    ['Classic French Fries', true, ['Potato', 'Salt'], 'Snack', 99, []],
    ['Peri Peri French Fries', true, ['Potato', 'Peri Peri Seasoning', 'Salt'], 'Snack', 119, []],
    ['Crispy Chicken Strips', false, ['Chicken Strips', 'Breadcrumbs', 'Spices'], 'Snack', 179, []],
    ['Cheesy Loaded Fries', true, ['Potato Fries', 'Cheese Sauce', 'Jalapenos'], 'Snack', 149, []],
    ['Veg Spring Rolls', true, ['Pastry Wrapper', 'Cabbage', 'Carrot', 'Spring Onion', 'Glass Noodles'], 'Snack', 129, []]
  ],
  'Pizza': [
    ['Double Cheese Margherita Pizza', true, ['Pizza Base', 'Extra Mozzarella', 'Tomato Sauce', 'Basil'], 'Main Course', 219, []],
    ['Farmhouse Fresh Veggie Pizza', true, ['Pizza Base', 'Capsicum', 'Onion', 'Tomato', 'Mushroom', 'Cheese'], 'Main Course', 299, []],
    ['Spicy Paneer Tikka Pizza', true, ['Pizza Base', 'Paneer Tikka', 'Onion', 'Green Chilli', 'Cheese'], 'Main Course', 329, []],
    ['Fiery Chicken Pepperoni Pizza', false, ['Pizza Base', 'Chicken Pepperoni', 'Mozzarella', 'Tomato Sauce'], 'Main Course', 379, []],
    ['Tandoori Chicken Pizza', false, ['Pizza Base', 'Chicken Tikka', 'Red Onion', 'Capsicum', 'Mozzarella'], 'Main Course', 359, []],
    ['Jain Cheese Pizza', true, ['Pizza Base', 'Tomato Sauce', 'Mozzarella', 'Oregano'], 'Main Course', 229, ['Jain']]
  ],
  'Burger': [
    ['Aloo Tikki Burger', true, ['Burger Bun', 'Potato Patty', 'Tomato', 'Onion', 'Mayo'], 'Main Course', 89, []],
    ['Crispy Spicy Chicken Burger', false, ['Burger Bun', 'Chicken Breast Patty', 'Lettuce', 'Spicy Mayo'], 'Main Course', 179, []],
    ['Double Cheese Paneer Burger', true, ['Burger Bun', 'Paneer Patty', 'Cheese Slices', 'Lettuce', 'Sauce'], 'Main Course', 169, []],
    ['Veg Maharaja Mac Burger', true, ['Burger Bun', 'Double Veg Patty', 'Lettuce', 'Cheese', 'Special Sauce'], 'Main Course', 199, []],
    ['Grilled Chicken Breast Burger', false, ['Burger Bun', 'Grilled Chicken', 'Lettuce', 'Tomato', 'Mayo'], 'Main Course', 189, []]
  ],
  'Rolls': [
    ['Double Chicken Kathi Roll', false, ['Paratha', 'Chicken Tikka', 'Onion', 'Mint Chutney', 'Egg wrap'], 'Main Course', 179, []],
    ['Paneer Tikka Kathi Roll', true, ['Paratha', 'Paneer Tikka', 'Onion', 'Capsicum', 'Mint Chutney'], 'Main Course', 149, []],
    ['Single Egg Roll', false, ['Paratha', 'Egg', 'Onion', 'Green Chilli', 'Sauce'], 'Main Course', 89, []],
    ['Masala Potato Kathi Roll', true, ['Paratha', 'Spiced Potato Patty', 'Onion', 'Tamarind Sauce'], 'Main Course', 99, []],
    ['Mutton Seekh Roll', false, ['Paratha', 'Mutton Seekh Kebab', 'Onion', 'Mint Chutney'], 'Main Course', 209, []]
  ],
  'Sandwiches': [
    ['Bombay Grilled Club Sandwich', true, ['Bread', 'Potato', 'Cucumber', 'Tomato', 'Cheese', 'Mint Chutney'], 'Snack', 139, []],
    ['Chicken Club Sandwich', false, ['Bread', 'Shredded Chicken', 'Mayo', 'Egg', 'Tomato', 'Cheese'], 'Snack', 189, []],
    ['Paneer Tikka Grilled Sandwich', true, ['Bread', 'Paneer Tikka', 'Onion', 'Capsicum', 'Mint Chutney'], 'Snack', 159, []],
    ['Cheese Corn Toast Sandwich', true, ['Bread', 'Sweet Corn', 'Mozzarella Cheese', 'Butter'], 'Snack', 129, []],
    ['Healthy Veg Avocado Sandwich', true, ['Whole Wheat Bread', 'Avocado Slice', 'Tomato', 'Cucumber', 'Lettuce'], 'Snack', 179, ['Weight Loss']]
  ],
  'Momos': [
    ['Steamed Veg Momos', true, ['Refined Flour', 'Cabbage', 'Carrot', 'Onion', 'Momo Chutney'], 'Snack', 119, []],
    ['Steamed Chicken Momos', false, ['Refined Flour', 'Minced Chicken', 'Onion', 'Momo Chutney'], 'Snack', 149, []],
    ['Fried Paneer Momos', true, ['Refined Flour', 'Paneer filling', 'Spices', 'Spicy Dip'], 'Snack', 139, []],
    ['Tandoori Chicken Momos', false, ['Refined Flour', 'Chicken filling', 'Tandoori Masala marinade'], 'Snack', 169, []],
    ['Chilli Garlic Schezwan Momos', true, ['Refined Flour', 'Mix Veggies', 'Schezwan Sauce', 'Garlic'], 'Snack', 139, []]
  ],
  'Healthy Bowls': [
    ['Grilled Chicken Protein Bowl', false, ['Grilled Chicken Breast', 'Brown Rice', 'Broccoli', 'Egg White', 'Avocado Dressing'], 'Main Course', 249, ['High Protein', 'Muscle Gain']],
    ['Paneer Protein Bowl', true, ['Low Fat Paneer', 'Quinoa', 'Sautéed Spinach', 'Chickpeas', 'Olive Oil'], 'Main Course', 229, ['High Protein']],
    ['Vegan Buddha Bowl', true, ['Tofu', 'Brown Rice', 'Kale', 'Chickpeas', 'Tahini Dressing'], 'Main Course', 219, ['Vegan']],
    ['Keto Chicken Bowl', false, ['Chicken Breast', 'Avocado', 'Broccoli', 'Olives', 'Olive Oil', 'Butter'], 'Main Course', 259, ['Keto', 'High Protein', 'Muscle Gain']],
    ['Keto Paneer Bowl', true, ['Low Fat Paneer', 'Avocado', 'Sautéed Asparagus', 'Almonds', 'Butter'], 'Main Course', 239, ['Keto']]
  ],
  'Salads': [
    ['Sprouts Salad', true, ['Moong Sprouts', 'Onion', 'Tomato', 'Lemon juice', "Coriander"], 'Snack', 99, ['Weight Loss', 'Vegan']],
    ['Greek Salad', true, ['Lettuce', 'Cucumber', 'Feta Cheese', 'Olives', 'Olive Oil Dressing'], 'Snack', 149, ['Weight Loss']],
    ['Egg Avocado Salad', false, ['Boiled Eggs', 'Avocado', 'Lettuce', 'Cherry Tomatoes', 'Lemon Dressing'], 'Snack', 179, ['Keto', 'High Protein']],
    ['Chicken Salad', false, ['Grilled Chicken', 'Lettuce', 'Cucumber', 'Onion', 'Vinaigrette Dressing'], 'Snack', 199, ['High Protein', 'Weight Loss']],
    ['Paneer Garden Green Salad', true, ['Paneer Cubes', 'Lettuce', 'Bell Peppers', 'Olives', 'Low-fat Dressing'], 'Snack', 179, ['High Protein']]
  ],
  'Protein Meals': [
    ['Double Paneer High Protein Meal', true, ['Double Paneer Tikka', 'Sautéed Veggies', 'Dal Tadka (No Cream)'], 'Main Course', 279, ['High Protein', 'Muscle Gain']],
    ['Egg Protein Wrap', false, ['Whole Wheat Tortilla', '4 Egg Whites', 'Onion Tomato Salad', 'Low Fat Cheese'], 'Main Course', 159, ['High Protein']],
    ['Soya Chunk Protein Thali', true, ['Soya Chunk Curry', 'Brown Rice', 'Dal Tadka', 'Cucumber Raita'], 'Main Course', 189, ['High Protein']],
    ['Grilled Chicken Breast and Broccoli Meal', false, ['Grilled Chicken Breast', 'Steamed Broccoli', 'Sweet Potato', 'Olive Oil'], 'Main Course', 289, ['High Protein', 'Muscle Gain']],
    ['Fish Protein Curry with Quinoa', false, ['Reeve Fish', 'Spiced Tomato Gravy', 'Quinoa', 'Asparagus'], 'Main Course', 329, ['High Protein']]
  ],
  'Keto Meals': [
    ['Keto Butter Chicken', false, ['Chicken', 'Butter Cream Gravy (No Sugar)', 'Sautéed Cauliflower Rice'], 'Main Course', 329, ['Keto']],
    ['Keto Paneer Makhani', true, ['Paneer', 'Cream Tomato Sauce', 'Cauliflower Rice'], 'Main Course', 279, ['Keto']],
    ['Keto Egg Bhurji', false, ['3 Eggs', 'Butter', 'Green Chilli', 'Tomato', 'Coriander'], 'Breakfast', 129, ['Keto']],
    ['Keto Avocado Egg Salad', false, ['Eggs', 'Avocado', 'Olive Oil', 'Mayonnaise', 'Chives'], 'Snack', 189, ['Keto', 'High Protein']],
    ['Keto Sautéed Mushroom Bowl', true, ['Button Mushrooms', 'Spinach', 'Garlic', 'Heavy Cream', 'Butter'], 'Main Course', 219, ['Keto']]
  ],
  'Vegan Meals': [
    ['Vegan Tofu Wrap', true, ['Whole Wheat Wrap', 'Grilled Tofu', 'Lettuce', 'Hummus', 'Vegan Mayo'], 'Snack', 169, ['Vegan']],
    ['Vegan Chickpea Curry', true, ['Chickpeas', 'Tomato Onion Gravy', 'Brown Rice'], 'Main Course', 179, ['Vegan']],
    ['Vegan Lentil Soup', true, ['Yellow Lentils', 'Spinach', 'Carrot', 'Celery', 'Olive Oil'], 'Starter', 129, ['Vegan']],
    ['Vegan Quinoa Salad', true, ['Quinoa', 'Black Beans', 'Corn', 'Cherry Tomatoes', 'Cilantro Lime Dressing'], 'Snack', 179, ['Vegan', 'Weight Loss']],
    ['Vegan Coconut Milk Chia Pudding', true, ['Chia Seeds', 'Coconut Milk', 'Maple Syrup', 'Fresh Berries'], 'Dessert', 139, ['Vegan']]
  ],
  'Jain Food': [
    ['Jain Paneer Butter Masala', true, ['Paneer', 'Tomato Gravy (No Onion Garlic)', 'Butter', 'Cream'], 'Main Course', 259, ['Jain']],
    ['Jain Dal Fry', true, ['Moong Dal', 'Tomato', 'Ghee', 'Jeera', 'Coriander'], 'Main Course', 169, ['Jain']],
    ['Jain Shahi Paneer', true, ['Paneer', 'Cashew Paste (No Onion Garlic)', 'Saffron', 'Cream'], 'Main Course', 279, ['Jain']],
    ['Jain Veg Pulao', true, ['Basmati Rice', 'Green Peas', 'French Beans', 'Ghee'], 'Main Course', 189, ['Jain']],
    ['Jain Chole Bhature', true, ['Kabuli Chana Curry (No Onion Garlic)', 'Green Peas', 'Bhatura', 'Lemon'], 'Main Course', 199, ['Jain']]
  ],
  'Breakfast': [
    ['Idli Sambar Combo', true, ['3 Steamed Idlis', 'Sambar', 'Coconut Chutney', 'Tomato Chutney'], 'Breakfast', 99, []],
    ['Poha Special', true, ['Flattened Rice', 'Peanuts', 'Onion', 'Mustard Seeds', 'Curry Leaves'], 'Breakfast', 79, []],
    ['Aloo Paratha Combo', true, ['2 Aloo Parathas', 'Butter', 'Yogurt', 'Pickle'], 'Breakfast', 129, []],
    ['Protein Oats', true, ['Rolled Oats', 'Almond Milk', 'Chia Seeds', 'Honey', 'Almonds'], 'Breakfast', 139, ['High Protein', 'Weight Loss', 'Vegan']],
    ['Ghee Podi Masala Dosa', true, ['Rice Batter', 'Potato Masala', 'Ghee', 'Podi Spice Mix', 'Chutney'], 'Breakfast', 149, []]
  ],
  'Lunch Specials': [
    ['Executive Veg Thali', true, ['Paneer Butter Masala', 'Dal Fry', 'Jeera Rice', '3 Roti', 'Salad', 'Raita'], 'Main Course', 229, []],
    ['Executive Non-Veg Thali', false, ['Butter Chicken', 'Dal Fry', 'Jeera Rice', '3 Roti', 'Salad', 'Raita'], 'Main Course', 269, []],
    ['Bengali Fish Thali', false, ['Rohu Fish Curry', 'Dal', 'Basmati Rice', 'Begun Bhaja', 'Chutney'], 'Main Course', 289, []],
    ['Punjabi Kadi Chawal Thali', true, ['Kadi Pakora', 'Basmati Rice', 'Aloo Jeera', 'Papad', 'Salad'], 'Main Course', 199, []],
    ['Gujarati Special Thali', true, ['Dhokla', 'Shaak', 'Dal', 'Rice', 'Rotli', 'Chaas', 'Sweet'], 'Main Course', 249, []]
  ],
  'Dinner Combos': [
    ['Butter Chicken & Garlic Naan Combo', false, ['Butter Chicken (Half)', '2 Garlic Naan', 'Salad'], 'Main Course', 299, []],
    ['Paneer Tikka & Lachha Paratha Combo', true, ['Paneer Tikka Masala', '2 Lachha Parathas', 'Raita'], 'Main Course', 269, []],
    ['Veg Fried Rice & Veg Manchurian Combo', true, ['Veg Fried Rice', 'Veg Manchurian Gravy', 'Kimchi'], 'Main Course', 239, []],
    ['Dal Makhani & Rice Combo', true, ['Dal Makhani', 'Jeera Rice', 'Salad'], 'Main Course', 199, []],
    ['Chicken Biryani & Salan Combo', false, ['Chicken Dum Biryani', 'Mirchi Ka Salan', 'Raita'], 'Main Course', 329, []]
  ],
  'Desserts': [
    ['Gulab Jamun (2 Pcs)', true, ['Khoya Balls', 'Sugar Syrup', 'Cardamom', 'Pistachio garnish'], 'Dessert', 79, []],
    ['Warm Chocolate Brownie', true, ["Cocoa Powder", "Dark Chocolate", "Flour", "Butter"], 'Dessert', 129, []],
    ['Moong Dal Halwa', true, ['Moong Dal', 'Ghee', 'Sugar', 'Milk', 'Dry Fruits'], 'Dessert', 149, []],
    ['Kesar Rasmalai (2 Pcs)', true, ['Milk solids', 'Saffron Milk', 'Pistachio', 'Almonds'], 'Dessert', 119, []],
    ['Shahi Tukda', true, ['Bread Slices', 'Condensed Milk (Rabri)', 'Ghee', 'Saffron', 'Nuts'], 'Dessert', 129, []]
  ],
  'Ice Creams': [
    ['Classic Vanilla Scoop', true, ['Milk', 'Cream', 'Vanilla extract', 'Sugar'], 'Dessert', 69, []],
    ['Rich Chocolate Belgian Scoop', true, ['Milk', 'Belgian Dark Chocolate', 'Cream'], 'Dessert', 89, []],
    ['Real Alphonso Mango Scoop', true, ['Milk', 'Mango Pulp', 'Cream'], 'Dessert', 89, []],
    ['Tender Coconut Scoop', true, ['Milk', 'Tender Coconut Meat', 'Cream'], 'Dessert', 99, []],
    ['Butterscotch Crunch Scoop', true, ['Milk', 'Butterscotch Ribbons', 'Pralines', 'Cream'], 'Dessert', 89, []]
  ],
  'Beverages': [
    ['Coca-Cola Can (330ml)', true, ['Carbonated Water', 'Sugar', 'Caffeine', 'Caramel Color'], 'Snack', 40, []],
    ['Pepsi Aerated Can (330ml)', true, ['Carbonated Water', 'Sugar', 'Caffeine', 'Caramel Color', 'Flavors'], 'Snack', 40, []],
    ['Sprite Lemon-Lime Can (330ml)', true, ['Carbonated Water', 'Sugar', 'Citric Acid', 'Lemon Lime Flavors'], 'Snack', 40, []],
    ['Thums Up Strong Can (330ml)', true, ['Carbonated Water', 'Sugar', 'Caffeine', 'Strong Caramel Color'], 'Snack', 40, []],
    ['Fanta Orange Can (330ml)', true, ['Carbonated Water', 'Sugar', 'Orange Juice Concentrate', 'Acidity Regulators'], 'Snack', 40, []],
    ['Sweet Lassi', true, ['Thick Yogurt', 'Sugar', 'Rose Water', 'Pistachio'], 'Snack', 89, []],
    ['Fresh Lime Soda (Salted/Sweet)', true, ['Lemon juice', 'Soda water', 'Salt/Sugar'], 'Snack', 69, []],
    ['Mango Lassi', true, ['Thick Yogurt', 'Mango Pulp', 'Sugar', 'Cardamom'], 'Snack', 99, []],
    ['Buttermilk (Chaas)', true, ['Yogurt', 'Water', 'Jeera', 'Black Salt', 'Coriander'], 'Snack', 49, []],
    ['Jaljeera Refreshing Drink', true, ['Water', 'Mint Leaves', 'Coriander', 'Lemon Juice', 'Jaljeera Powder'], 'Snack', 59, []]
  ],
  'Fresh Juices': [
    ['Pure Orange Juice', true, ['Fresh Oranges'], 'Snack', 119, ['Weight Loss']],
    ['Watermelon Juice', true, ['Fresh Watermelon', 'Mint leaves'], 'Snack', 99, ['Weight Loss']],
    ['Pineapple Mint Juice', true, ['Fresh Pineapple', 'Mint Leaves', 'Black Salt'], 'Snack', 109, ['Weight Loss']],
    ['Pomegranate Refreshing Juice', true, ['Fresh Pomegranate Seeds', 'Lemon Juice'], 'Snack', 139, []],
    ['Apple Beetroot Carrot (ABC) Juice', true, ['Apple', 'Beetroot', 'Carrot', 'Lemon Juice', 'Ginger'], 'Snack', 149, ['Weight Loss', 'Vegan']]
  ],
  'Milkshakes': [
    ['Classic Strawberry Milkshake', true, ['Milk', 'Strawberry Syrup', 'Ice Cream'], 'Snack', 119, []],
    ['Creamy Chocolate Oreo Milkshake', true, ['Milk', 'Oreo Biscuits', 'Chocolate Sauce', 'Vanilla Ice Cream'], 'Snack', 139, []],
    ['Kesar Pista Dry Fruit Milkshake', true, ['Milk', 'Saffron', 'Pistachios', 'Almonds', 'Cardamom'], 'Snack', 169, []],
    ['Mango Creamy Milkshake', true, ['Milk', 'Fresh Mango Pulp', 'Vanilla Ice Cream'], 'Snack', 139, []],
    ['Vanilla Caramel Milkshake', true, ['Milk', 'Caramel Drizzle', 'Vanilla Bean Extract'], 'Snack', 129, []]
  ],
  'Smoothies': [
    ['Peanut Butter Banana Smoothie', true, ['Banana', 'Peanut Butter', 'Oat Milk', 'Honey'], 'Snack', 149, ['Muscle Gain']],
    ['Mixed Berry Smoothie', true, ['Blueberries', 'Strawberries', 'Greek Yogurt', 'Chia Seeds'], 'Snack', 159, ['Weight Loss']],
    ['Green Detox Spinach Smoothie', true, ['Spinach', 'Green Apple', 'Cucumber', 'Lemon Juice', 'Coconut Water'], 'Snack', 139, ['Weight Loss', 'Vegan']],
    ['Tropical Mango Coconut Smoothie', true, ['Mango Pulp', 'Coconut Milk', 'Pineapple Juice', 'Chia Seeds'], 'Snack', 159, ['Vegan']],
    ['Strawberry Oatmeal Smoothie', true, ['Strawberries', 'Rolled Oats', 'Almond Milk', 'Honey'], 'Snack', 149, ['Weight Loss']]
  ],
  'Coffee': [
    ['Cold Coffee with Vanilla Ice Cream', true, ['Espresso', 'Milk', 'Vanilla Ice Cream', 'Sugar'], 'Snack', 129, []],
    ['Hot Cafe Latte', true, ['Espresso shot', 'Steamed Milk', 'Milk Foam'], 'Snack', 99, []],
    ['South Indian Filter Coffee', true, ['Coffee Decoction', 'Boiled Milk', 'Chicory'], 'Breakfast', 69, []],
    ['Classic Cappuccino', true, ['Espresso Shot', 'Steamed Milk', 'Thick Milk Foam'], 'Snack', 119, []],
    ['Hazelnut Cold Brew', true, ['Cold Brew Coffee', 'Hazelnut Syrup', 'Ice'], 'Snack', 139, []]
  ],
  'Tea': [
    ['Masala Chai', true, ['Tea Leaves', 'Milk', 'Ginger', 'Cardamom', 'Cinnamon', 'Sugar'], 'Breakfast', 39, []],
    ['Organic Green Tea', true, ['Green Tea Leaves', 'Warm Water', 'Lemon', 'Honey'], 'Snack', 49, ['Weight Loss']],
    ['Adrak Elaichi Chai', true, ['Tea Leaves', 'Milk', 'Ginger', 'Cardamom', 'Sugar'], 'Breakfast', 39, []],
    ['Lemon Ginger Honey Tea', true, ['Green Tea', 'Ginger juice', 'Honey', 'Lemon Slice'], 'Snack', 59, ['Weight Loss', 'Vegan']],
    ['Kashmiri Kahwa', true, ['Green Tea', 'Saffron Strands', 'Cinnamon', 'Cardamom', 'Almond Slivers'], 'Snack', 129, []]
  ],
  'Energy Drinks': [
    ['Red Bull Energy Drink', true, ['Caffeine', 'Taurine', 'B-Group Vitamins'], 'Snack', 120, []],
    ['Gatorade Blue Bolt', true, ['Electrolytes', 'Carbohydrates', 'Water'], 'Snack', 60, []],
    ['Monster Energy Drink', true, ['Caffeine', 'Ginseng', 'B Vitamins'], 'Snack', 110, []],
    ['Ocean Active Water', true, ['Vitamins', 'Electrolytes', 'Filtered Water', 'Fruit Flavor'], 'Snack', 55, []],
    ['Glucon-D Instant Energy Drink', true, ['Glucose', 'Calcium', 'Vitamin C', 'Tangy Orange Flavor'], 'Snack', 45, []]
  ],
  'Protein Shakes': [
    ['Double Chocolate Whey Protein Shake', true, ['1 Scoop Chocolate Whey Protein', 'Skimmed Milk', 'Water'], 'Snack', 179, ['High Protein', 'Muscle Gain']],
    ['Protein Shake', true, ['1 Scoop Whey Protein', 'Milk', 'Banana', 'Honey'], 'Snack', 169, ['High Protein', 'Muscle Gain']],
    ['Vegan Soy Protein Shake', true, ['1 Scoop Soy Protein', 'Almond Milk', 'Banana'], 'Snack', 169, ['High Protein', 'Vegan']],
    ['Cookies and Cream Protein Shake', true, ['1 Scoop Whey Protein', 'Skimmed Milk', 'Oreo Biscuit Crumbs'], 'Snack', 189, ['High Protein']],
    ['Peanut Butter Protein oats Shake', true, ['Whey Protein', 'Rolled Oats', 'Peanut Butter', 'Milk', 'Honey'], 'Snack', 199, ['High Protein', 'Muscle Gain']]
  ]
};;

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
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCuisinesForRestaurant(name, rand) {
  const normalized = name.toLowerCase();
  if (normalized.includes('biryani')) return ['Biryani', 'North Indian'];
  if (normalized.includes('grill') || normalized.includes('tandoor') || normalized.includes('darbar') || normalized.includes('mughal') || normalized.includes('feast') || normalized.includes('curry')) {
    return ['North Indian', 'Biryani'];
  }
  if (normalized.includes('idli') || normalized.includes('saravana') || normalized.includes('mtr') || normalized.includes('coffee') || normalized.includes('bhavan')) {
    return ['South Indian', 'Breakfast'];
  }
  if (normalized.includes('chaat') || normalized.includes('street') || normalized.includes('express') || normalized.includes('bazaar')) {
    return ['Street Food', 'Fast Food'];
  }
  if (normalized.includes('cafe') || normalized.includes('bistro') || normalized.includes('flurys')) {
    return ['Desserts', 'Beverages'];
  }
  if (normalized.includes('chinese') || normalized.includes('noodles') || normalized.includes('manchurian')) {
    return ['Chinese', 'Fast Food'];
  }
  const options = [['North Indian', 'Chinese'], ['South Indian', 'Street Food'], ['Biryani', 'North Indian'], ['Pizza', 'Burger', 'Fast Food']];
  return pick(options, rand);
}

function openingHours(rand) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const lateNight = rand() > 0.65;
  return days.map((day) => ({
    day,
    open: lateNight ? '11:00' : '09:00',
    close: lateNight ? '01:00' : '23:00',
    isClosed: false,
  }));
}

function generateNutrients(category, name, isVeg, price, rand) {
  const hasChicken = name.toLowerCase().includes('chicken');
  const hasMutton = name.toLowerCase().includes('mutton');
  const hasEgg = name.toLowerCase().includes('egg');
  const hasPaneer = name.toLowerCase().includes('paneer');
  const hasCheese = name.toLowerCase().includes('cheese');
  const hasTofu = name.toLowerCase().includes('tofu');
  const isProteinShake = category === 'Protein Shakes' || name.toLowerCase().includes('protein shake') || name.toLowerCase().includes('whey');

  let calories = int(250, 600, rand);
  let protein = decimal(3, 12, rand);
  let carbs = decimal(25, 75, rand);
  let fats = decimal(5, 22, rand);
  let fiber = decimal(1, 6, rand);
  let sugar = decimal(0, 10, rand);
  let sodium = int(250, 950, rand);
  let cholesterol = int(5, 45, rand);
  let potassium = int(100, 450, rand);

  if (category === 'Biryani') {
    calories = hasMutton ? int(780, 950, rand) : (hasChicken ? int(650, 850, rand) : int(450, 620, rand));
    protein = hasMutton ? decimal(25, 34, rand) : (hasChicken ? decimal(28, 38, rand) : decimal(8, 18, rand));
    carbs = decimal(75, 110, rand);
    fats = hasMutton ? decimal(28, 42, rand) : (hasChicken ? decimal(20, 32, rand) : decimal(12, 22, rand));
    fiber = decimal(3, 7, rand);
    sugar = decimal(1, 4, rand);
    sodium = int(750, 1200, rand);
    cholesterol = !isVeg ? int(60, 110, rand) : int(10, 25, rand);
    potassium = int(250, 480, rand);
  } else if (category === 'North Indian') {
    calories = hasChicken ? int(450, 650, rand) : (hasPaneer ? int(400, 580, rand) : int(220, 390, rand));
    protein = hasChicken ? decimal(26, 36, rand) : (hasPaneer ? decimal(14, 22, rand) : decimal(6, 14, rand));
    carbs = decimal(15, 45, rand);
    fats = hasChicken ? decimal(20, 38, rand) : (hasPaneer ? decimal(18, 34, rand) : decimal(10, 22, rand));
    fiber = decimal(2, 6, rand);
    sugar = decimal(2, 7, rand);
    sodium = int(600, 1100, rand);
    cholesterol = !isVeg ? int(55, 95, rand) : int(15, 40, rand);
    potassium = int(200, 400, rand);
  } else if (category === 'South Indian') {
    calories = name.toLowerCase().includes('dosa') ? int(280, 420, rand) : int(150, 260, rand);
    protein = decimal(4, 12, rand);
    carbs = decimal(35, 65, rand);
    fats = decimal(4, 14, rand);
    fiber = decimal(2, 5, rand);
    sugar = decimal(1, 4, rand);
    sodium = int(400, 750, rand);
    cholesterol = int(0, 15, rand);
    potassium = int(120, 280, rand);
  } else if (['Healthy Bowls', 'Salads', 'Protein Meals', 'Keto Meals', 'Vegan Meals'].includes(category)) {
    calories = category === 'Salads' ? int(120, 320, rand) : int(320, 580, rand);
    protein = (hasChicken || isProteinShake) ? decimal(25, 42, rand) : ((hasPaneer || hasTofu) ? decimal(16, 26, rand) : decimal(10, 18, rand));
    carbs = category === 'Keto Meals' ? decimal(5, 15, rand) : decimal(15, 55, rand);
    fats = category === 'Keto Meals' ? decimal(18, 38, rand) : decimal(6, 18, rand);
    fiber = decimal(4, 12, rand);
    sugar = decimal(0, 5, rand);
    sodium = int(180, 580, rand);
    cholesterol = isVeg ? int(0, 20, rand) : int(40, 80, rand);
    potassium = int(300, 650, rand);
  } else if (['Beverages', 'Fresh Juices', 'Milkshakes', 'Smoothies', 'Coffee', 'Tea', 'Energy Drinks', 'Protein Shakes'].includes(category)) {
    calories = isProteinShake ? int(220, 380, rand) : (category === 'Milkshakes' ? int(250, 480, rand) : int(40, 180, rand));
    protein = isProteinShake ? decimal(24, 34, rand) : (category === 'Milkshakes' ? decimal(4, 8, rand) : decimal(0, 2, rand));
    carbs = isProteinShake ? decimal(8, 25, rand) : decimal(15, 65, rand);
    fats = category === 'Milkshakes' ? decimal(8, 16, rand) : decimal(0, 5, rand);
    fiber = ['Smoothies', 'Fresh Juices'].includes(category) ? decimal(1, 4, rand) : 0;
    sugar = category === 'Fresh Juices' ? decimal(10, 22, rand) : (category === 'Milkshakes' ? decimal(25, 55, rand) : decimal(0, 15, rand));
    sodium = int(10, 150, rand);
    cholesterol = ['Milkshakes', 'Coffee'].includes(category) ? int(10, 30, rand) : 0;
    potassium = int(80, 350, rand);
  }

  return {
    calories: Math.round(calories),
    protein: Number(protein.toFixed(1)),
    carbs: Number(carbs.toFixed(1)),
    fats: Number(fats.toFixed(1)),
    fiber: Number(fiber.toFixed(1)),
    sugar: Number(sugar.toFixed(1)),
    sodium: Math.round(sodium),
    cholesterol: Math.round(cholesterol),
    potassium: Math.round(potassium)
  };
}

function generateRestaurants() {
  const restaurants = [];
  let index = 0;

  for (const city of cities) {
    const names = restaurantsByCity[city];
    const localities = cityLocalities[city];

    for (let i = 0; i < names.length; i += 1) {
      const name = names[i];
      const rand = seededRandom(`${city}-${name}-${i}`);
      const localityInfo = localities[i % localities.length];
      const cuisines = getCuisinesForRestaurant(name, rand);
      const baseSlug = slugify(name);
      const slug = `${baseSlug}-${city.toLowerCase()}`;

      const rating = decimal(3.8, 4.9, rand);
      const totalRatings = int(100, 6500, rand);
      const priceForOne = int(150, 600, rand);

      const latJitter = decimal(-0.015, 0.015, rand, 6);
      const lngJitter = decimal(-0.015, 0.015, rand, 6);

      const isPureVeg = name.toLowerCase().includes('veg') || name.toLowerCase().includes('bhavan') || name.toLowerCase().includes('sangeetha') || (rand() > 0.7 && !cuisines.includes('Biryani'));
      const featured = rating >= 4.3 && totalRatings > 1000;
      const trending = rating >= 4.1 || rand() > 0.75;

      const rest = {
        _id: objectId(`restaurant-${slug}-${index}`),
        name,
        slug,
        cuisine: cuisines,
        rating,
        totalRatings,
        reviewCount: totalRatings,
        priceForOne,
        description: `${name} is a premier dining destination in ${localityInfo.area}, ${city}, offering authentic ${cuisines.join(' and ')} cuisines prepared with fresh ingredients.`,
        image: `/images/restaurants/${slugify(name)}.jpg`,
        bannerImage: `/images/restaurants/banners/${slugify(name)}-banner.jpg`,
        address: {
          street: `${int(10, 199, rand)}, Main Road, Sector ${int(1, 15, rand)}`,
          city: city,
          state: localityInfo.state,
          pincode: localityInfo.pincode
        },
        city: city,
        locality: localityInfo.area,
        pincode: localityInfo.pincode,
        latitude: Number((localityInfo.lat + latJitter).toFixed(6)),
        longitude: Number((localityInfo.lng + lngJitter).toFixed(6)),
        serviceRadiusKm: int(4, 7, rand),
        isPureVeg,
        isVeg: isPureVeg,
        isOpen: rand() > 0.05,
        deliveryTime: int(20, 50, rand),
        deliveryFee: priceForOne > 300 ? 0 : int(20, 45, rand),
        featured,
        trending,
        tags: [...new Set([...cuisines, featured ? 'Featured' : 'Local Favorite', trending ? 'Trending' : 'Value Pack'])],
        openingHours: openingHours(rand),
        isActive: true,
        createdAt: new Date(Date.UTC(2025, int(0, 11, rand), int(1, 28, rand))).toISOString(),
        updatedAt: new Date(Date.UTC(2026, int(0, 5, rand), int(1, 20, rand))).toISOString()
      };

      restaurants.push(rest);
      index += 1;
    }
  }

  return restaurants;
}

function getSubCategory(category) {
  if (['Beverages', 'Fresh Juices', 'Milkshakes', 'Smoothies', 'Coffee', 'Tea', 'Energy Drinks', 'Protein Shakes'].includes(category)) {
    return 'Beverage';
  }
  if (['Desserts', 'Ice Creams'].includes(category)) {
    return 'Dessert';
  }
  if (['Breakfast'].includes(category)) {
    return 'Breakfast';
  }
  if (['Street Food', 'Fast Food', 'Momos', 'Rolls', 'Sandwiches', 'Salads'].includes(category)) {
    return 'Snack';
  }
  return 'Main Course';
}

function getAllergens(name) {
  const lower = name.toLowerCase();
  const allergens = [];
  if (lower.includes('cheese') || lower.includes('paneer') || lower.includes('milk') || lower.includes('butter') || lower.includes('cream') || lower.includes('lassi') || lower.includes('yogurt') || lower.includes('shake')) {
    allergens.push('Dairy');
  }
  if (lower.includes('naan') || lower.includes('roti') || lower.includes('pizza') || lower.includes('burger') || lower.includes('sandwich') || lower.includes('noodles') || lower.includes('momos') || lower.includes('pasta')) {
    allergens.push('Gluten');
  }
  if (lower.includes('cashew') || lower.includes('almond') || lower.includes('walnut') || lower.includes('nut') || lower.includes('peanut')) {
    allergens.push('Nuts');
  }
  if (lower.includes('egg')) {
    allergens.push('Eggs');
  }
  if (lower.includes('soya') || lower.includes('tofu')) {
    allergens.push('Soy');
  }
  return allergens;
}

const superGroupPhotoIds = {
  biryani: [
    'photo-1563379091339-03b21ab4a4f8',
    'photo-1633945274405-b6c8069047b0',
    'photo-1626777552726-4a6b54c97e46',
    'photo-1589302168068-964664d93dc0',
    'photo-1642821373181-696a54913e93',
    'photo-1631515243349-e0cb75fb8d3a',
    'photo-1601050690597-df056fb4ce78',
    'photo-1626509653594-319052d9a6c6'
  ],
  north_indian: [
    'photo-1603894584373-5ac82b2ae398',
    'photo-1631452180519-c014fe946bc7',
    'photo-1546833999-b9f581a1996d',
    'photo-1565557623262-b51c2513a641',
    'photo-1588166524941-3bf61a9c41db',
    'photo-1626200419199-391ae4be7a40',
    'photo-1613292443284-8d10ef9383fe',
    'photo-1589301760014-d929f3979dbc'
  ],
  south_indian: [
    'photo-1668236543090-82eba5ee5976',
    'photo-1626132647523-66f5bf380027',
    'photo-1589301760014-d929f3979dbc',
    'photo-1601050690597-df056fb4ce78',
    'photo-1630383249896-424e482df921',
    'photo-1610192244261-3f33de3f55e4',
    'photo-1626509653594-319052d9a6c6',
    'photo-1589302168068-964664d93dc0'
  ],
  chinese: [
    'photo-1585032226651-759b368d7246',
    'photo-1512058564366-18510be2db19',
    'photo-1525755662778-989d0524087e',
    'photo-1563245372-f21724e3856d',
    'photo-1603133872878-a36417e02a5c',
    'photo-1623341214825-9f4f963727da',
    'photo-1541832676-9b763b0239ab',
    'photo-1552590635-27c2c2128b15'
  ],
  street_food: [
    'photo-1601050690597-df056fb4ce78',
    'photo-1626132647523-66f5bf380027',
    'photo-1589301760014-d929f3979dbc',
    'photo-1606491956689-2ea866880c84',
    'photo-1501443762994-82bd5dace89a',
    'photo-1546833999-b9f581a1996d',
    'photo-1613292443284-8d10ef9383fe',
    'photo-1633945274405-b6c8069047b0'
  ],
  fast_food: [
    'photo-1573080496219-bb080dd4f877',
    'photo-1576107232684-1279f390859f',
    'photo-1562967914-608f82629710',
    'photo-1585109649139-366815a0d713',
    'photo-1544025162-d76694265947',
    'photo-1608897013039-887f21d8c804',
    'photo-1534422298391-e4f8c172dddb',
    'photo-1565299585323-38d6b0865b47'
  ],
  pizza: [
    'photo-1513104890138-7c749659a591',
    'photo-1571066811602-71683a3f680d',
    'photo-1534308983496-4fabb1a015ee',
    'photo-1590947132387-155cc02f3212',
    'photo-1565299624946-b28f40a0ae38',
    'photo-1628840042765-356cda07504e',
    'photo-1544982503-9f984c14501a',
    'photo-1593560708920-61dd98c46a4e'
  ],
  burger: [
    'photo-1568901346375-23c9450c58cd',
    'photo-1572802419224-296b0aedd037',
    'photo-1586190848861-99aa4a171e90',
    'photo-1550547660-d9450f859349',
    'photo-1525059696034-4967a8e1dca2',
    'photo-1551024709-8f23befc6f87',
    'photo-1582196016295-f8c894d38254',
    'photo-1568901346375-23c9450c58cd'
  ],
  rolls: [
    'photo-1626132647523-66f5bf380027',
    'photo-1668236543090-82eba5ee5976',
    'photo-1601050690597-df056fb4ce78',
    'photo-1589301760014-d929f3979dbc',
    'photo-1633945274405-b6c8069047b0',
    'photo-1610192244261-3f33de3f55e4',
    'photo-1626509653594-319052d9a6c6',
    'photo-1544025162-d76694265947'
  ],
  sandwiches: [
    'photo-1509722747041-616f39b57569',
    'photo-1554433607-66b5eed9d304',
    'photo-1539252554453-80ab65ce3586',
    'photo-1525351484163-7529414344d8',
    'photo-1540713434306-58fdb6cdeb9a',
    'photo-1484723091739-30a097e8f929',
    'photo-1550547660-d9450f859349',
    'photo-1585238342024-78d387f4a707'
  ],
  momos: [
    'photo-1534422298391-e4f8c172dddb',
    'photo-1625220194771-7ebedd0b70b4',
    'photo-1563245372-f21724e3856d',
    'photo-1541832676-9b763b0239ab',
    'photo-1606491956689-2ea866880c84',
    'photo-1525755662778-989d0524087e',
    'photo-1585032226651-759b368d7246',
    'photo-1623341214825-9f4f963727da'
  ],
  healthy: [
    'photo-1546069901-ba9599a7e63c',
    'photo-1512621776951-a57141f2eefd',
    'photo-1540420773420-3366772f4999',
    'photo-1505576399279-565b52d4ac71',
    'photo-1543339308-43e59d6b73a6',
    'photo-1623428187969-5da2dced5ebf',
    'photo-1490645935967-10de6ba17061',
    'photo-1506084868230-bb9d95c24759'
  ],
  jain: [
    'photo-1631452180519-c014fe946bc7',
    'photo-1546833999-b9f581a1996d',
    'photo-1565557623262-b51c2513a641',
    'photo-1631515243349-e0cb75fb8d3a',
    'photo-1601050690597-df056fb4ce78',
    'photo-1626200419199-391ae4be7a40',
    'photo-1613292443284-8d10ef9383fe',
    'photo-1589301760014-d929f3979dbc'
  ],
  breakfast: [
    'photo-1626132647523-66f5bf380027',
    'photo-1589301760014-d929f3979dbc',
    'photo-1601050690597-df056fb4ce78',
    'photo-1506084868230-bb9d95c24759',
    'photo-1668236543090-82eba5ee5976',
    'photo-1630383249896-424e482df921',
    'photo-1610192244261-3f33de3f55e4',
    'photo-1626509653594-319052d9a6c6'
  ],
  thali: [
    'photo-1589301760014-d929f3979dbc',
    'photo-1626509653594-319052d9a6c6',
    'photo-1601050690597-df056fb4ce78',
    'photo-1631452180519-c014fe946bc7',
    'photo-1546833999-b9f581a1996d',
    'photo-1633945274405-b6c8069047b0',
    'photo-1626777552726-4a6b54c97e46',
    'photo-1563379091339-03b21ab4a4f8'
  ],
  dessert: [
    'photo-1551024601-bec78aea704b',
    'photo-1606313564200-e75d5e30476c',
    'photo-1587314168485-3236d6710814',
    'photo-1563729784474-d77dbb933a9e',
    'photo-1578985545062-69928b1d9587',
    'photo-1488477181946-6428a0291777',
    'photo-1560180474-e8563fd75bab',
    'photo-1579954115545-a95591f28bfc'
  ],
  beverage: [
    'photo-1622483767028-3f66f32aef97', // Coca-Cola
    'photo-1595981267035-7b04ca84a82d', // Pepsi
    'photo-1625772291357-38bca10a86dc', // Sprite
    'photo-1622483767028-3f66f32aef97', // Thums Up
    'photo-1527960656366-ee41809e1d88', // Fanta
    'photo-1553530666-ba11a7da3888', // Sweet Lassi
    'photo-1513558161293-cdaf765ed2fd', // Fresh Lime Soda
    'photo-1546173159-315724a31696', // Mango Lassi
    'photo-1557142046-c704a3adf364', // Buttermilk
    'photo-1536935338788-846bb9981813', // Jaljeera
    'photo-1572490122747-3968b75cc699', // Milkshake
    'photo-1544787219-7f47ccb76574', // Cold Coffee
    'photo-1541167760496-1628856ab772', // Latte
    'photo-1576092768241-dec231879fc3', // Tea
    'photo-1515694346937-94d85e41e6f0'  // Iced Tea
  ]
};

const categoryToSuperGroup = {
  'Biryani': 'biryani',
  'North Indian': 'north_indian',
  'South Indian': 'south_indian',
  'Chinese': 'chinese',
  'Street Food': 'street_food',
  'Fast Food': 'fast_food',
  'Pizza': 'pizza',
  'Burger': 'burger',
  'Rolls': 'rolls',
  'Sandwiches': 'sandwiches',
  'Momos': 'momos',
  'Healthy Bowls': 'healthy',
  'Salads': 'healthy',
  'Protein Meals': 'healthy',
  'Keto Meals': 'healthy',
  'Vegan Meals': 'healthy',
  'Jain Food': 'jain',
  'Breakfast': 'breakfast',
  'Lunch Specials': 'thali',
  'Dinner Combos': 'thali',
  'Desserts': 'dessert',
  'Ice Creams': 'dessert',
  'Beverages': 'beverage',
  'Fresh Juices': 'beverage',
  'Milkshakes': 'beverage',
  'Smoothies': 'beverage',
  'Coffee': 'beverage',
  'Tea': 'beverage',
  'Energy Drinks': 'beverage',
  'Protein Shakes': 'beverage'
};

function generateMenuItems(restaurants) {
  const menuItems = [];

  const healthyAiItems = [
    { name: 'Grilled Chicken Bowl', category: 'Healthy Bowls', isVeg: false, ingredients: ['Grilled Chicken Breast', 'Brown Rice', 'Broccoli', 'Egg White', 'Avocado Dressing'], price: 249, tags: ['High Protein', 'Muscle Gain'] },
    { name: 'Chicken Salad', category: 'Salads', isVeg: false, ingredients: ['Grilled Chicken', 'Romaine Lettuce', 'Cucumber', 'Cherry Tomatoes', 'Low Fat Vinaigrette'], price: 199, tags: ['High Protein', 'Weight Loss'] },
    { name: 'Paneer Protein Bowl', category: 'Healthy Bowls', isVeg: true, ingredients: ['Low Fat Paneer', 'Quinoa', 'Sautéed Spinach', 'Chickpeas', 'Olive Oil'], price: 229, tags: ['High Protein', 'Vegetarian'] },
    { name: 'Egg Protein Wrap', category: 'Protein Meals', isVeg: false, ingredients: ['Whole Wheat Tortilla', '4 Egg Whites', 'Onion Tomato Salad', 'Low Fat Cheese'], price: 159, tags: ['High Protein'] },
    { name: 'Protein Oats', category: 'Breakfast', isVeg: true, ingredients: ['Rolled Oats', 'Almond Milk', 'Chia Seeds', 'Honey', 'Almonds', 'Whey Protein'], price: 139, tags: ['High Protein', 'Weight Loss', 'Vegan'] },
    { name: 'Quinoa Bowl', category: 'Healthy Bowls', isVeg: true, ingredients: ['Quinoa', 'Broccoli', 'Avocado', 'Sautéed Asparagus', 'Lemon Olive Dressing'], price: 209, tags: ['Weight Loss', 'Vegan', 'Vegetarian'] },
    { name: 'Greek Yogurt Bowl', category: 'Breakfast', isVeg: true, ingredients: ['Greek Yogurt', 'Honey', 'Mixed Berries', 'Chia Seeds', 'Walnuts'], price: 149, tags: ['Weight Loss', 'Vegetarian'] },
    { name: 'Mixed Veg Salad', category: 'Salads', isVeg: true, ingredients: ['Cucumber', 'Carrot', 'Lettuce', 'Onion', 'Bell Peppers', 'Lemon Dressing'], price: 99, tags: ['Weight Loss', 'Vegan', 'Vegetarian'] },
    { name: 'Sprouts Salad', category: 'Salads', isVeg: true, ingredients: ['Moong Sprouts', 'Onion', 'Tomato', 'Lemon Juice', 'Coriander'], price: 89, tags: ['Weight Loss', 'Vegan', 'Vegetarian'] },
    { name: 'Chicken Rice Bowl', category: 'Healthy Bowls', isVeg: false, ingredients: ['Boiled Chicken Breast', 'Steamed Rice', 'Egg White', 'Broccoli', 'Soy Sauce'], price: 229, tags: ['Muscle Gain', 'High Protein'] },
    { name: 'Double Paneer Bowl', category: 'Healthy Bowls', isVeg: true, ingredients: ['Double Low-Fat Paneer', 'Brown Rice', 'Lentils', 'Mixed Greens'], price: 249, tags: ['Muscle Gain', 'High Protein', 'Vegetarian'] },
    { name: 'Protein Shake', category: 'Protein Shakes', isVeg: true, ingredients: ['Whey Protein', 'Skimmed Milk', 'Banana', 'Honey', 'Peanut Butter'], price: 169, tags: ['High Protein', 'Muscle Gain', 'Vegetarian'] },
    { name: 'Peanut Butter Smoothie', category: 'Smoothies', isVeg: true, ingredients: ['Peanut Butter', 'Banana', 'Oat Milk', 'Dates', 'Oats'], price: 149, tags: ['Muscle Gain', 'Vegetarian'] },
    { name: 'Vegan Buddha Bowl', category: 'Healthy Bowls', isVeg: true, ingredients: ['Tofu', 'Brown Rice', 'Kale', 'Chickpeas', 'Tahini Dressing'], price: 219, tags: ['Vegan', 'Vegetarian'] },
    { name: 'Vegan Salad', category: 'Salads', isVeg: true, ingredients: ['Lettuce', 'Tofu', 'Walnuts', 'Pomegranate', 'Olive Oil Dressing'], price: 159, tags: ['Vegan', 'Vegetarian'] },
    { name: 'Vegan Wrap', category: 'Vegan Meals', isVeg: true, ingredients: ['Whole Wheat Tortilla', 'Grilled Tofu', 'Lettuce', 'Hummus', 'Vegan Mayo'], price: 169, tags: ['Vegan', 'Vegetarian'] },
    { name: 'Keto Chicken Bowl', category: 'Healthy Bowls', isVeg: false, ingredients: ['Chicken Breast', 'Avocado', 'Broccoli', 'Olives', 'Olive Oil', 'Butter'], price: 259, tags: ['Keto', 'High Protein', 'Muscle Gain'] },
    { name: 'Keto Paneer Bowl', category: 'Healthy Bowls', isVeg: true, ingredients: ['Low Fat Paneer', 'Avocado', 'Sautéed Asparagus', 'Almonds', 'Butter'], price: 239, tags: ['Keto', 'Vegetarian'] },
    { name: 'Egg Avocado Salad', category: 'Salads', isVeg: false, ingredients: ['Boiled Eggs', 'Avocado', 'Lettuce', 'Cherry Tomatoes', 'Lemon Dressing'], price: 179, tags: ['Keto', 'High Protein'] }
  ];

  for (const restaurant of restaurants) {
    const rand = seededRandom(`menu-${restaurant._id}`);
    const itemsCount = int(35, 45, rand);

    const selectedItems = [];
    const usedNames = new Set();

    const coreCuisines = restaurant.cuisine;
    const isPureVeg = restaurant.isPureVeg;

    const possibleCategories = new Set(coreCuisines);
    possibleCategories.add('Beverages');
    possibleCategories.add('Desserts');
    possibleCategories.add('Breakfast');

    if (rand() > 0.4) {
      possibleCategories.add('Healthy Bowls');
      possibleCategories.add('Salads');
    }
    if (rand() > 0.6) {
      possibleCategories.add('Protein Meals');
      possibleCategories.add('Keto Meals');
      possibleCategories.add('Vegan Meals');
      possibleCategories.add('Protein Shakes');
      possibleCategories.add('Smoothies');
    }
    if (isPureVeg) {
      possibleCategories.add('Jain Food');
    }

    const catList = Array.from(possibleCategories);

    for (const hItem of healthyAiItems) {
      if (possibleCategories.has(hItem.category)) {
        if (isPureVeg && hItem.isVeg === false) continue;
        if (selectedItems.length < itemsCount) {
          const name = hItem.name;
          if (!usedNames.has(name)) {
            selectedItems.push({
              name,
              category: hItem.category,
              isVeg: hItem.isVeg,
              ingredients: hItem.ingredients,
              price: hItem.price + int(-20, 30, rand),
              tags: hItem.tags
            });
            usedNames.add(name);
          }
        }
      }
    }

    let catIndex = 0;
    while (selectedItems.length < itemsCount) {
      const cat = catList[catIndex % catList.length];
      catIndex += 1;

      const catalogItems = dishCatalog[cat];
      if (!catalogItems || catalogItems.length === 0) continue;

      const dishTemplate = pick(catalogItems, rand);
      const isVegDish = isPureVeg ? true : dishTemplate[1];
      const baseName = dishTemplate[0];

      const suffix = rand() > 0.85 ? pick(['Combo', 'Special', 'Supreme', 'Regular', 'Platter'], rand) : '';
      const name = suffix ? `${baseName} ${suffix}` : baseName;

      if (!usedNames.has(name)) {
        selectedItems.push({
          name,
          category: cat,
          isVeg: isVegDish,
          ingredients: dishTemplate[2],
          price: Math.max(49, dishTemplate[4] + int(-30, 60, rand)),
          tags: dishTemplate[5] || []
        });
        usedNames.add(name);
      }
    }

    selectedItems.forEach((item, index) => {
      const nutrients = generateNutrients(item.category, item.name, item.isVeg, item.price, rand);

      let catalogIndex = 0;
      if (item.category && dishCatalog[item.category]) {
        const baseName = item.name.replace(/( Combo| Special| Supreme| Regular| Platter)$/, '');
        const foundIdx = dishCatalog[item.category].findIndex(d => d[0] === baseName);
        if (foundIdx !== -1) {
          catalogIndex = foundIdx;
        } else {
          const healthyIdx = healthyAiItems.findIndex(h => h.name === item.name);
          if (healthyIdx !== -1) {
            catalogIndex = healthyIdx;
          } else {
            catalogIndex = index;
          }
        }
      } else {
        catalogIndex = index;
      }

      const superGroup = categoryToSuperGroup[item.category] || 'fast_food';
      const ids = superGroupPhotoIds[superGroup] || superGroupPhotoIds['fast_food'];
      const photoId = ids[catalogIndex % ids.length];
      const imagePath = `https://images.unsplash.com/${photoId}?w=500&auto=format&fit=crop`;

      const popularityScore = int(40, 99, rand);
      const rating = decimal(3.6, 4.9, rand);
      const totalReviews = int(10, 450, rand);

      let healthScore = int(40, 95, rand);
      if (item.category === 'Salads' || item.category === 'Healthy Bowls') {
        healthScore = int(80, 98, rand);
      } else if (item.category === 'Fast Food' || item.category === 'Pizza') {
        healthScore = int(30, 60, rand);
      }

      let proteinLevel = 'Medium';
      if (nutrients.protein >= 20) {
        proteinLevel = 'High';
      } else if (nutrients.protein < 5) {
        proteinLevel = 'Low';
      }

      const dietaryTypeSet = new Set();
      if (item.isVeg) {
        dietaryTypeSet.add('Vegetarian');
      } else {
        dietaryTypeSet.add('Non-Veg');
      }

      item.tags.forEach(t => dietaryTypeSet.add(t));
      if (item.category === 'Vegan Meals') dietaryTypeSet.add('Vegan');
      if (item.category === 'Keto Meals') dietaryTypeSet.add('Keto');
      if (item.category === 'Jain Food') dietaryTypeSet.add('Jain');

      const lowerName = item.name.toLowerCase();
      if (lowerName.includes('vegan')) {
        dietaryTypeSet.add('Vegan');
        dietaryTypeSet.add('Vegetarian');
      }
      if (lowerName.includes('keto')) dietaryTypeSet.add('Keto');
      if (lowerName.includes('jain')) {
        dietaryTypeSet.add('Jain');
        dietaryTypeSet.add('Vegetarian');
      }
      if (lowerName.includes('protein')) dietaryTypeSet.add('High Protein');
      if (lowerName.includes('salad') || lowerName.includes('quinoa') || lowerName.includes('sprouts')) {
        dietaryTypeSet.add('Weight Loss');
      }

      const dietaryTypeArray = Array.from(dietaryTypeSet);

      const menuItem = {
        _id: objectId(`menu-${restaurant._id}-${index}-${item.name}`),
        restaurantId: restaurant._id,
        restaurant: restaurant._id,
        restaurantName: restaurant.name,
        name: item.name,
        category: item.category,
        subCategory: getSubCategory(item.category),
        description: `Delightful ${item.name} from ${restaurant.name}, prepared with standard ${item.ingredients.slice(0, 3).join(', ')} and typical spices.`,
        price: item.price,
        isVeg: item.isVeg,
        isAvailable: rand() > 0.03,
        preparationTime: int(10, 35, rand),
        calories: nutrients.calories,
        protein: nutrients.protein,
        carbs: nutrients.carbs,
        fats: nutrients.fats,
        fiber: nutrients.fiber,
        sugar: nutrients.sugar,
        sodium: nutrients.sodium,
        cholesterol: nutrients.cholesterol,
        potassium: nutrients.potassium,
        ingredients: item.ingredients,
        allergens: getAllergens(item.name),
        popularityScore,
        rating,
        totalReviews,
        isTrending: popularityScore >= 82,
        orderCount: int(50, 2500, rand),
        spicyLevel: item.category.includes('Biryani') || item.category.includes('North Indian') ? int(2, 5, rand) : int(0, 2, rand),
        dietaryType: dietaryTypeArray,
        mealType: getSubCategory(item.category) === 'Breakfast' ? 'Breakfast' : (getSubCategory(item.category) === 'Dessert' ? 'Dessert' : 'Lunch/Dinner'),
        proteinLevel,
        healthScore,
        cuisineType: restaurant.cuisine[0] || 'Indian',
        image: imagePath,
        createdAt: restaurant.createdAt,
        updatedAt: restaurant.updatedAt
      };

      menuItems.push(menuItem);
    });
  }

  return menuItems;
}

function generateReviews(restaurants) {
  const names = [
    'Aarav Sharma', 'Ananya Reddy', 'Rohan Mehta', 'Sana Khan', 'Vikram Rao',
    'Isha Nair', 'Kabir Singh', 'Meera Joshi', 'Aditya Varma', 'Nisha Patel',
    'Rahul Das', 'Priya Menon', 'Farhan Ali', 'Neha Kapoor', 'Kiran Kumar',
    'Divya Iyer', 'Manish Jain', 'Ayesha Mirza', 'Siddharth Bose', 'Tanvi Shah'
  ];
  const comments = [
    'Great packaging and the food arrived hot and fresh.',
    'Portions were generous and flavors were absolutely spot-on!',
    'Good weekday meal option with quick delivery and nice flavors.',
    'The spice balance was excellent, not too oily.',
    'Fresh food, neat packing, and definitely worth reordering.',
    'Loved the taste and the delivery timing was very accurate.',
    'Good value for the price. Highly recommended.',
    'Reliable place when ordering traditional meals for family.'
  ];

  const reviews = [];
  for (const restaurant of restaurants) {
    const rand = seededRandom(`reviews-${restaurant._id}`);
    const count = int(6, 12, rand);

    for (let index = 0; index < count; index += 1) {
      const userName = names[(index + int(0, names.length - 1, rand)) % names.length];
      const rating = decimal(Math.max(3, restaurant.rating - 0.6), 5, rand);
      const daysAgo = int(2, 180, rand);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      reviews.push({
        _id: objectId(`review-${restaurant._id}-${index}`),
        user: objectId(`user-${restaurant._id}-${index}-${userName}`),
        userName,
        restaurantId: restaurant._id,
        restaurant: restaurant._id,
        rating,
        reviewText: pick(comments, rand),
        comment: pick(comments, rand),
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  return reviews;
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
  return categoryAssets.map((asset) => ({
    _id: objectId(`category-${asset.name}`),
    name: asset.name,
    icon: asset.icon,
    image: asset.image,
    slug: asset.slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function generateTrendingFoods(menuItems) {
  return [...menuItems]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 80)
    .map((item, index) => ({
      _id: objectId(`trending-${item._id}`),
      menuItemId: item._id,
      restaurantId: item.restaurantId,
      name: item.name,
      category: item.category,
      orderCount: item.orderCount + (80 - index) * 15,
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
  console.log('Generating realistic Indian food delivery dataset...');
  fs.mkdirSync(dataDir, { recursive: true });

  const restaurants = generateRestaurants();
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

  console.log('=== Generation Summary ===');
  console.log(`Restaurants: ${restaurants.length} (15 per city across 7 cities)`);
  console.log(`Menu Items: ${menuItems.length} (35-45 items per restaurant, real names, rich nutrients)`);
  console.log(`Reviews: ${reviews.length}`);
  console.log(`Coupons: ${coupons.length}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Trending Foods: ${trendingFoods.length}`);
  console.log('Dataset written successfully to server/data/');
}

main();
