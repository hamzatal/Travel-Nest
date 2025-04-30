import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, PlaneIcon, Home } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-[100] p-4 rounded-md shadow-lg max-w-sm ${
          type === 'error' ? 'bg-red-600' : 'bg-green-600'
        } text-white flex items-center space-x-2`}
      >
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  // Validation Functions
  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (name.length > 50) return 'Name cannot exceed 50 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return null;
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (email.length > 100) return 'Email cannot exceed 100 characters';
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (password.length > 64) return 'Password cannot exceed 64 characters';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'password1', '12345678'
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      return 'This password is too common. Please choose a stronger password.';
    }
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateName(data.name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateEmail(data.email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;
    const confirmPasswordError = validateConfirmPassword(data.password, data.password_confirmation);
    if (confirmPasswordError) newErrors.password_confirmation = confirmPasswordError;
    return newErrors;
  };

  const submit = (e) => {
    e.preventDefault();
    clearErrors();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Object.keys(validationErrors).forEach(key => {
        setError(key, validationErrors[key]);
      });
      setNotification({ type: "error", message: "Please fix the errors below." });
      return;
    }
    post(route('register'), {
      onSuccess: () => {
        setNotification({ 
          type: "success", 
          message: data.role === 'admin' 
            ? "Admin registration successful! Redirecting to dashboard..." 
            : "Registration successful! Please verify your email."
        });
      },
      onError: (errors) => {
        setNotification({ type: "error", message: errors.email || "Registration failed. Please try again." });
      },
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen w-full relative">
      <Head title="Register" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/world.svg')" }}
      />

      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Home</span>
      </Link>

      <Notification 
        message={notification?.message} 
        type={notification?.type} 
        onClose={closeNotification} 
      />

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="text-center space-y-8">
            <div className="bg-green-600/20 p-6 rounded-full inline-block mx-auto">
              <User className="w-20 h-20 text-green-500" />
            </div>
            <div className="flex items-center justify-center">
              <PlaneIcon className="w-10 h-10 text-green-500 mr-3" />
              <h1 className="text-5xl font-bold text-white">
                Travel <span className="text-green-500">Nest</span>
              </h1>
            </div>
            <p className="text-gray-300 max-w-md mx-auto text-lg">
              Welcome to Travel Nest! Create an account to explore the world of travel and adventure.
              Join us to discover amazing destinations, plan your trips, and connect with fellow travelers.
              <br />
              <span className="text-green-500 font-bold">Your journey starts here!</span>
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800/90 backdrop-blur-sm">
            <div className="lg:hidden text-center mb-8">
              <div className="bg-green-600/20 p-4 rounded-full inline-block mx-auto">
                <PlaneIcon className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-center mb-6">Enter your details to register</p>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your name"
                    required
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">{errors.name}</span>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="you@example.com"
                    required
                    autoComplete="username"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">{errors.email}</span>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.password_confirmation ? 'border-red-500' : ''
                    }`}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <span className="text-red-500 text-sm mt-1">{errors.password_confirmation}</span>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={data.role}
                  onChange={(e) => setData('role', e.target.value)}
                  className="w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                >
                  <option value="user">User (Requires Email Verification)</option>
                  <option value="admin">Admin (No Email Verification)</option>
                </select>
                <p className="text-gray-400 text-sm mt-1">
                  {data.role === 'admin' 
                    ? 'Admins have access to the dashboard and do not require email verification.' 
                    : 'Users need to verify their email after registration.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 flex items-center justify-center bg-green-600 text-white rounded-lg font-medium transition-all hover:bg-green-700 disabled:opacity-50 shadow-lg"
              >
                {processing ? 'Registering...' : 'Register'}
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already registered?{' '}
                <Link
                  href={route('login')}
                  className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}