import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Filter,
    Tags,
    Calendar,
    Star,
    Bookmark,
    BookOpen,
} from "lucide-react";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import toast, { Toaster } from "react-hot-toast";

const UserBookings = ({ auth }) => {
    const { props } = usePage();
    const { bookings = [], favorites = [], flash = {} } = props;
    const user = auth?.user || null;

    const [activeTab, setActiveTab] = useState("bookings");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const itemsPerPage = 8;

    const bookingStatuses = ["confirmed", "pending", "cancelled"];
    const favoriteCategories = [
        "Hotel",
        "Flight",
        "Cruise",
        "Package",
        "Adventure",
        "City Break",
        "Luxury",
    ];

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

    const toggleFilter = (filter) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter((f) => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
        setCurrentPage(1);
    };

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "priceAsc", label: "Price: Low to High" },
        { value: "priceDesc", label: "Price: High to Low" },
    ];

    const filterItems = (items) => {
        return items
            .filter((item) => {
                const entity = item.destination || item.offer || item.package;
                if (!entity) return false;
                const matchesSearch =
                    (entity.name || entity.title)
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    entity.location
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    entity.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase());
                const matchesFilter =
                    selectedFilters.length === 0 ||
                    (activeTab === "bookings"
                        ? selectedFilters.includes(item.status)
                        : entity.tag && selectedFilters.includes(entity.tag)) ||
                    (entity.discount_type &&
                        selectedFilters.includes(entity.discount_type));
                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => {
                const entityA = a.destination || a.offer || a.package;
                const entityB = b.destination || b.offer || b.package;
                if (!entityA || !entityB) return 0;
                switch (sortBy) {
                    case "priceAsc":
                        return (
                            (entityA.discount_price || entityA.price) -
                            (entityB.discount_price || entityB.price)
                        );
                    case "priceDesc":
                        return (
                            (entityB.discount_price || entityB.price) -
                            (entityA.discount_price || entityA.price)
                        );
                    case "newest":
                    default:
                        return new Date(b.created_at) - new Date(a.created_at);
                }
            });
    };

    const filteredItems =
        activeTab === "bookings"
            ? filterItems(bookings)
            : filterItems(favorites);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
        setSelectedFilters([]);
    }, [activeTab, searchQuery]);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const calculateDiscount = (original, discounted) => {
        if (!discounted || isNaN(original) || isNaN(discounted)) return null;
        const percentage = Math.round(
            ((original - discounted) / original) * 100
        );
        return percentage;
    };

    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round((rating || 0) * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={14}
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return "N/A";
        }
    };

    return (
        <div
            className={`min-h-screen transition-all duration-300 ${
                isDarkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
                    : "bg-gradient-to-br from-blue-50 via-white to-gray-100 text-gray-900"
            }`}
        >
            <Head>
                <title>My Bookings & Favorites - Travel Nest</title>
                <meta
                    name="description"
                    content="View your booked trips and favorited destinations with Travel Nest."
                />
            </Head>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

            <Navbar
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />

            {/* Hero Section */}
            <section className="relative h-80 md:h-90 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-800/80"></div>
                <div className="absolute inset-0 bg-[url('/images/world.svg')] bg-no-repeat bg-center opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1
                            className={`text-4xl md:text-5xl font-extrabold mb-4 ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            My{" "}
                            <span className="text-blue-500">
                                Bookings & Favorites
                            </span>
                        </h1>
                        <p
                            className={`text-lg md:text-xl ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                            } max-w-2xl mx-auto`}
                        >
                            Manage your upcoming trips and favorite destinations
                            with ease
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section
                className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    {/* Tabs */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mb-8"
                    >
                        <div className="flex justify-center border-b border-gray-700/50">
                            <button
                                onClick={() => setActiveTab("bookings")}
                                className={`flex-1 sm:flex-none py-3 px-6 text-center font-semibold text-lg transition-all duration-300 rounded-t-lg ${
                                    activeTab === "bookings"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : isDarkMode
                                        ? "text-gray-400 hover:text-gray-300"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <BookOpen className="inline-block w-5 h-5 mr-2" />
                                Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab("favorites")}
                                className={`flex-1 sm:flex-none py-3 px-6 text-center font-semibold text-lg transition-all duration-300 rounded-t-lg ${
                                    activeTab === "favorites"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : isDarkMode
                                        ? "text-gray-400 hover:text-gray-300"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Bookmark className="inline-block w-5 h-5 mr-2" />
                                Favorites
                            </button>
                        </div>
                    </motion.div>

                    {/* Search and Filters */}
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
                                    placeholder="Search trips or locations..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className={`w-full pl-12 pr-4 py-3 rounded-full text-lg ${
                                        isDarkMode
                                            ? "bg-gray-800 text-gray-300 border-gray-700"
                                            : "bg-gray-100 text-gray-800 border-gray-200"
                                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                                />
                                <Search
                                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                        isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    } w-5 h-5`}
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-48">
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className={`w-full px-4 py-3 rounded-full text-lg ${
                                            isDarkMode
                                                ? "bg-gray-800 text-gray-300 border-gray-700"
                                                : "bg-gray-100 text-gray-800 border-gray-200"
                                        } border focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-300`}
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
                                    <ChevronDown
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                        } h-4 w-4`}
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterOpen(!filterOpen)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-full text-lg ${
                                        isDarkMode
                                            ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                                            : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                                    } border transition-all duration-300`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Filters
                                    </span>
                                </motion.button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className={`p-6 rounded-2xl shadow-lg ${
                                            isDarkMode
                                                ? "bg-gray-800 border-gray-700"
                                                : "bg-white border-gray-200"
                                        } border mb-6`}
                                    >
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Tags className="w-5 h-5 text-blue-500" />
                                                <h3
                                                    className={`text-lg font-semibold ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {activeTab === "bookings"
                                                        ? "Status"
                                                        : "Categories"}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {(activeTab === "bookings"
                                                    ? bookingStatuses
                                                    : favoriteCategories
                                                ).map((filter) => (
                                                    <motion.button
                                                        key={filter}
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() =>
                                                            toggleFilter(filter)
                                                        }
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                            selectedFilters.includes(
                                                                filter
                                                            )
                                                                ? "bg-blue-600 text-white"
                                                                : isDarkMode
                                                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {filter}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-between items-center mb-6">
                            <p
                                className={`text-sm ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                Showing{" "}
                                {filteredItems.length > 0
                                    ? (currentPage - 1) * itemsPerPage + 1
                                    : 0}
                                -
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    filteredItems.length
                                )}{" "}
                                of {filteredItems.length}{" "}
                                {activeTab === "bookings"
                                    ? "bookings"
                                    : "favorites"}
                            </p>
                            {selectedFilters.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedFilters([])}
                                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                                >
                                    Clear Filters
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Cards Grid */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                    >
                        <AnimatePresence mode="popLayout">
                            {paginatedItems.length === 0 ? (
                                <motion.div
                                    variants={fadeIn}
                                    className="col-span-full text-center py-16"
                                >
                                    <div className="max-w-md mx-auto">
                                        <Search
                                            className={`w-16 h-16 mx-auto mb-4 ${
                                                isDarkMode
                                                    ? "text-gray-600"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                        <h3
                                            className={`text-2xl font-bold mb-2 ${
                                                isDarkMode
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            No{" "}
                                            {activeTab === "bookings"
                                                ? "Bookings"
                                                : "Favorites"}{" "}
                                            Found
                                        </h3>
                                        <p
                                            className={`text-base mb-6 ${
                                                isDarkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {activeTab === "bookings"
                                                ? "You haven't booked any trips yet. Explore our destinations to start planning!"
                                                : "You haven't favorited any destinations yet. Find your favorite trips!"}
                                        </p>
                                        <Link
                                            href="/destinations"
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium ${
                                                isDarkMode
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                            } transition-all duration-300`}
                                        >
                                            Explore Destinations
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                paginatedItems.map((item) => {
                                    const entity =
                                        item.destination ||
                                        item.offer ||
                                        item.package;
                                    if (!entity) return null;
                                    const isBooking = activeTab === "bookings";
                                    return (
                                        <motion.div
                                            key={`${activeTab}-${item.id}`}
                                            variants={cardVariants}
                                            layout
                                            whileHover={{
                                                y: -8,
                                                transition: { duration: 0.3 },
                                            }}
                                            className={`rounded-2xl overflow-hidden shadow-lg ${
                                                isDarkMode
                                                    ? "bg-gray-800 hover:bg-gray-750"
                                                    : "bg-white hover:shadow-xl"
                                            } border ${
                                                isDarkMode
                                                    ? "border-gray-700"
                                                    : "border-gray-200"
                                            } flex flex-col group transition-all duration-300`}
                                        >
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={
                                                        entity.image ||
                                                        "https://via.placeholder.com/640x480?text=No+Image"
                                                    }
                                                    alt={
                                                        entity.name ||
                                                        entity.title
                                                    }
                                                    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/640x480?text=No+Image";
                                                    }}
                                                />
                                                {(entity.tag ||
                                                    entity.discount_type) && (
                                                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 rounded-full text-xs font-medium text-white">
                                                        {entity.tag ||
                                                            entity.discount_type}
                                                    </span>
                                                )}
                                                {calculateDiscount(
                                                    entity.price,
                                                    entity.discount_price
                                                ) && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        {calculateDiscount(
                                                            entity.price,
                                                            entity.discount_price
                                                        )}
                                                        % OFF
                                                    </div>
                                                )}
                                                {isBooking && (
                                                    <span className="absolute top-3 right-3 px-3 py-1 bg-green-600 rounded-full text-xs font-medium text-white">
                                                        {item.status}
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3
                                                        className={`text-lg font-bold line-clamp-1 ${
                                                            isDarkMode
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {entity.name ||
                                                            entity.title}
                                                    </h3>
                                                </div>
                                                {entity.location && (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MapPin
                                                            size={16}
                                                            className="text-blue-500 flex-shrink-0"
                                                        />
                                                        <span
                                                            className={`text-sm ${
                                                                isDarkMode
                                                                    ? "text-gray-300"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {entity.location}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 mb-4">
                                                    {renderStars(
                                                        entity.rating || 0
                                                    )}
                                                    <span
                                                        className={`text-sm ml-2 ${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        ({entity.rating || 0}/5)
                                                    </span>
                                                </div>
                                                <p
                                                    className={`text-sm mb-4 line-clamp-2 ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {entity.description ||
                                                        "No description available."}
                                                </p>
                                                {isBooking ? (
                                                    <>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Calendar
                                                                size={16}
                                                                className="text-blue-500"
                                                            />
                                                            <span
                                                                className={`text-sm ${
                                                                    isDarkMode
                                                                        ? "text-gray-300"
                                                                        : "text-gray-600"
                                                                }`}
                                                            >
                                                                {formatDate(
                                                                    item.check_in
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    item.check_out
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span
                                                                className={`text-sm ${
                                                                    isDarkMode
                                                                        ? "text-gray-300"
                                                                        : "text-gray-600"
                                                                }`}
                                                            >
                                                                Guests:{" "}
                                                                {item.guests}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    entity.end_date && (
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Calendar
                                                                size={16}
                                                                className="text-blue-500"
                                                            />
                                                            <span
                                                                className={`text-sm ${
                                                                    isDarkMode
                                                                        ? "text-gray-300"
                                                                        : "text-gray-600"
                                                                }`}
                                                            >
                                                                Valid until{" "}
                                                                {formatDate(
                                                                    entity.end_date
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <span
                                                                className={`block text-xs font-medium ${
                                                                    isDarkMode
                                                                        ? "text-gray-400"
                                                                        : "text-gray-500"
                                                                }`}
                                                            >
                                                                {isBooking
                                                                    ? "Total Price"
                                                                    : "Starting from"}
                                                            </span>
                                                            <div className="flex items-baseline gap-2">
                                                                {isBooking ? (
                                                                    <span
                                                                        className={`text-lg font-bold text-blue-500`}
                                                                    >
                                                                        $
                                                                        {parseFloat(
                                                                            item.total_price
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                ) : entity.discount_price ? (
                                                                    <>
                                                                        <span
                                                                            className={`text-lg font-bold text-blue-500`}
                                                                        >
                                                                            $
                                                                            {parseFloat(
                                                                                entity.discount_price
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={`text-sm line-through ${
                                                                                isDarkMode
                                                                                    ? "text-gray-400"
                                                                                    : "text-gray-500"
                                                                            }`}
                                                                        >
                                                                            $
                                                                            {parseFloat(
                                                                                entity.price
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span
                                                                        className={`text-lg font-bold text-blue-500`}
                                                                    >
                                                                        $
                                                                        {parseFloat(
                                                                            entity.price
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                )}
                                                                {!isBooking && (
                                                                    <span
                                                                        className={`text-xs ${
                                                                            isDarkMode
                                                                                ? "text-gray-400"
                                                                                : "text-gray-500"
                                                                        }`}
                                                                    >
                                                                        / person
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={
                                                            isBooking
                                                                ? `/bookings/${item.id}`
                                                                : `/destinations/${entity.id}`
                                                        }
                                                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-medium ${
                                                            isDarkMode
                                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                                        } transition-all duration-300 transform group-hover:shadow-lg`}
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Pagination */}
                    {filteredItems.length > 0 && totalPages > 1 && (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="flex justify-center items-center gap-2 mb-16"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                    currentPage === 1
                                        ? isDarkMode
                                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : isDarkMode
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                } transition-all duration-300`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => {
                                    const pageRange = 2;
                                    const startPage = Math.max(
                                        1,
                                        currentPage - pageRange
                                    );
                                    const endPage = Math.min(
                                        totalPages,
                                        currentPage + pageRange
                                    );

                                    if (
                                        (page >= startPage &&
                                            page <= endPage) ||
                                        page === 1 ||
                                        page === totalPages
                                    ) {
                                        return (
                                            <motion.button
                                                key={page}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                                                    currentPage === page
                                                        ? "bg-blue-600 text-white"
                                                        : isDarkMode
                                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                } transition-all duration-300`}
                                            >
                                                {page}
                                            </motion.button>
                                        );
                                    }

                                    if (page === startPage - 1 && page > 1) {
                                        return (
                                            <span
                                                key={`ellipsis-start`}
                                                className={`text-sm ${
                                                    isDarkMode
                                                        ? "text-gray-500"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    if (
                                        page === endPage + 1 &&
                                        page < totalPages
                                    ) {
                                        return (
                                            <span
                                                key={`ellipsis-end`}
                                                className={`text-sm ${
                                                    isDarkMode
                                                        ? "text-gray-500"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    return null;
                                })}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                    currentPage === totalPages
                                        ? isDarkMode
                                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : isDarkMode
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                } transition-all duration-300`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

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

export default UserBookings;
