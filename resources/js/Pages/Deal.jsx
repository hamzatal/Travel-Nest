
import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { MapPin } from "lucide-react";

const Deals = ({ auth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
      <Head title="About Us - Travel Nest" />
      <Navbar user={auth.user} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 mt-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            Deals <span className="text-blue-500">PAGE</span>
          </h1>
          <p className="text-xl mb-8 leading-relaxed text-gray-400">
            At Travel Nest, we’re passionate about making your travel dreams a
            reality. Our mission is to simplify trip planning, connect you with
            unforgettable destinations, and provide a seamless experience from
            start to finish.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Our <span className="text-blue-500">Story</span>
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Founded by a team of travel enthusiasts, Travel Nest started with a
            simple idea: to create a platform that inspires and empowers
            travelers. Whether you’re seeking a relaxing getaway or an
            adventurous journey, we’re here to guide you every step of the way.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Our <span className="text-blue-500">Mission</span>
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We aim to make travel accessible, enjoyable, and stress-free for
            everyone. By offering personalized recommendations, secure booking
            options, and top-notch support, we strive to be your trusted travel
            companion.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Choose <span className="text-blue-500">Travel Nest</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
              <p className="text-gray-400">
                Explore a world of possibilities with our extensive network of
                destinations.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-400">
                Book flights, hotels, and more with just a few clicks.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Our team is always here to assist you, day or night.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Deals;