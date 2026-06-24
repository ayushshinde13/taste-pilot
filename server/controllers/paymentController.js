import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../services/paymentService.js';
import { startBackgroundOrderSimulation } from './orderController.js';

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const paymentData = await createRazorpayOrder(orderId, req.user._id);

  res.json({
    success: true,
    message: 'Razorpay order created',
    data: paymentData,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const result = await verifyRazorpayPayment({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    userId: req.user._id,
  });

  const io = req.app.get('io');
  let populatedOrder = result.order;

  if (result.order) {
    populatedOrder = await Order.findById(result.order._id)
      .populate('restaurant', 'name image address phone')
      .populate('user', 'name email');

    if (io) {
      io.to(`order-${result.order._id}`).emit('order-status-updated', populatedOrder);
      io.to(`user-${result.order.user}`).emit('order-status-updated', populatedOrder);
    }
    
    // Automatically trigger delivery simulation on successful payment
    if (!result.alreadyVerified && result.order.paymentStatus === 'paid') {
      startBackgroundOrderSimulation(result.order._id, req.app);
    }
  }

  res.json({
    success: true,
    message: result.alreadyVerified
      ? 'Payment already verified'
      : 'Payment verified successfully',
    data: {
      payment: result.payment,
      order: populatedOrder,
    },
  });
});

export default { createPaymentOrder, verifyPayment };
