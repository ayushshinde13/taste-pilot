import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

export const createRazorpayOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to pay for this order');
  }

  if (order.paymentStatus === 'paid') {
    throw new ApiError(400, 'Order is already paid');
  }

  if (order.status === 'Cancelled') {
    throw new ApiError(400, 'Cannot pay for a cancelled order');
  }

  const amountInPaise = Math.round(order.totalAmount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `order_${order._id}`,
    notes: {
      orderId: order._id.toString(),
      userId: userId.toString(),
    },
  });

  const payment = await Payment.create({
    order: order._id,
    user: userId,
    razorpayOrderId: razorpayOrder.id,
    amount: order.totalAmount,
    currency: 'INR',
    status: 'created',
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID,
    paymentId: payment._id,
    orderId: order._id,
  };
};

export const verifyRazorpayPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  userId,
}) => {
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    throw new ApiError(404, 'Payment record not found');
  }

  if (payment.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to verify this payment');
  }

  if (payment.status === 'paid') {
    return { alreadyVerified: true, payment, order: await Order.findById(payment.order) };
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    payment.status = 'failed';
    await payment.save();

    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
    }

    throw new ApiError(400, 'Payment verification failed');
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'paid';
  await payment.save();

  const order = await Order.findById(payment.order);
  order.paymentId = razorpayPaymentId;
  order.paymentStatus = 'paid';
  await order.save();

  return { alreadyVerified: false, payment, order };
};

export default { createRazorpayOrder, verifyRazorpayPayment };
