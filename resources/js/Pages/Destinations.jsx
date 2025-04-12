// resources/js/Pages/Destinations.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ChatBot from "../Components/ChatBot";


const Destinations = ({ auth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300">
      <Head title="Destinations" />
      <Navbar user={auth.user} />
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">Destinations</h1>
        <p className="text-gray-400">Explore our amazing travel destinations coming soon!</p>
      </div>
      <ChatBot />
      <Footer />
    </div>
  );
};

export default Destinations;