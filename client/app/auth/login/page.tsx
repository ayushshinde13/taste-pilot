'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GoogleSelectorModal from '@/components/GoogleSelectorModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [redirectParam, setRedirectParam] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Forgot Password modal states
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter otp & new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [demoOtp, setDemoOtp] = useState('');

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotStep === 1) {
      if (!forgotEmail) {
        setForgotError('Email address is required');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
        setForgotError('Please enter a valid email address');
        return;
      }

      setForgotLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: forgotEmail.trim() }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate reset code');
        }

        if (data.data && data.data.otp) {
          setDemoOtp(data.data.otp);
        }
        setForgotSuccess('A verification code has been generated.');
        setForgotStep(2);
      } catch (err: any) {
        setForgotError(err.message || 'An error occurred. Please try again.');
      } finally {
        setForgotLoading(false);
      }
    } else {
      if (!forgotOtp) {
        setForgotError('Verification code is required');
        return;
      }
      if (!forgotNewPassword) {
        setForgotError('New password is required');
        return;
      }
      if (forgotNewPassword.length < 6) {
        setForgotError('Password must be at least 6 characters');
        return;
      }
      if (forgotNewPassword !== forgotConfirmPassword) {
        setForgotError('Passwords do not match');
        return;
      }

      setForgotLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: forgotEmail.trim(),
            otp: forgotOtp.trim(),
            password: forgotNewPassword
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }

        setForgotSuccess('Password reset successfully! Redirecting...');
        setTimeout(() => {
          setIsForgotModalOpen(false);
          // Reset states
          setForgotStep(1);
          setForgotEmail('');
          setForgotOtp('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
          setDemoOtp('');
          setForgotSuccess('');
          setForgotError('');
        }, 2500);
      } catch (err: any) {
        setForgotError(err.message || 'An error occurred. Please try again.');
      } finally {
        setForgotLoading(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRedirectParam(params.get('redirect') || '');
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setGeneralError('');

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      // Redirect to target or profile page after successful login
      const redirectTo = redirectParam || '/profile';
      router.push(redirectTo);
      router.refresh();
    } catch (error: any) {
      setGeneralError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {generalError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{generalError}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="font-medium text-orange-600 hover:text-orange-500 bg-transparent border-0 cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href={redirectParam ? `/auth/register?redirect=${encodeURIComponent(redirectParam)}` : "/auth/register"} 
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      <GoogleSelectorModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        redirectPath={redirectParam || '/restaurants'}
      />

      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
            >
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotStep(1);
                  setForgotError('');
                  setForgotSuccess('');
                  setDemoOtp('');
                }}
                disabled={forgotLoading}
                className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <div className="text-center mt-2 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {forgotStep === 1
                    ? 'Enter your email to request a reset verification code'
                    : 'Enter the verification code and your new password'}
                </p>
              </div>

              {forgotError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-150">
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-150">
                  {forgotSuccess}
                </div>
              )}

              {demoOtp && forgotStep === 2 && (
                <div className="mb-4 p-3 bg-orange-50 text-orange-800 text-sm rounded-lg border border-orange-200">
                  💡 <strong>Demo Mode:</strong> Your verification code is: <code className="bg-orange-100 px-2 py-0.5 rounded font-mono font-bold text-base">{demoOtp}</code>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotStep === 1 ? (
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="forgotEmail"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. user@test.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="forgotOtp" className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Code
                      </label>
                      <input
                        id="forgotOtp"
                        type="text"
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="Enter the 6-digit code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-center font-mono font-bold tracking-widest text-lg"
                      />
                    </div>

                    <div>
                      <label htmlFor="forgotNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        id="forgotNewPassword"
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="forgotConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="forgotConfirmPassword"
                        type="password"
                        required
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-orange-600 hover:bg-orange-700 font-medium transition disabled:opacity-50 cursor-pointer"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      {forgotStep === 1 ? 'Sending Request...' : 'Resetting Password...'}
                    </>
                  ) : (
                    forgotStep === 1 ? 'Request Reset Code' : 'Update Password'
                  )}
                </button>

                {forgotStep === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotError('');
                      setForgotSuccess('');
                      setDemoOtp('');
                    }}
                    className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700 mt-2"
                  >
                    ← Back to email request
                  </button>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}