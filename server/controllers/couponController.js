import asyncHandler from '../utils/asyncHandler.js';
import Coupon from '../models/Coupon.js';

export const getAllCoupons = asyncHandler(async (req, res) => {
  const { activeOnly = 'true' } = req.query;
  const filter = activeOnly === 'true' ? { active: true, isActive: true, expiryDate: { $gte: new Date() } } : {};

  const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: coupons.length,
    data: coupons,
  });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code is required',
    });
  }

  const coupon = await Coupon.findOne({ 
    code: code.toUpperCase(), 
    active: true, 
    isActive: true,
    expiryDate: { $gte: new Date() }
  });

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired coupon code',
    });
  }

  if (orderValue < coupon.minimumOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value of ₹${coupon.minimumOrderValue} required for this coupon`,
    });
  }

  // Calculate discount amount
  let discountAmount = 0;
  
  if (coupon.discountType === 'percentage') {
    discountAmount = (coupon.discountValue / 100) * orderValue;
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(coupon.discountValue, orderValue);
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
    }
  } else if (coupon.discountType === 'free_delivery') {
    discountAmount = 0; // Free delivery handled separately
  }

  // Ensure discount doesn't exceed order value
  discountAmount = Math.min(discountAmount, orderValue);

  res.json({
    success: true,
    data: {
      coupon: {
        ...coupon.toObject(),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
      isValid: true,
      message: 'Coupon is valid',
    },
  });
});

export default { getAllCoupons, validateCoupon };