// resources/js/Pages/Auth/VerifyEmail.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home, UserPlus } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const VerifyEmail = ({ status }) => {
  const [notification, setNotification] = useState(null);

  const { post, processing } = useForm({});

  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"), {
      onSuccess: () => {
        setNotification({
          type: "success",
          message: "Verification link sent to your email!",
        });
        setTimeout(() => setNotification(null), 2000);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
      <Head title="Email Verification - Travel Nest" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      {/* Back to Register Button */}
      <Link
        href={route("register")}
        className="fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <UserPlus className="w-5 h-5" />
        <span>Register</span>
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

      {/* Content */}
      <div className="w-full flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800">
          <div className="text-center space-y-6">
            <MapPin className="w-16 h-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
          </div>
          <p className="mt-4 mb-4 text-sm text-gray-400">
            Thanks for signing up! Please verify your email address by clicking
            the link we sent you. Didn’t receive it? Resend below.
          </p>

          {status === "verification-link-sent" && (
            <div className="mb-4 text-sm font-medium text-green-400">
              A new verification link has been sent to your email.
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? "Sending..." : "Resend Verification Email"}
            </button>

            <div className="text-center">
              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="text-sm text-blue-400 hover:underline"
              >
                Log Out
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;