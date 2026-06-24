import { Router } from 'express';
import { register, login, getMe, updateProfile, addAddress, deleteAddress, setDefaultAddress, googleLogin, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } from '../validations/authValidation.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);
router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/default', protect, setDefaultAddress);

export default router;
