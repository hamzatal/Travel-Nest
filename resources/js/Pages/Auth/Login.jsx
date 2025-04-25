import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Home, User } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

// Notification component
const Notification = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white`}>
      {message}
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } =
    useForm({
      email: "",
      password: "",
      remember: true,
    });

  useEffect(() => {
    return () => reset("password");
  }, []);

  const validate = () => {
    const newErrors = {};
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
      return;
    }

    post(route("user.login"), {
      onSuccess: () => {
        setNotification({ type: "success", message: "Login successful! Redirecting..." });
      },
      onError: () => {
        setNotification({ type: "error", message: "Invalid credentials. Try again." });
      },
    });
  };

  return (
    <div className="min-h-screen w-full relative">
      <Head title="Sign In - Travel Nest" />

{/* Background Image */}
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/images/world.svg')" }}
/>

{/* Overlay with light transparent gradient instead of solid black */}
<div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40 z-0" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Home</span>
      </Link>

      {/* Notification */}
      <Notification message={notification?.message} type={notification?.type} />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
          <div className="text-center space-y-8">
            <div className="bg-blue-600/20 p-6 rounded-full inline-block mx-auto">
              <User className="w-20 h-20 text-blue-500" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Welcome to <span className="text-blue-500">Travel Nest</span>
            </h1>
            <p className="text-gray-300 max-w-md mx-auto text-lg">
              Plan your next trip with ease. Book flights, explore destinations,
              and unlock unforgettable adventures around the world.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800/90 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Sign In to Travel Nest
              </h2>
              <p className="text-gray-400 mt-2">Enter your details to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href={route("password.request")}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 mt-4 shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  {processing ? "Signing in..." : "Sign In"}
                </span>
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link
                  href={route("register")}
                  className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
                >
                  Register now
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
