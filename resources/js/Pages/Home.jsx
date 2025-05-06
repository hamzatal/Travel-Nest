import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    ArrowRight,
    MessageCircle,
    X,
    ArrowUp,
    Heart,
    TrendingUp,
    Shield,
    Tag,
    Award,
    Compass,
    Image,
    Coffee,
    Globe,
    Briefcase,
    Gift,
    UserCheck,
    Sun,
    ArrowLeft,
    ArrowRight as ChevronRight,
    CalendarX,
    Users,
    Search,
    Sparkles,
} from "lucide-react";
import { Head, usePage, Link } from "@inertiajs/react";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import ChatBot from "../Components/ChatBot";

const HomePage = ({ auth }) => {
    const { props } = usePage();
    const {
        heroSections = [],
        flash = {},
        offers = [],
        destinations = [],
    } = props;
    const user = auth?.user || null;
    const successMessage = flash?.success || null;
    const searchRef = useRef(null);

    // UI states
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);

    // Journey Planner states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [suggestions, setSuggestions] = useState([]);

    // Mocked data for inspiration section
    const inspirationItems = [
        {
            id: 1,
            title: "Beach Getaways",
            image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a",
            count: "4,230+ destinations",
        },
        {
            id: 2,
            title: "Mountain Retreats",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff877c",
            count: "2,450+ destinations",
        },
        {
            id: 3,
            title: "Cultural Experiences",
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
            count: "3,120+ destinations",
        },
        {
            id: 4,
            title: "Urban Adventures",
            image: "https://images.unsplash.com/photo-1514565131-fce0801e5785",
            count: "1,890+ destinations",
        },
    ];

    // Feature toggles
    const toggleChat = () => setIsChatOpen(!isChatOpen);
    const handleCloseTooltip = () => setIsTooltipVisible(false);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Scroll to search section
    const scrollToSearch = () => {
        searchRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Track scroll position for UI effects
    useEffect(() => {
        const handleScroll = () => setScrollPosition(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto hide tooltip after delay
    useEffect(() => {
        const timer = setTimeout(() => setIsTooltipVisible(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    // Auto advance slider for hero sections
    useEffect(() => {
        if (heroSections.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSections.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [heroSections]);

    // Journey Planner: Filter suggestions based on search query and category
    useEffect(() => {
        const filterSuggestions = () => {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = [...destinations, ...offers].filter((item) => {
                const matchesQuery =
                    (item.name?.toLowerCase().includes(lowerQuery) ||
                        item.title?.toLowerCase().includes(lowerQuery) ||
                        item.description?.toLowerCase().includes(lowerQuery) ||
                        item.location?.toLowerCase().includes(lowerQuery) ||
                        item.destination?.toLowerCase().includes(lowerQuery)) &&
                    (selectedCategory === "all" ||
                        item.category?.toLowerCase() ===
                            selectedCategory.toLowerCase());
                return matchesQuery;
            });
            setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
        };
        filterSuggestions();
    }, [searchQuery, selectedCategory, destinations, offers]);

    // Calculate discount percentage
    const calculateDiscount = (original, discounted) => {
        if (!discounted) return null;
        const percentage = Math.round(
            ((original - discounted) / original) * 100
        );
        return percentage;
    };

    // Handle "Surprise Me" button
    const handleSurpriseMe = () => {
        const randomItem = [...destinations, ...offers][
            Math.floor(Math.random() * (destinations.length + offers.length))
        ];
        if (randomItem) {
            setSuggestions([randomItem]);
        }
    };

    // Clear search input
    const clearSearch = () => {
        setSearchQuery("");
        setSuggestions([]);
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
                <title>Travel Nest</title>
                <meta
                    name="description"
                    content="Book unforgettable trips, explore beautiful destinations, and find the best travel deals with Travel Nest."
                />
            </Head>
            <Navbar
                user={user}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />

            {/* Floating Back to Top Button */}
            {/* {scrollPosition > 500 && (
                <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    aria-label="Back to Top"
                >
                    <ArrowUp size={22} className="animate-bounce" />
                </motion.button>
            )} */}

            {/* Hero Carousel Section */}
            <section className="relative h-screen w-full overflow-hidden">
                {heroSections.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xl">
                        No hero sections available. Please add some in the admin
                        dashboard.
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gray-900">
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.4, 0, 0.2, 1],
                                    }}
                                    className="absolute inset-0"
                                >
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                                        <img
                                            src={
                                                heroSections[currentSlide]
                                                    ?.image ||
                                                "https://via.placeholder.com/1920x1080"
                                            }
                                            alt={
                                                heroSections[currentSlide]
                                                    ?.title || "Hero Image"
                                            }
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pt-44">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="max-w-5xl mx-auto text-center px-6"
                            >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                                    {heroSections[currentSlide]?.title ||
                                        "Welcome to Travel Nest"}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto font-light">
                                    {heroSections[currentSlide]?.subtitle ||
                                        "Plan your next adventure with us."}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                    <Link
                                        href="/booking"
                                        className="px-8 py-4 bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-lg min-w-48 text-center"
                                    >
                                        {heroSections[currentSlide]?.cta_text ||
                                            "Start Planning"}
                                    </Link>
                                    <Link
                                        href="/destinations"
                                        className="flex items-center gap-2 px-8 py-4 border-2 border-white/80 rounded-full hover:bg-white/10 transition-all duration-300 font-medium text-white"
                                        aria-label="Explore Map"
                                    >
                                        <MapPin size={20} />
                                        Explore Destinations
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Navigation arrows */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 z-20">
                            <button
                                onClick={() =>
                                    setCurrentSlide((prev) =>
                                        prev === 0
                                            ? heroSections.length - 1
                                            : prev - 1
                                    )
                                }
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                                aria-label="Previous slide"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentSlide((prev) =>
                                        prev === heroSections.length - 1
                                            ? 0
                                            : prev + 1
                                    )
                                }
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                                aria-label="Next slide"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>

                        {/* Slide indicators */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20">
                            {heroSections.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        currentSlide === index
                                            ? "w-8 bg-white"
                                            : "w-3 bg-white/50"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Journey Planner (Modern Filter) Section */}
            <section
                className="relative py-8 bg-white -mt-0 z-20"
                ref={searchRef}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative bg-white rounded-3xl p-6 shadow-lg border border-gray-200"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
                            Discover Your{" "}
                            <span className="text-blue-600">
                                Next Adventure
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 text-center mb-6 max-w-2xl mx-auto">
                            Filter destinations by category or search for your
                            dream trip.
                        </p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative flex items-center mb-6"
                        >
                            <div className="relative w-full max-w-3xl mx-auto">
                                <Search
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600"
                                    size={24}
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search destinations, experiences, or keywords..."
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-800 text-lg font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-all duration-300"
                                        aria-label="Clear search"
                                    >
                                        <X size={24} />
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Category Filters and Surprise Me */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
                        >
                            <div className="flex flex-wrap justify-center gap-3">
                                {[
                                    "All",
                                    "Beach",
                                    "Adventure",
                                    "Cultural",
                                    "Urban",
                                ].map((category) => (
                                    <motion.button
                                        key={category}
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow:
                                                "0 0 10px rgba(59, 130, 246, 0.3)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                            setSelectedCategory(
                                                category.toLowerCase()
                                            )
                                        }
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                            selectedCategory ===
                                            category.toLowerCase()
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                        }`}
                                    >
                                        {category === "All" && (
                                            <Compass size={16} />
                                        )}
                                        {category === "Beach" && (
                                            <Sun size={16} />
                                        )}
                                        {category === "Adventure" && (
                                            <MapPin size={16} />
                                        )}
                                        {category === "Cultural" && (
                                            <Globe size={16} />
                                        )}
                                        {category === "Urban" && (
                                            <Briefcase size={16} />
                                        )}
                                        {category}
                                    </motion.button>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow:
                                        "0 0 15px rgba(59, 130, 246, 0.5)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSurpriseMe}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                            >
                                <Sparkles size={20} />
                                Surprise Me
                            </motion.button>
                        </motion.div>

                        {/* Suggestions */}
                        <AnimatePresence>
                            {suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                >
                                    {suggestions.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={
                                                item.name
                                                    ? `/destinations/${item.id}`
                                                    : `/offers/${item.id}`
                                            }
                                            className="relative bg-white rounded-xl p-4 hover:bg-gray-50 transition-all duration-300 shadow-md border border-gray-200 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={
                                                        item.image ||
                                                        "https://via.placeholder.com/64x64"
                                                    }
                                                    alt={
                                                        item.name || item.title
                                                    }
                                                    className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div>
                                                    <h3 className="text-gray-800 font-semibold text-lg">
                                                        {item.name ||
                                                            item.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {item.location ||
                                                            item.destination}
                                                    </p>
                                                    <p className="text-blue-600 text-sm font-medium">
                                                        $
                                                        {item.discount_price ||
                                                            item.price}
                                                    </p>
                                                </div>
                                            </div>
                                            {calculateDiscount(
                                                item.price,
                                                item.discount_price
                                            ) && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    {calculateDiscount(
                                                        item.price,
                                                        item.discount_price
                                                    )}
                                                    % OFF
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Featured Promotions */}
            <section
                className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h2
                                className={`text-3xl font-bold ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                            >
                                Special{" "}
                                <span className="text-blue-600">Offers</span>
                            </h2>
                            <Link
                                href="/deals"
                                className={`flex items-center gap-1 ${
                                    isDarkMode
                                        ? "text-blue-400"
                                        : "text-blue-600"
                                } hover:underline`}
                            >
                                View all deals <ArrowRight size={16} />
                            </Link>
                        </div>

                        {offers && offers.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                No offers available at the moment.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {offers &&
                                    offers.map((offer) => (
                                        <motion.div
                                            key={offer.id}
                                            whileHover={{
                                                y: -10,
                                                transition: { duration: 0.3 },
                                            }}
                                            className={`rounded-xl overflow-hidden shadow-lg ${
                                                isDarkMode
                                                    ? "bg-gray-800"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={
                                                        offer.image ||
                                                        "https://via.placeholder.com/640x480"
                                                    }
                                                    alt={offer.title}
                                                    className="w-full h-48 object-cover"
                                                    loading="lazy"
                                                />
                                                {calculateDiscount(
                                                    offer.price,
                                                    offer.discount_price
                                                ) && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                        {calculateDiscount(
                                                            offer.price,
                                                            offer.discount_price
                                                        )}
                                                        % OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <h3
                                                    className={`text-xl font-bold mb-2 ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {offer.title}
                                                </h3>
                                                <p
                                                    className={`mb-4 ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {offer.description}
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span
                                                                className={`block ${
                                                                    isDarkMode
                                                                        ? "text-gray-400"
                                                                        : "text-gray-500"
                                                                } text-sm`}
                                                            >
                                                                Original Price
                                                            </span>
                                                            <span
                                                                className={`text-xl font-bold ${
                                                                    offer.discount_price
                                                                        ? "line-through text-gray-400"
                                                                        : "text-blue-600"
                                                                }`}
                                                            >
                                                                ${offer.price}
                                                            </span>
                                                        </div>
                                                        {offer.discount_price && (
                                                            <div>
                                                                <span
                                                                    className={`block ${
                                                                        isDarkMode
                                                                            ? "text-gray-400"
                                                                            : "text-gray-500"
                                                                    } text-sm`}
                                                                >
                                                                    Discounted
                                                                    Price
                                                                </span>
                                                                <span className="text-blue-600 font-bold text-xl">
                                                                    $
                                                                    {
                                                                        offer.discount_price
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(offer.start_date ||
                                                        offer.end_date) && (
                                                        <div className="text-sm text-gray-400">
                                                            <span>
                                                                Valid from:{" "}
                                                            </span>
                                                            <span>
                                                                {offer.start_date?.slice(
                                                                    0,
                                                                    10
                                                                ) || "N/A"}{" "}
                                                                TO{" "}
                                                                {offer.end_date?.slice(
                                                                    0,
                                                                    10
                                                                ) || "N/A"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    className={`mt-4 px-4 py-2 rounded-full ${
                                                        isDarkMode
                                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                                    } transition-all duration-300`}
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Trending Destinations Section */}
            <section
                className={`py-24 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center md:text-left"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2
                                    className={`text-3xl md:text-4xl font-extrabold ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }`}
                                >
                                    <span className="text-blue-600">
                                        Trending
                                    </span>{" "}
                                    Destinations
                                </h2>
                                <p
                                    className={`mt-3 text-lg ${
                                        isDarkMode
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Discover our most popular vacation spots
                                    loved by travelers worldwide
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0 flex items-center justify-center md:justify-end gap-4">
                                <button
                                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-all"
                                    aria-label="Previous destinations"
                                >
                                    <ArrowLeft
                                        size={20}
                                        className={
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                        }
                                    />
                                </button>
                                <button
                                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-all"
                                    aria-label="Next destinations"
                                >
                                    <ChevronRight
                                        size={20}
                                        className={
                                            isDarkMode
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {destinations.length === 0 ? (
                        <div className="text-center text-gray-400 py-16 bg-opacity-10 rounded-xl bg-gray-200 dark:bg-gray-800">
                            <CalendarX
                                size={48}
                                className="mx-auto mb-4 opacity-50"
                            />
                            <p className="text-lg font-medium">
                                No destinations available at the moment.
                            </p>
                            <p className="mt-2">
                                Please check back later for new exciting
                                locations.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                        >
                            {destinations
                                .slice(0, 4)
                                .map((destination, index) => (
                                    <motion.div
                                        key={destination.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1 * index,
                                        }}
                                        whileHover={{
                                            y: -8,
                                            transition: { duration: 0.3 },
                                        }}
                                        className={`rounded-2xl overflow-hidden shadow-lg group ${
                                            isDarkMode
                                                ? "bg-gray-800 hover:bg-gray-750"
                                                : "bg-white hover:shadow-xl"
                                        } transition-all duration-300`}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={
                                                    destination.image ||
                                                    "https://via.placeholder.com/640x480"
                                                }
                                                alt={destination.name}
                                                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                                                {destination.tag && (
                                                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                        {destination.tag}
                                                    </div>
                                                )}
                                                <button
                                                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-40 backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                                                    aria-label="Add to favorites"
                                                >
                                                    <Heart
                                                        size={18}
                                                        className="text-white"
                                                    />
                                                </button>
                                            </div>
                                            {calculateDiscount(
                                                destination.price,
                                                destination.discount_price
                                            ) && (
                                                <div className="absolute top-20 right-0 bg-red-500 text-white px-4 py-1 rounded-l-full text-sm font-bold shadow-lg">
                                                    {calculateDiscount(
                                                        destination.price,
                                                        destination.discount_price
                                                    )}
                                                    % OFF
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3
                                                    className={`font-bold text-lg ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {destination.name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <MapPin
                                                    size={16}
                                                    className="text-blue-600 flex-shrink-0"
                                                />
                                                <span
                                                    className={`text-sm ${
                                                        isDarkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {destination.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex items-center">
                                                    <CalendarX
                                                        size={14}
                                                        className={`${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        } mr-1`}
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {destination.duration ||
                                                            "3-7 days"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users
                                                        size={14}
                                                        className={`${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        } mr-1`}
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {destination.group_size ||
                                                            "2-8 people"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <div>
                                                    <span
                                                        className={`block text-xs font-medium ${
                                                            isDarkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Starting from
                                                    </span>
                                                    <div className="flex items-baseline">
                                                        <span className="text-blue-600 font-bold text-lg">
                                                            $
                                                            {destination.discount_price ||
                                                                destination.price}
                                                        </span>
                                                        {destination.discount_price && (
                                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                                $
                                                                {
                                                                    destination.price
                                                                }
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            / night
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/destinations/${destination.id}`}
                                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                                                        isDarkMode
                                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                                    } transition-all duration-300 text-sm font-medium`}
                                                    aria-label="View destination details"
                                                >
                                                    Details{" "}
                                                    <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </motion.div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/destinations"
                            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium ${
                                isDarkMode
                                    ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:from-blue-800 hover:to-blue-600"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            } transition-all duration-300 shadow-lg hover:shadow-xl`}
                        >
                            Explore All Destinations <ArrowRight size={18} />
                        </Link>
                        <p
                            className={`mt-4 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            Over 200+ exotic locations to discover around the
                            world
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Travel Inspiration Section */}
            <section
                className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className={`text-3xl font-bold mb-12 text-center ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            Find{" "}
                            <span className="text-blue-600">Inspiration</span>{" "}
                            For Your Next Trip
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {inspirationItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{
                                        scale: 1.03,
                                        transition: { duration: 0.3 },
                                    }}
                                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-70 group-hover:opacity-80 transition-all duration-300"></div>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-80 object-cover transform group-hover:scale-110 transition-all duration-700"
                                        loading="lazy"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                        <h3 className="text-white text-xl font-bold mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            {item.count}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section
                className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className={`text-3xl font-bold mb-12 text-center ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            Why Choose{" "}
                            <span className="text-blue-600">Travel Nest</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <Tag size={24} />,
                                    title: "Best Price Guarantee",
                                    description:
                                        "We match or beat any comparable price you can find elsewhere.",
                                },
                                {
                                    icon: <Shield size={24} />,
                                    title: "Secure Booking",
                                    description:
                                        "Your personal and payment information is always protected.",
                                },
                                {
                                    icon: <Award size={24} />,
                                    title: "Top-rated Service",
                                    description:
                                        "Our dedicated support team is available 24/7 to assist you.",
                                },
                                {
                                    icon: <TrendingUp size={24} />,
                                    title: "Loyalty Rewards",
                                    description:
                                        "Earn points on every booking and unlock exclusive benefits.",
                                },
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className={`p-6 text-center ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }`}
                                >
                                    <div
                                        className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${
                                            isDarkMode
                                                ? "bg-blue-900 text-blue-300"
                                                : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p
                                        className={`${
                                            isDarkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />

            {/* Chat Bot & Helpers */}
            <div className="fixed bottom-24 right-6 z-50 flex flex-col items-center">
                {isTooltipVisible && (
                    <div className="relative mb-2 p-4 bg-white text-black rounded-lg shadow-lg text-sm transition-all duration-300 animate-fade-in-down whitespace-nowrap">
                        <button
                            onClick={handleCloseTooltip}
                            className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
                            aria-label="Close tooltip"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-center">
                            <MessageCircle className="mr-2 text-blue-600" />
                            <p>
                                Need help planning your trip? Chat with our AI
                                assistant
                            </p>
                        </div>
                    </div>
                )}
                <ChatBot isChatOpen={isChatOpen} toggleChat={toggleChat} />
            </div>
        </div>
    );
};

export default HomePage;
