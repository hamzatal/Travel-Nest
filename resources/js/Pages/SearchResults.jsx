import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function SearchResults({ results = [], query = "" }) {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
            <Head title={`Search Results for "${query}" - Travel Nest`} />

            <Link
                href="/home"
                className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
            >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
            </Link>

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
                            Search Results for{" "}
                            <span className="text-green-400">
                                "{query || "All"}"
                            </span>
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

            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                >
                    {results.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            No results found for "{query}". Try a different
                            search term.
                        </div>
                    ) : (
                        results.map((item) => (
                            <motion.div
                                key={`${item.type}-${item.id}`}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3 },
                                }}
                                className="bg-gray-800 bg-opacity-70 rounded-xl p-6 shadow-2xl backdrop-blur-sm border border-gray-700"
                            >
                                <div className="relative mb-4">
                                    <img
                                        src={
                                            item.image ||
                                            "https://via.placeholder.com/640x480"
                                        }
                                        alt={item.title || item.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                        loading="lazy"
                                    />
                                    {item.discount_type && (
                                        <div
                                            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold text-white ${
                                                item.discount_type.includes(
                                                    "OFF"
                                                )
                                                    ? "bg-red-500"
                                                    : item.discount_type.includes(
                                                          "LIMITED"
                                                      )
                                                    ? "bg-blue-500"
                                                    : "bg-green-500"
                                            }`}
                                        >
                                            {item.discount_type}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">
                                    {item.title || item.name}
                                    <span className="text-sm text-gray-400 ml-2">
                                        ({item.type})
                                    </span>
                                </h3>
                                <p className="text-gray-300 mb-4 line-clamp-3">
                                    {item.description}
                                </p>
                                {item.type === "offer" && (
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="block text-gray-400 text-sm">
                                                    Original Price
                                                </span>
                                                <span
                                                    className={`text-lg font-bold ${
                                                        item.discount_price
                                                            ? "line-through text-gray-400"
                                                            : "text-green-400"
                                                    }`}
                                                >
                                                    ${item.price}
                                                </span>
                                            </div>
                                            {item.discount_price && (
                                                <div>
                                                    <span className="block text-gray-400 text-sm">
                                                        Discounted Price
                                                    </span>
                                                    <span className="text-lg font-bold text-green-400">
                                                        ${item.discount_price}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {(item.start_date || item.end_date) && (
                                            <div className="text-sm text-gray-400">
                                                Valid from:{" "}
                                                {item.start_date || "N/A"} to{" "}
                                                {item.end_date || "N/A"}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {item.type === "package" && (
                                    <div className="space-y-2 mb-4">
                                        <div>
                                            <span className="block text-gray-400 text-sm">
                                                Price
                                            </span>
                                            <span className="text-lg font-bold text-green-400">
                                                ${item.price}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <Link
                                    href={
                                        item.type === "offer"
                                            ? `/offer/${item.id}`
                                            : `/package/${item.id}`
                                    }
                                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                                >
                                    View Details
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
}
