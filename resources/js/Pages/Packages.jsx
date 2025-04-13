import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";

export default function Packages({ auth, packages }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Head title="Travel Packages - Travel Nest" />
      <Navbar user={auth.user} />

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Our Travel Packages</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition"
                >
                  {pkg.image && (
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{pkg.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{pkg.destination}</p>
                    <p className="text-gray-300 mt-2">{pkg.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-blue-400 font-semibold">${pkg.price}</span>
                      <span className="text-gray-400 text-sm">{pkg.duration}</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">
                No packages available at the moment.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}