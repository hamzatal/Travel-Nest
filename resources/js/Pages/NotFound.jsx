// resources/js/Pages/NotFound.jsx
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const NotFound = ({ auth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Head title="404 - Page Not Found" />
      <Navbar user={auth.user} />
      <main className="flex flex-col items-center justify-center px-6 md:px-16 py-20 max-w-7xl mx-auto gap-8 mt-16 min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="text-center space-y-6"
        >
          <AlertTriangle className="w-24 h-24 text-blue-500 mx-auto" />
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold">
            Oops! <span className="text-blue-500">Page Not Found</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            It seems you've wandered off the map. The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-300"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;