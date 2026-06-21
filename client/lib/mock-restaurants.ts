export interface Restaurant {
  id: string
  name: string
  image: string
  cuisine: string[]
  rating: number
  deliveryTime: number
  priceRange: string
  vegOnly?: boolean
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1585521537519-e21cc028cb29?w=400&h=300&fit=crop',
    cuisine: ['Indian', 'North Indian'],
    rating: 4.5,
    deliveryTime: 30,
    priceRange: '₹₹',
  },
  {
    id: '2',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
    cuisine: ['Italian', 'Pizza'],
    rating: 4.3,
    deliveryTime: 25,
    priceRange: '₹₹',
  },
  {
    id: '3',
    name: 'Green Leaf',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    cuisine: ['Vegetarian', 'Healthy'],
    rating: 4.7,
    deliveryTime: 20,
    priceRange: '₹',
    vegOnly: true,
  },
  {
    id: '4',
    name: 'Burger Bliss',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    cuisine: ['American', 'Fast Food'],
    rating: 4.2,
    deliveryTime: 15,
    priceRange: '₹',
  },
  {
    id: '5',
    name: 'Sushi Sensation',
    image: 'https://images.unsplash.com/photo-1564489551493-eb271dd5f821?w=400&h=300&fit=crop',
    cuisine: ['Japanese', 'Sushi'],
    rating: 4.6,
    deliveryTime: 35,
    priceRange: '₹₹₹',
  },
  {
    id: '6',
    name: 'Biryani Blaze',
    image: 'https://images.unsplash.com/photo-1585937421291-fea549df42f5?w=400&h=300&fit=crop',
    cuisine: ['Indian', 'Biryani'],
    rating: 4.4,
    deliveryTime: 28,
    priceRange: '₹₹',
  },
  {
    id: '7',
    name: 'Thai Taste',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e4e31?w=400&h=300&fit=crop',
    cuisine: ['Thai', 'Asian'],
    rating: 4.1,
    deliveryTime: 32,
    priceRange: '₹₹',
  },
  {
    id: '8',
    name: 'Mediterranean Mix',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    cuisine: ['Mediterranean', 'Greek'],
    rating: 4.5,
    deliveryTime: 27,
    priceRange: '₹₹',
  },
  {
    id: '9',
    name: 'Taco Tuesday',
    image: 'https://images.unsplash.com/photo-1545521521-e0dc2d83c56c?w=400&h=300&fit=crop',
    cuisine: ['Mexican', 'Fast Food'],
    rating: 4.0,
    deliveryTime: 20,
    priceRange: '₹',
  },
  {
    id: '10',
    name: 'Pasta Paradise',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    cuisine: ['Italian', 'Pasta'],
    rating: 4.4,
    deliveryTime: 26,
    priceRange: '₹₹',
  },
  {
    id: '11',
    name: 'Fried Chicken Co',
    image: 'https://images.unsplash.com/photo-1626082260893-49f9a8f26e0e?w=400&h=300&fit=crop',
    cuisine: ['American', 'Fast Food'],
    rating: 3.9,
    deliveryTime: 18,
    priceRange: '₹',
  },
  {
    id: '12',
    name: 'Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1590080876-c3db7e4c4c2c?w=400&h=300&fit=crop',
    cuisine: ['Healthy', 'Vegetarian'],
    rating: 4.3,
    deliveryTime: 15,
    priceRange: '₹',
    vegOnly: true,
  },
]

export const AVAILABLE_CUISINES = Array.from(
  new Set(mockRestaurants.flatMap(r => r.cuisine))
).sort()
