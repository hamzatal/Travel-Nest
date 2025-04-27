import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, User, Home, Shield } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

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

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  // Validation Functions
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
      return "Admin password must be at least 8 characters long";
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
      setNotification({ type: "error", message: "Please fix the errors below." });
      return;
    }
    post(route("admin.login"), {
      onSuccess: () => {
        setNotification({ type: "success", message: "Login successful! Redirecting..." });
      },
      onError: (errors) => {
        setNotification({ type: "error", message: "Invalid credentials. Please try again." });
        Object.keys(errors).forEach((key) => {
          setError(key, errors[key]);
        });
      },
    });
  };

  return (
    <div className="min-h-screen w-full relative">
      <Head title="Admin Login - Travel Nest" />

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

      <Notification message={notification?.message} type={notification?.type} />

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="text-center space-y-8">
            <div className="bg-green-600/20 p-6 rounded-full inline-block mx-auto">
              <User className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Travel Nest <span className="text-green-500">Admin</span>
            </h1>
            <p className="text-gray-300 max-w-md mx-auto text-lg">
              Secure administrative access for Travel Nest. Authorized personnel only.
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
                <span className="text-green-500">Travel Nest Admin</span>
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Administrator Sign In
            </h2>
            <p className="text-gray-400 text-center mb-6">Enter your admin credentials</p>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="admin@example.com"
                    autoComplete="username"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">{errors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`pl-10 w-full p-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
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

              <div className="flex items-center justify-between">
                <Link
                  href={route("password.request")}
                  className="text-sm text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  Reset admin credentials
                </Link>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 flex items-center justify-center bg-green-600 text-white rounded-lg font-medium transition-all hover:bg-green-700 disabled:opacity-50 shadow-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                {processing ? "Signing in..." : "Access Admin Panel"}
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Return to{" "}
                <Link
                  href={route("login")}
                  className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors"
                >
                  user sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;