import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Home, Calendar, DollarSign, Tag } from "lucide-react";
import NavBar from "../Components/Nav";
import Footer from "../Components/Footer";

export default function OfferDetails({ offer, auth }) {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
            <Head title={`${offer.title} - Travel Nest`} />

            <NavBar auth={auth} />
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"></div>
           
            {/* Hero Section */}
            <div className="relative h-64 md:h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                <div className="absolute inset-0 bg-[url('/images/world.svg')] bg-no-repeat bg-center opacity-30 bg-fill"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-4xl md:text-6xl font-extrabold mb-2 leading-tight"
                        >
                            {offer.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 md:px-16 py-12">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl backdrop-blur-sm border border-gray-700"
                >
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image */}
                        <div className="md:w-1/2">
                            <img
                                src={
                                    offer.image ||
                                    "https://via.placeholder.com/640x480"
                                }
                                alt={offer.title}
                                className="w-full h-64 object-cover rounded-lg"
                                loading="lazy"
                            />
                            {offer.discount_type && (
                                <div
                                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold text-white ${
                                        offer.discount_type.includes("OFF")
                                            ? "bg-red-500"
                                            : offer.discount_type.includes(
                                                  "LIMITED"
                                              )
                                            ? "bg-blue-500"
                                            : "bg-green-500"
                                    }`}
                                >
                                    {offer.discount_type}
                                </div>
                            )}
                        </div>
                        {/* Details */}
                        <div className="md:w-1/2 space-y-4">
                            <h2 className="text-2xl font-bold text-green-400">
                                Offer Details
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {offer.description}
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                                    <span className="text-gray-300">
                                        Original Price:{" "}
                                        <span
                                            className={
                                                offer.discount_price
                                                    ? "line-through"
                                                    : "text-green-400"
                                            }
                                        >
                                            ${offer.price}
                                        </span>
                                    </span>
                                </div>
                                {offer.discount_price && (
                                    <div className="flex items-center">
                                        <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                                        <span className="text-gray-300">
                                            Discounted Price:{" "}
                                            <span className="text-green-400">
                                                ${offer.discount_price}
                                            </span>
                                        </span>
                                    </div>
                                )}
                                {offer.discount_type && (
                                    <div className="flex items-center">
                                        <Tag className="w-5 h-5 text-green-400 mr-2" />
                                        <span className="text-gray-300">
                                            Discount Type: {offer.discount_type}
                                        </span>
                                    </div>
                                )}
                                {(offer.start_date || offer.end_date) && (
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-green-400 mr-2" />
                                        <span className="text-gray-300">
                                            Valid from:{" "}
                                            {offer.start_date || "N/A"} to{" "}
                                            {offer.end_date || "N/A"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/booking"
                                className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="text-center bg-green-900 bg-opacity-40 rounded-xl p-8 shadow-xl max-w-3xl mx-auto mt-12 border border-green-800"
                >
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to Book this{" "}
                        <span className="text-green-400">Offer</span>?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Take advantage of this exclusive deal and start planning
                        your next adventure with Travel Nest.
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/booking"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                    >
                        Book Now
                    </motion.a>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
