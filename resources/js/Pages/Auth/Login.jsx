import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Home, User } from "lucide-react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

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
          type === "error" ? "bg-red-600" : "bg-green-600"
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

const LoginPage = () => {
    const { auth } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState(null);
    const validateEmail = (email) => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return "Please enter a valid email address";
        if (email.length > 100) return "Email cannot exceed 100 characters";
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8)
            return "Password must be at least 8 characters long";
        if (password.length > 50) return "Password cannot exceed 50 characters";
        return null;
    };

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        email: "",
        password: "",
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const emailError = validateEmail(data.email);
        if (emailError) newErrors.email = emailError;
        const passwordError = validatePassword(data.password);
        if (passwordError) newErrors.password = passwordError;
        return newErrors;
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach((key) => {
                setError(key, validationErrors[key]);
            });
            setNotification({
                type: "error",
                message: "Please fix the errors below.",
            });
            return;
        }
        post(route("login"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Login successful! Redirecting...",
                });
            },
            onError: (errors) => {
                setNotification({
                    type: "error",
                    message: errors.email || "Invalid credentials. Try again.",
                });
                Object.keys(errors).forEach((key) => {
                    setError(key, errors[key]);
                });
            },
        });
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <div className="min-h-screen w-full relative">
            <Head title="Sign In - Travel Nest" />

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
                        <h1 className="text-5xl font-bold text-white">
                            Welcome to{" "}
                            <span className="text-green-500">Travel Nest</span>
                        </h1>
                        <p className="text-gray-300 max-w-md mx-auto text-lg">
                            Plan your next trip with ease. Book flights, explore
                            destinations, and unlock unforgettable adventures
                            around the world.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
                    <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800/90 backdrop-blur-sm">
                        <div className="lg:hidden text-center mb-8">
                            <div className="bg-green-600/20 p-4 rounded-full inline-block mx-auto">
                                <User className="w-12 h-12 text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mt-3">
                                <span className="text-green-500">
                                    Travel Nest
                                </span>
                            </h1>
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-2">
                            Sign In to Travel Nest
                        </h2>
                        <p className="text-gray-400 text-center mb-6">
                            Enter your details to continue
                        </p>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-300 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                            errors.email ? "border-red-500" : ""
                                        }`}
                                        placeholder="you@example.com"
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && (
                                    <span className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-300 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                                    <span className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-green-400 hover:text-green-300 hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 flex items-center justify-center bg-green-600 text-white rounded-lg font-medium transition-all hover:bg-green-700 disabled:opacity-50 shadow-lg"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                {processing ? "Signing in..." : "Sign In"}
                            </button>

                            <p className="text-center text-sm text-gray-400 mt-6">
                                Don't have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors"
                                >
                                    Register now
                                </Link>
                                <span> / </span>
                                <Link
                                    href={
                                        auth.admin
                                            ? route("admin.dashboard")
                                            : route("admin.login")
                                    } 
                                    className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors"
                                >
                                    Admin ?
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;