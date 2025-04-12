import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { MapPin, Home } from "lucide-react";

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
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
            Forgot Your Password?
          </h2>

          <p className="text-gray-400 mb-6">
            Enter your email address and we will send you a link to reset your password.
          </p>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-500">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
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

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? "Sending..." : "Send Password Reset Link"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Remember your password?{" "}
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
}