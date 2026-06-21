import ApiError from '../utils/ApiError.js';

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(new ApiError(403, 'Access denied. Admin privileges required.'));
};

export default admin;
