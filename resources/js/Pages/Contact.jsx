import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, MessageSquare } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Notification from "../Components/Notification"; // استيراد مكون الإشعارات

const Contact = ({ auth }) => {
  const [notification, setNotification] = useState(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } =
    useForm({
      name: "",
      email: "",
      message: "",
    });

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    else if (data.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    else if (data.name.length > 50)
      newErrors.name = "Name cannot exceed 50 characters";

    if (!data.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email))
      newErrors.email = "Please enter a valid email address";
    else if (data.email.length > 100)
      newErrors.email = "Email cannot exceed 100 characters";

    if (!data.message) newErrors.message = "Message is required";
    else if (data.message.length < 10)
      newErrors.message = "Message must be at least 10 characters";
    else if (data.message.length > 500)
      newErrors.message = "Message cannot exceed 500 characters";

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

    post(route("contact.store"), {
      onSuccess: () => {
        setNotification({ type: "success", message: "Message sent successfully!" });
        reset();
      },
      onError: () => {
        setNotification({ type: "error", message: "Failed to send message. Try again." });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
      <Head title="Contact Us - Travel Nest" />
      <Navbar user={auth.user} />

      {/* عرض الإشعار باستخدام Notification.jsx */}
      <Notification message={notification?.message} type={notification?.type} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 mt-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Contact <span className="text-blue-500">Us</span>
          </h1>
          <p className="text-xl mb-8 leading-relaxed text-gray-400">
            We value your feedback and are here to assist you! Whether you have
            questions, suggestions, or need support, the Travel Nest team is
            committed to helping you plan your next adventure.
          </p>
        </div>

        <div className="w-full max-w-xl bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Send Us a <span className="text-blue-500">Message</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top 🙂-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className={`pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className={`pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="message"
                  value={data.message}
                  onChange={(e) => setData("message", e.target.value)}
                  className={`pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none h-32 ${
                    errors.message ? "border-red-500" : ""
                  }`}
                  placeholder="Write your message here..."
                />
              </div>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center"
            >
              {processing ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;