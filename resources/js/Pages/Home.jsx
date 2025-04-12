import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Head, usePage } from "@inertiajs/react";
import ChatBot from "../Components/ChatBot";
import Notification from "../Components/Notification";

const HomePage = ({ auth }) => {
  const { props } = usePage();
  const user = auth?.user || null;
  const successMessage = props.flash?.success || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300">
      <Head>
        <title>Travel Nest - Home</title>
        <meta
          name="description"
          content="Book unforgettable trips and explore beautiful destinations with Travel Nest."
        />
      </Head>

      <Navbar user={user} />

      <Notification message={successMessage} type="success" />

      <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-24 max-w-7xl mx-auto gap-12 mt-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Discover Your <span className="text-blue-500">Next Destination</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl">
            Book unforgettable trips, explore beautiful places, and experience adventure like never before with{" "}
            <strong>Travel Nest</strong>.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-300">
              Explore Now
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-500 rounded-full hover:bg-gray-100 text-white hover:text-gray-900 transition-all duration-300">
              <MapPin size={18} />
              Discover
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative"
        >
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Bali, Indonesia"
            loading="lazy"
            className="w-full rounded-3xl shadow-2xl"
          />
          <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-80 px-4 py-2 rounded-full flex items-center gap-2 shadow">
            <MapPin size={16} />
            <span>Bali, Indonesia</span>
          </div>
        </motion.div>
      </main>

      <section className="py-20 max-w-7xl mx-auto px-6 md:px-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h3 className="text-3xl font-bold text-center mb-12">
            Popular <span className="text-blue-500">Destinations</span>
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1602081593934-2b93e2c2a1e2", price: "$1,200" },
              { name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1545565078-6aa49e01e369", price: "$1,450" },
              { name: "Patagonia, Chile", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba", price: "$1,800" },
            ].map((destination) => (
              <motion.div
                key={destination.name}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="relative rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={destination.image} alt={destination.name} loading="lazy" className="w-full h-64 object-cover" />
                <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-80 px-4 py-2 rounded-full flex items-center gap-2 shadow">
                  <MapPin size={16} />
                  <span>{destination.name}</span>
                </div>
                <div className="p-4 bg-gray-800 bg-opacity-50">
                  <p className="text-blue-400 font-semibold">{destination.price}</p>
                  <button className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-all duration-300">
                    Book Now <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-900 to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 md:px-16 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your <span className="text-blue-500">Adventure</span> Today
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of travelers exploring the world with Travel Nest. Sign up for exclusive deals and updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
              aria-label="Email for newsletter"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>
      <ChatBot />

      <Footer />
    </div>
  );
};

export default HomePage;