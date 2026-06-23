import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

const mongoUri = process.env.LOCAL_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taste-pilot';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulate() {
  console.log('Connecting to database...');
  await mongoose.connect(mongoUri);
  console.log('Database connected successfully!');

  let orderId = process.argv[2];
  let order;

  if (orderId) {
    console.log(`Searching for Order ID: ${orderId}...`);
    if (orderId.length === 12) {
      console.log('Detected 12-character short Order ID. Performing prefix match...');
      const allOrders = await Order.find();
      order = allOrders.find(o => o._id.toString().substring(0, 12).toLowerCase() === orderId.toLowerCase());
    } else {
      order = await Order.findById(orderId);
    }
  } else {
    console.log('No Order ID specified. Fetching the most recent order...');
    order = await Order.findOne().sort({ createdAt: -1 });
  }

  if (!order) {
    console.error('❌ Error: No orders found in the database. Place an order first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`\n================ SIMULATION START ================`);
  console.log(`Order ID:       #${order._id}`);
  console.log(`User:           ${order.user}`);
  console.log(`Restaurant:     ${order.restaurant}`);
  console.log(`Payment Method: ${order.paymentMethod || 'COD'}`);
  console.log(`Payment Status: ${order.paymentStatus || 'pending'}`);
  console.log(`Initial Status: ${order.status}`);
  console.log(`==================================================\n`);

  if (order.paymentMethod === 'UPI' && order.paymentStatus !== 'paid') {
    console.log(`⚠️  WARNING: This order is a UPI order but is still [pending] payment.`);
    console.log(`   On the frontend, the tracking timeline will remain locked/grayed-out.`);
    console.log(`   Please complete the payment in the browser first to unlock tracking.\n`);
  }

  const statuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

  for (const status of statuses) {
    console.log(`⏳ Transitioning status to: [${status}]...`);
    order.status = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'paid';
    }
    await order.save();
    console.log(`✅ Status updated in database to: [${status}]`);
    console.log('📺 Watch your browser! The progress bar will update within 5 seconds.\n');
    
    if (status !== 'Delivered') {
      await sleep(5000); // Wait 5 seconds before next state
    }
  }

  console.log('🎉 Simulation complete! Order has been successfully delivered.');
  await mongoose.disconnect();
  console.log('Disconnected from database.');
}

simulate().catch(async (error) => {
  console.error('❌ Simulation failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
