import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Lock, Eye, EyeOff, User, Home } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } =
    useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

  useEffect(() => {
    return () => reset("password", "password_confirmation");
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    else if (data.name.length > 50)
      newErrors.name = "Name cannot exceed 50 characters";

    if (!data.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email))
      newErrors.email = "Please enter a valid email address";
    else if (data.email.length > 100)
      newErrors.email = "Email cannot exceed 100 characters";

    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (data.password.length > 50)
      newErrors.password = "Password cannot exceed 50 characters";

    if (data.password_confirmation !== data.password)
      newErrors.password_confirmation = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) =>
        setError(key, message)
      );
      setNotification({ type: "error", message: "Please fix the errors below." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    post(route("register"), {
      onSuccess: () => {
        setNotification({ type: "success", message: "Registration successful! Redirecting..." });
        setTimeout(() => setNotification(null), 2000);
      },
      onError: () => {
        setNotification({ type: "error", message: "Registration failed. Please try again." });
        setTimeout(() => setNotification(null), 3000);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
      <Head title="Register - Travel Nest" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
              notification.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <div className="text-center space-y-6">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto" />
          <h1 className="text-4xl font-bold text-white">
            Welcome to <span className="text-blue-500">Travel Nest</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Plan your next trip with ease. Book flights, explore destinations,
            and unlock unforgettable adventures around the world.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Your Name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                    errors.password_confirmation ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href={route("user.login")}
                className="text-blue-400 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;