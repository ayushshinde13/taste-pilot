import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Order from '../models/Order.js';
import {
  validateAndBuildOrderItems,
  incrementMenuItemOrderCounts,
} from '../services/orderService.js';

export const previewCart = asyncHandler(async (req, res) => {
  const { restaurantId, items } = req.body;

  const { restaurant, orderItems, totalAmount } = await validateAndBuildOrderItems(
    restaurantId,
    items
  );

  res.json({
    success: true,
    data: {
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        image: restaurant.image,
      },
      items: orderItems.map((item) => ({
        menuItemId: item.menuItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg,
        lineTotal: item.price * item.quantity,
      })),
      itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: totalAmount,
      deliveryFee: 0,
      totalAmount,
    },
  });
});

export const placeOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, deliveryAddress } = req.body;

  const { restaurant, orderItems, totalAmount } = await validateAndBuildOrderItems(
    restaurantId,
    items
  );

  const order = await Order.create({
    user: req.user._id,
    restaurant: restaurant._id,
    items: orderItems,
    totalAmount,
    deliveryAddress,
    status: 'Placed',
    paymentStatus: 'pending',
  });

  await incrementMenuItemOrderCounts(orderItems);

  const populatedOrder = await Order.findById(order._id)
    .populate('restaurant', 'name image address')
    .populate('user', 'name email');

  const io = req.app.get('io');
  if (io) {
    io.to(`order-${order._id}`).emit('order-created', populatedOrder);
    io.to(`user-${req.user._id}`).emit('order-created', populatedOrder);
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: populatedOrder,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('restaurant', 'name image address'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image address phone')
    .populate('user', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order,
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this order');
  }

  if (['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.status)) {
    throw new ApiError(400, `Cannot cancel order with status: ${order.status}`);
  }

  order.status = 'Cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = req.body.reason || '';
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('restaurant', 'name image')
    .populate('user', 'name email');

  const io = req.app.get('io');
  if (io) {
    io.to(`order-${order._id}`).emit('order-status-updated', populatedOrder);
    io.to(`user-${order.user}`).emit('order-status-updated', populatedOrder);
  }

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: populatedOrder,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const { status } = req.body;
  const validTransitions = {
    Placed: ['Preparing', 'Cancelled'],
    Preparing: ['Out for Delivery', 'Cancelled'],
    'Out for Delivery': ['Delivered'],
    Delivered: [],
    Cancelled: [],
  };

  if (!validTransitions[order.status]?.includes(status)) {
    throw new ApiError(
      400,
      `Cannot change status from ${order.status} to ${status}`
    );
  }

  order.status = status;
  if (status === 'Cancelled') {
    order.cancelledAt = new Date();
  }
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('restaurant', 'name image')
    .populate('user', 'name email');

  const io = req.app.get('io');
  if (io) {
    io.to(`order-${order._id}`).emit('order-status-updated', populatedOrder);
    io.to(`user-${order.user}`).emit('order-status-updated', populatedOrder);
  }

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: populatedOrder,
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('restaurant', 'name image'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export default {
  previewCart,
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
};
