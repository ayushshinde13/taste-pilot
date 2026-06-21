import User from '../models/User.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

export const getAnalytics = async () => {
  const [totalUsers, totalOrders, revenueResult, topRestaurants, trendingFoods] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),

      Order.countDocuments({ status: { $ne: 'Cancelled' } }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            status: { $ne: 'Cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            status: { $ne: 'Cancelled' },
          },
        },
        {
          $group: {
            _id: '$restaurant',
            orderCount: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'restaurants',
            localField: '_id',
            foreignField: '_id',
            as: 'restaurant',
          },
        },
        { $unwind: '$restaurant' },
        {
          $project: {
            _id: 0,
            restaurantId: '$_id',
            name: '$restaurant.name',
            image: '$restaurant.image',
            cuisine: '$restaurant.cuisine',
            rating: '$restaurant.rating',
            orderCount: 1,
            revenue: 1,
          },
        },
      ]),

      MenuItem.find({ isAvailable: true })
        .sort({ orderCount: -1, isTrending: -1 })
        .limit(5)
        .populate('restaurant', 'name image')
        .select('name price image isVeg isTrending orderCount category restaurant'),
    ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email')
    .populate('restaurant', 'name image')
    .select('totalAmount status paymentStatus createdAt items');

  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    topRestaurants,
    trendingFoods,
    recentOrders,
    ordersByStatus: ordersByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};

export default { getAnalytics };
