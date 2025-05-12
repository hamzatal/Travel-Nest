import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    MapPin,
    Calendar,
    DollarSign,
    Tag,
    ChevronLeft,
    Star,
    Heart,
} from "lucide-react";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";

export default function PackageDetails({ package: pkg, auth }) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const calculateDiscount = (original, discounted) => {
        if (!discounted) return null;
        const percentage = Math.round(
            ((original - discounted) / original) * 100
        );
        return percentage;
    };

    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={18}
                    className={
                        i <= roundedRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                    }
                />
            );
        }
        return stars;
    };

    const serviceFee = 9.99;
    const bookingFee = 4.99;
    const basePrice = parseFloat(pkg.discount_price || pkg.price || 0);
    const totalPrice = basePrice + serviceFee + bookingFee;

    const baseUrl = "/storage/";
    const imageSrc = pkg.image
        ? `${baseUrl}${pkg.image}`
        : "https://via.placeholder.com/1200x800?text=No+Image";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
            <Head title={`${pkg.title} - Travel Nest`} />

            <Navbar
                user={auth?.user}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />

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
                            {pkg.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                            className="text-xl text-gray-300 mb-4 max-w-xl mx-auto"
                        >
                            <MapPin
                                className="inline-block mr-1 mb-1"
                                size={18}
                            />
                            {pkg.location || "Location not specified"}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="mb-8"
                >
                    <div className="flex items-center text-sm text-gray-400">
                        <Link
                            href="/packages"
                            className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Back to Packages
                        </Link>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        variants={fadeIn}
                        className="lg:col-span-2"
                    >
                        <div className="bg-gray-800 bg-opacity-70 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm border border-gray-700">
                            <div className="relative">
                                <img
                                    src={imageSrc}
                                    alt={pkg.title}
                                    className="w-full h-96 object-cover"
                                />
                                {pkg.tag && (
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-gray-900 bg-opacity-70 rounded-full text-sm font-medium text-gray-300">
                                        {pkg.tag}
                                    </span>
                                )}
                                {calculateDiscount(
                                    pkg.price,
                                    pkg.discount_price
                                ) && (
                                    <div className="absolute top-4 right-12 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {calculateDiscount(
                                            pkg.price,
                                            pkg.discount_price
                                        )}
                                        % OFF
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`absolute top-3 ${
                                        calculateDiscount(
                                            pkg.price,
                                            pkg.discount_price
                                        )
                                            ? "right-2"
                                            : "right-4"
                                    } bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-all duration-300`}
                                    aria-label="Add to favorites"
                                >
                                    <Heart
                                        size={20}
                                        className={
                                            isFavorite
                                                ? "text-red-500 fill-red-500"
                                                : "text-white"
                                        }
                                    />
                                </button>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-wrap gap-2 items-center mb-4">
                                    <div className="flex items-center">
                                        {renderStars(pkg.rating || 0)}
                                        <span className="text-gray-400 text-sm ml-2">
                                            ({pkg.rating || 0}/5)
                                        </span>
                                    </div>
                                    {pkg.tag && (
                                        <span className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-xs">
                                            {pkg.tag}
                                        </span>
                                    )}
                                    {pkg.is_featured && (
                                        <span className="px-3 py-1 bg-purple-600 bg-opacity-20 text-purple-400 rounded-full text-xs">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-4">
                                    About this package
                                </h2>

                                <div className="prose prose-lg prose-invert">
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">
                                        {pkg.description ||
                                            "No description available."}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold mb-4 text-blue-400">
                                        Price Details
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                        <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 flex-1">
                                            <div className="text-gray-400 text-sm mb-1">
                                                Starting from
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                {pkg.discount_price ? (
                                                    <>
                                                        <span className="text-2xl font-bold text-blue-400">
                                                            $
                                                            {pkg.discount_price}
                                                        </span>
                                                        <span className="text-sm line-through text-gray-500">
                                                            ${pkg.price}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-2xl font-bold text-blue-400">
                                                        ${pkg.price}
                                                    </span>
                                                )}
                                                <span className="text-sm text-gray-400">
                                                    / person
                                                </span>
                                            </div>
                                        </div>

                                        {calculateDiscount(
                                            pkg.price,
                                            pkg.discount_price
                                        ) && (
                                            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 flex-1">
                                                <div className="text-gray-400 text-sm mb-1">
                                                    You save
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-green-400">
                                                        $
                                                        {(
                                                            pkg.price -
                                                            pkg.discount_price
                                                        ).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-gray-400">
                                                        (
                                                        {calculateDiscount(
                                                            pkg.price,
                                                            pkg.discount_price
                                                        )}
                                                        % off)
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            variants={fadeIn}
                            className="mt-8 bg-gray-800 bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl backdrop-blur-sm border border-gray-700"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-blue-400">
                                Location Information
                            </h3>
                            <p className="text-gray-300 mb-4">
                                <MapPin
                                    className="inline-block mr-2 mb-1"
                                    size={18}
                                />
                                {pkg.location || "Location not specified"}
                            </p>
                            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 mt-4">
                                <p className="text-gray-400">
                                    This package is located in{" "}
                                    {pkg.location || "the specified location"}.
                                    The exact details and itinerary will be
                                    provided after booking.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        variants={fadeIn}
                        className="space-y-6"
                    >
                        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-gray-700 sticky top-24 z-10">
                            <h3 className="text-xl font-semibold mb-4">
                                Book this package
                            </h3>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400">
                                        Price per person
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        {pkg.discount_price ? (
                                            <>
                                                <span className="text-lg font-bold text-blue-400">
                                                    ${pkg.discount_price}
                                                </span>
                                                <span className="text-sm line-through text-gray-500">
                                                    ${pkg.price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-blue-400">
                                                ${pkg.price}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-400">
                                        Service fee
                                    </span>
                                    <span className="text-gray-300">
                                        ${serviceFee}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">
                                        Booking fee
                                    </span>
                                    <span className="text-gray-300">
                                        ${bookingFee}
                                    </span>
                                </div>

                                <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-lg">
                                        $
                                        {typeof totalPrice === "number"
                                            ? totalPrice.toFixed(2)
                                            : "0.00"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href={`/book?package_id=${pkg.id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Book Now
                                </Link>

                                <button
                                    className="block w-full bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 text-center py-3 rounded-lg transition-all duration-300"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    {isFavorite
                                        ? "Saved to Favorites"
                                        : "Save to Favorites"}
                                </button>
                            </div>

                            <div className="mt-4 text-center text-sm text-gray-400">
                                No payment required to book
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="text-center bg-blue-900 bg-opacity-40 rounded-xl p-8 shadow-xl max-w-4xl mx-auto mt-16 border border-blue-800"
                >
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to Experience{" "}
                        <span className="text-blue-400">{pkg.title}</span>?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Book your package now and create unforgettable memories
                        with this amazing experience.
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`/book?package_id=${pkg.id}`}
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-300"
                    >
                        Book Now
                    </motion.a>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
