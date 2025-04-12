// resources/js/Pages/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home, LogIn } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const ForgotPassword = ({ status }) => {
  const [notification, setNotification] = useState(null);

  const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
    email: "",
  });

  const validate = () => {
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email))
      newErrors.email = "Please enter a valid email address";
    else if (data.email.length > 100)
      newErrors.email = "Email cannot exceed 100 characters";
    return newErrors;
  };

  const submit = (e) => {
    e.preventDefault();
    clearErrors();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) =>
        setError(key, message)
      );
      setNotification({ type: "error", message: "Please enter a valid email." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    post(route("password.email"), {
      onSuccess: () => {
        setNotification({ type: "success", message: "Reset link sent to your email!" });
        setTimeout(() => setNotification(null), 2000);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
      <Head title="Forgot Password - Travel Nest" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      {/* Back to Login Button */}
      <Link
        href={route("login")}
        className="fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <LogIn className="w-5 h-5" />
        <span>Login</span>
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

      {/* Form */}
      <div className="w-full flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-white">Forgot Password</h2>
          <p className="mb-4 text-sm text-gray-400">
            Forgot your password? Enter your email to receive a reset link.
          </p>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-400">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
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

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? "Sending..." : "Email Password Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;