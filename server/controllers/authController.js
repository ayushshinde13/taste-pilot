import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      dob: user.dob,
      addresses: user.addresses,
      token: generateToken(user._id),
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      dob: user.dob,
      addresses: user.addresses,
      token: generateToken(user._id),
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { name, phone, dob, avatar } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (dob !== undefined) user.dob = dob;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { label, street, city, state, pincode, phone, isDefault, locality, latitude, longitude } = req.body;

  if (isDefault || user.addresses.length === 0) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({
    label,
    street,
    city,
    state,
    pincode,
    locality: locality || '',
    latitude: latitude ? Number(latitude) : 0,
    longitude: longitude ? Number(longitude) : 0,
    phone: phone || '',
    isDefault: isDefault || user.addresses.length === 0,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: user.addresses,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const addressId = req.params.id;
  user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

  if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Address deleted successfully',
    data: user.addresses,
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const addressId = req.params.id;
  user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === addressId;
  });

  await user.save();

  res.json({
    success: true,
    message: 'Default address updated successfully',
    data: user.addresses,
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, avatar } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  let user = await User.findOne({ email });

  if (!user) {
    // Generate a random password since user is logging in with Google
    const randomPassword = Math.random().toString(36).slice(-10) + 'TastePilot@1';
    
    // Create new user
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: randomPassword,
      avatar: avatar || '/avatars/male_1.png',
      // Provide a default address for the user so it doesn't fail location/city requirements
      addresses: [{
        label: 'Home',
        street: 'Connaught Place',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        locality: 'Connaught Place',
        latitude: 28.6304,
        longitude: 77.2177,
        isDefault: true
      }]
    });
  }

  res.json({
    success: true,
    message: 'Google login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      dob: user.dob,
      addresses: user.addresses,
      token: generateToken(user._id),
    },
  });
});

export default { register, login, getMe, updateProfile, addAddress, deleteAddress, setDefaultAddress, googleLogin };
