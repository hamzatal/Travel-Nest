import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import Navbar from "../../Components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Calendar, Plane, Heart } from "lucide-react";

export default function Profile() {
  const { props } = usePage();
  const user = props.auth?.user || null;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <Head title="Error" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-400">You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const bookedTrips = [
    { id: 1, destination: "Paris, France", date: "2025-06-15", status: "Confirmed" },
    { id: 2, destination: "Tokyo, Japan", date: "2025-08-20", status: "Pending" },
  ];

  const favoriteDestinations = [
    { id: 1, name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1605462879608-8a9aa31b1d77" },
    { id: 2, name: "New York, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Head title="User Profile - Travel Nest" />
      <Navbar user={user} />

      <div className="pt-20 max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6"
        >
          {/* User Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-300" />
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2"
            >
              <Link href="#" className="text-white">
                <User className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-gray-400 mt-1">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start mt-2 space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <p className="text-gray-400">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <p className="mt-1 text-lg text-gray-100">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <p className="mt-1 text-lg text-gray-100">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Account Type</label>
                <p className="mt-1 text-lg text-gray-100">{user.is_admin ? "Admin" : "User"}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Edit Profile
            </motion.button>
          </motion.div>

          {/* Travel Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Booked Trips */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Plane className="w-6 h-6 text-blue-400" />
                <span>Your Booked Trips</span>
              </h3>
              {bookedTrips.length > 0 ? (
                <div className="space-y-4">
                  {bookedTrips.map((trip) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="text-lg font-medium">{trip.destination}</p>
                        <p className="text-sm text-gray-400">Date: {trip.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          trip.status === "Confirmed"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-600 text-black"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">You haven't booked any trips yet.</p>
              )}
            </div>

            {/* Favorite Destinations */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-400" />
                <span>Favorite Destinations</span>
              </h3>
              {favoriteDestinations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteDestinations.map((destination) => (
                    <motion.div
                      key={destination.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-lg overflow-hidden"
                    >
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <p className="text-white font-semibold">{destination.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">You haven't added any favorite destinations yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}