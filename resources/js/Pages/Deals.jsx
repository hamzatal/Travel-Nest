import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Home,
    ChevronLeft,
    ChevronRight,
    Filter,
    Tags,
    Calendar,
    Star,
} from "lucide-react";
import NavBar from "../Components/Nav";
import Footer from "../Components/Footer";

export default function Deals({ offers = [], auth }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const itemsPerPage = 6;

    // Categories for filtering (example categories)
    const categories = [
        "Hotel",
        "Flight",
        "Cruise",
        "Package",
        "Adventure",
        "City Break",
    ];

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    // Toggle category selection
    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(
                selectedCategories.filter((c) => c !== category)
            );
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Sort options
    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "priceAsc", label: "Price: Low to High" },
        { value: "priceDesc", label: "Price: High to Low" },
        { value: "discount", label: "Biggest Discount" },
    ];

    // Filter and sort offers based on search query and filters
    const filteredOffers = offers
        .filter(
            (offer) =>
                (offer.title
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    offer.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                (selectedCategories.length === 0 ||
                    (offer.category &&
                        selectedCategories.includes(offer.category)))
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "priceAsc":
                    return (
                        (a.discount_price || a.price) -
                        (b.discount_price || b.price)
                    );
                case "priceDesc":
                    return (
                        (b.discount_price || b.price) -
                        (a.discount_price || a.price)
                    );
                case "discount":
                    const discountA = a.discount_price
                        ? (a.price - a.discount_price) / a.price
                        : 0;
                    const discountB = b.discount_price
                        ? (b.price - b.discount_price) / b.price
                        : 0;
                    return discountB - discountA;
                case "newest":
                default:
                    // Assuming newer items have higher IDs
                    return b.id - a.id;
            }
        });

    // Pagination logic
    const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
    const paginatedOffers = filteredOffers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Calculate discount percentage
    const calculateDiscount = (original, discounted) => {
        if (!discounted) return null;
        const percentage = Math.round(
            ((original - discounted) / original) * 100
        );
        return percentage;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300 relative">
            <Head title="Exclusive Travel Deals - Travel Nest" />

            <NavBar auth={auth} />

            {/* Hero Section */}
            <div className="relative h-72 md:h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
                <div className="absolute inset-0 bg-[url('/images/world.svg')] bg-no-repeat bg-center opacity-30 bg-fill"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-6xl font-extrabold mb-3 leading-tight"
                        >
                            Exclusive{" "}
                            <span className="text-green-400">Deals</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                            className="text-xl text-gray-300 mb-4 max-w-xl mx-auto"
                        >
                            Discover unbeatable offers for your next adventure
                        </motion.p>
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
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                {/* Search and Filter Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search for destinations, hotels, or deals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-48">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none transition-all duration-300"
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-all duration-300"
                            >
                                <Filter className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    Filters
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <AnimatePresence>
                        {filterOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-gray-800 bg-opacity-70 rounded-lg mb-6 border border-gray-700">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tags className="w-4 h-4 text-green-400" />
                                            <h3 className="text-lg font-semibold">
                                                Categories
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((category) => (
                                                <button
                                                    key={category}
                                                    onClick={() =>
                                                        toggleCategory(category)
                                                    }
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                                                        selectedCategories.includes(
                                                            category
                                                        )
                                                            ? "bg-green-600 text-white"
                                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    }`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results summary */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-400">
                            Showing{" "}
                            {filteredOffers.length > 0
                                ? (currentPage - 1) * itemsPerPage + 1
                                : 0}
                            -
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredOffers.length
                            )}{" "}
                            of {filteredOffers.length} deals
                        </p>
                        {selectedCategories.length > 0 && (
                            <button
                                onClick={() => setSelectedCategories([])}
                                className="text-green-400 hover:text-green-300 text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Offers Grid */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                >
                    <AnimatePresence mode="wait">
                        {paginatedOffers.length === 0 ? (
                            <motion.div
                                variants={fadeIn}
                                className="col-span-full text-center py-16"
                            >
                                <div className="max-w-md mx-auto">
                                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">
                                        No deals found
                                    </h3>
                                    <p className="text-gray-400 mb-6">
                                        We couldn't find any deals matching your
                                        search criteria. Try adjusting your
                                        filters or search query.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategories([]);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            paginatedOffers.map((offer) => (
                                <motion.div
                                    key={offer.id}
                                    variants={cardVariants}
                                    whileHover={{
                                        y: -10,
                                        transition: { duration: 0.3 },
                                    }}
                                    className="bg-gray-800 bg-opacity-70 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm border border-gray-700 flex flex-col"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                offer.image ||
                                                "/api/placeholder/640/320"
                                            }
                                            alt={offer.title}
                                            className="w-full h-48 object-cover"
                                            loading="lazy"
                                        />
                                        {offer.category && (
                                            <span className="absolute top-2 left-2 px-2 py-1 bg-gray-900 bg-opacity-70 rounded text-xs font-medium text-gray-300">
                                                {offer.category}
                                            </span>
                                        )}
                                        {calculateDiscount(
                                            offer.price,
                                            offer.discount_price
                                        ) && (
                                            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                {calculateDiscount(
                                                    offer.price,
                                                    offer.discount_price
                                                )}
                                                % OFF
                                            </div>
                                        )}
                                        {offer.featured && (
                                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-yellow-600 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                <Star className="w-3 h-3" />{" "}
                                                Featured
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">
                                            {offer.title}
                                        </h3>
                                        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">
                                            {offer.description}
                                        </p>
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="block text-gray-400 text-sm">
                                                        Price
                                                    </span>
                                                    <div className="flex items-baseline gap-2">
                                                        {offer.discount_price ? (
                                                            <>
                                                                <span className="text-lg font-bold text-green-400">
                                                                    $
                                                                    {
                                                                        offer.discount_price
                                                                    }
                                                                </span>
                                                                <span className="text-sm line-through text-gray-500">
                                                                    $
                                                                    {
                                                                        offer.price
                                                                    }
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-green-400">
                                                                ${offer.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {(offer.start_date ||
                                                    offer.end_date) && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>
                                                            {offer.end_date
                                                                ? `Until ${offer.end_date}`
                                                                : "Limited time"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/offer/${offer.id}`}
                                            className="w-full inline-block text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {filteredOffers.length > 0 && totalPages > 1 && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="flex justify-center items-center gap-2 mb-16"
                    >
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                currentPage === 1
                                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                    : "bg-gray-800 text-white hover:bg-gray-700"
                            } transition-all duration-300`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => {
                                // Show 5 page buttons max, with current page in the middle
                                const pageRange = 2; // show 2 pages on each side of current page
                                const startPage = Math.max(
                                    1,
                                    currentPage - pageRange
                                );
                                const endPage = Math.min(
                                    totalPages,
                                    currentPage + pageRange
                                );

                                if (
                                    (page >= startPage && page <= endPage) ||
                                    page === 1 ||
                                    page === totalPages
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                currentPage === page
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-800 text-white hover:bg-gray-700"
                                            } transition-all duration-300`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }

                                // Add ellipsis
                                if (page === startPage - 1 && page > 1) {
                                    return (
                                        <span
                                            key={`ellipsis-start`}
                                            className="text-gray-500"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                if (page === endPage + 1 && page < totalPages) {
                                    return (
                                        <span
                                            key={`ellipsis-end`}
                                            className="text-gray-500"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return null;
                            })}
                        </div>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                currentPage === totalPages
                                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                    : "bg-gray-800 text-white hover:bg-gray-700"
                            } transition-all duration-300`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

              
            </div>
            <Footer />
        </div>
    );
}

// Add this to support ChevronDown icon
const ChevronDown = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);
