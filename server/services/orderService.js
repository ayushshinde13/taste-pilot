import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import ApiError from '../utils/ApiError.js';

export const validateAndBuildOrderItems = async (restaurantId, items) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || !restaurant.isActive) {
    throw new ApiError(404, 'Restaurant not found or inactive');
  }

  const menuItemIds = items.map((item) => item.menuItemId);
  const menuItems = await MenuItem.find({
    _id: { $in: menuItemIds },
    restaurant: restaurantId,
    isAvailable: true,
  });

  if (menuItems.length !== items.length) {
    throw new ApiError(400, 'One or more menu items are unavailable or invalid');
  }

  const menuMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

  let totalAmount = 0;
  const orderItems = items.map((item) => {
    const menuItem = menuMap.get(item.menuItemId);
    if (!menuItem) {
      throw new ApiError(400, `Menu item ${item.menuItemId} not found`);
    }

    const lineTotal = menuItem.price * item.quantity;
    totalAmount += lineTotal;

    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      isVeg: menuItem.isVeg,
    };
  });

  return { restaurant, orderItems, totalAmount };
};

export const incrementMenuItemOrderCounts = async (orderItems) => {
  const bulkOps = orderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.menuItem },
      update: { $inc: { orderCount: item.quantity } },
    },
  }));

  if (bulkOps.length > 0) {
    await MenuItem.bulkWrite(bulkOps);
  }
};

export default { validateAndBuildOrderItems, incrementMenuItemOrderCounts };
