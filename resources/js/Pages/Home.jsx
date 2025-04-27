import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, ArrowRight, MessageCircle, X, Calendar, Search,
  Users, CreditCard, Globe, Star, TrendingUp, Shield,
  Briefcase, Gift, Award, Compass, Image, Heart, Coffee,
  ArrowLeft, ArrowUp, Filter, Sun, Moon, Tag, UserCheck,
  Plane, Hotel,  Navigation, Home, Zap, Bookmark,
  Umbrella, Sunrise, Wind, Flag, Map
} from "lucide-react";
import { Head, usePage, Link } from "@inertiajs/react";
import Navbar from "../Components/Nav";
import Footer from "../Components/Footer";
import ChatBot from "../Components/ChatBot";

const HomePage = ({ auth }) => {
  const { props } = usePage();
  const user = auth?.user || null;
  const successMessage = props.flash?.success || null;
  const searchRef = useRef(null);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  
  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchType, setSearchType] = useState("flights");
  
  // Search form states
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [travelers, setTravelers] = useState(1);
  
  // Mocked data for inspiration section
  const inspirationItems = [
    { id: 1, title: "Beach Getaways", image: "/api/placeholder/500/600", count: "4,230+ destinations" },
    { id: 2, title: "Mountain Retreats", image: "/api/placeholder/500/600", count: "2,450+ destinations" },
    { id: 3, title: "Cultural Experiences", image: "/api/placeholder/500/600", count: "3,120+ destinations" },
    { id: 4, title: "Urban Adventures", image: "/api/placeholder/500/600", count: "1,890+ destinations" },
  ];

  // Mocked trending destinations
  const trendingDestinations = [
    { name: "Bali, Indonesia", image: "/api/placeholder/400/300", price: "$850", rating: 4.8, discount: "20% OFF", tag: "Best Seller" },
    { name: "Cancún, Mexico", image: "/api/placeholder/400/300", price: "$920", rating: 4.7, discount: null, tag: "Hot Deal" },
    { name: "Cappadocia, Turkey", image: "/api/placeholder/400/300", price: "$750", rating: 4.6, discount: "15% OFF", tag: null },
    { name: "Santorini, Greece", image: "/api/placeholder/400/300", price: "$1,200", rating: 4.9, discount: null, tag: "Luxury" },
  ];

  // Feature toggles
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const handleCloseTooltip = () => setIsTooltipVisible(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Scroll to search section
  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Track scroll position for UI effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto hide tooltip after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Hero carousel items
  const heroSlides = [
    {
      id: 1,
      title: "Discover Your Next Adventure",
      subtitle: "Explore breathtaking destinations and create unforgettable memories with our exclusive travel packages.",
      image: "/api/placeholder/1800/900",
      location: "Bali, Indonesia"
    },
    {
      id: 2,
      title: "Journey Beyond Boundaries",
      subtitle: "From secluded beaches to bustling cities, find your perfect getaway with personalized itineraries.",
      image: "/api/placeholder/1800/900",
      location: "Swiss Alps, Switzerland"
    },
    {
      id: 3,
      title: "Authentic Travel Experiences",
      subtitle: "Connect with cultures, taste authentic cuisine, and immerse yourself in local traditions.",
      image: "/api/placeholder/1800/900",
      location: "Amalfi Coast, Italy"
    }
  ];

  // Special offers data
  const specialOffers = [
    {
      id: 1,
      title: "Summer Escape Package",
      description: "Enjoy sun-soaked beaches and crystal-clear waters with our all-inclusive summer packages.",
      image: "/api/placeholder/500/300",
      discount: "30% OFF",
      price: "$599"
    },
    {
      id: 2,
      title: "Luxury Resort Retreat",
      description: "Experience top-tier luxury with spa treatments, gourmet dining, and exclusive amenities.",
      image: "/api/placeholder/500/300",
      discount: "LIMITED TIME",
      price: "$1,299"
    },
    {
      id: 3,
      title: "European Heritage Tour",
      description: "Discover historic landmarks and cultural treasures across 5 European countries.",
      image: "/api/placeholder/500/300",
      discount: "BEST VALUE",
      price: "$1,899"
    }
  ];

  // Travel categories
  const travelCategories = [
    { icon: <Globe size={24} />, title: "International Tours", description: "Explore famous landmarks worldwide" },
    { icon: <Coffee size={24} />, title: "Cultural Experiences", description: "Immerse in local traditions and cuisine" },
    { icon: <Compass size={24} />, title: "Adventure Travel", description: "Thrilling experiences for the bold" },
    { icon: <Gift size={24} />, title: "Honeymoon Packages", description: "Romantic getaways for couples" },
    { icon: <UserCheck size={24} />, title: "Solo Traveling", description: "Make friends and explore independently" },
    { icon: <Briefcase size={24} />, title: "Business Travel", description: "Comfortable and convenient options" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Head>
        <title>Travel Nest | Find Your Perfect Journey</title>
        <meta
          name="description"
          content="Book unforgettable trips, explore beautiful destinations, and find the best travel deals with Travel Nest."
        />
      </Head>

      <Navbar user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <Notification message={successMessage} type="success" />

      {/* Floating back to top button */}
      {scrollPosition > 500 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Hero Section with Search */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt={heroSlides[currentSlide].location} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative h-full z-10 container mx-auto px-6 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            ref={searchRef}
            className="max-w-6xl mx-auto mt-8 rounded-2xl shadow-2xl bg-white p-4 md:p-8"
          >
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setSearchType("flights")} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${searchType === "flights" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <Plane size={18} />
                Flights
              </button>
              <button 
                onClick={() => setSearchType("hotels")} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${searchType === "hotels" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <Hotel size={18} />
                Hotels
              </button>
              <button 
                onClick={() => setSearchType("packages")} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${searchType === "packages" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <Briefcase size={18} />
                Packages
              </button>
              <button 
                onClick={() => setSearchType("experiences")} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${searchType === "experiences" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <PalmTree size={18} />
                Experiences
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={searchType === "flights" ? "Where to?" : "Enter destination"}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dates</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Select dates"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select 
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-all duration-300 flex items-center gap-2">
                <Search size={18} />
                Search {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
              </button>
            </div>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className={`py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Globe size={24} />, title: "International Flights" },
              { icon: <Hotel size={24} />, title: "Top Hotels" },
              { icon: <Gift size={24} />, title: "Travel Deals" },
              { icon: <Compass size={24} />, title: "Guided Tours" },
              { icon: <Umbrella size={24} />, title: "Beach Vacations" },
              { icon: <Map size={24} />, title: "Travel Map" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:shadow-md'}`}
              >
                <div className={`p-3 rounded-full mb-3 ${isDarkMode ? 'bg-emerald-900 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                  {item.icon}
                </div>
                <h3 className="text-center text-sm md:text-base font-medium">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Special <span className="text-emerald-500">Offers</span>
              </h2>
              <Link href="/deals" className={`flex items-center gap-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} hover:underline`}>
                View all deals <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specialOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className={`rounded-2xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'}`}
                >
                  <div className="relative">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{offer.title}</h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>From</span>
                        <span className="text-emerald-500 font-bold text-xl">{offer.price}</span>
                      </div>
                      <button className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'} transition-all duration-300`}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Destinations Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-emerald-500">Trending</span> Destinations
              </h2>
              <div className="flex mt-4 md:mt-0 gap-4">
                <button 
                  onClick={() => setActiveTab("popular")}
                  className={`px-4 py-2 rounded-full text-sm ${activeTab === "popular" 
                    ? 'bg-emerald-600 text-white' 
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700')}`}
                >
                  Most Popular
                </button>
                <button 
                  onClick={() => setActiveTab("deals")}
                  className={`px-4 py-2 rounded-full text-sm ${activeTab === "deals" 
                    ? 'bg-emerald-600 text-white' 
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700')}`}
                >
                  Best Deals
                </button>
                <button 
                  onClick={() => setActiveTab("hidden")}
                  className={`px-4 py-2 rounded-full text-sm ${activeTab === "hidden" 
                    ? 'bg-emerald-600 text-white' 
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700')}`}
                >
                  Hidden Gems
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDestinations.map((destination) => (
                <motion.div
                  key={destination.name}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className={`rounded-2xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                >
                  <div className="relative">
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="w-full h-56 object-cover"
                    />
                    {destination.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {destination.discount}
                      </div>
                    )}
                    {destination.tag && (
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {destination.tag}
                      </div>
                    )}
                    <button className="absolute top-4 right-4 bg-white bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 transition-all duration-300">
                      <Heart size={18} className={destination.name === "Santorini, Greece" ? "text-red-500" : "text-white"} />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{destination.name}</h3>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-500" />
                        <span className={`ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{destination.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} className="text-emerald-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {destination.name.split(',')[1].trim()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Starting from</span>
                        <span className="text-emerald-500 font-bold">{destination.price}</span>
                        <span className="text-sm text-gray-500"> / night</span>
                      </div>
                      <button className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} hover:underline`}>
                        View Details <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button className={`px-6 py-3 rounded-full ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'} transition-all duration-300`}>
                Explore More Destinations
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-emerald-600 opacity-90"></div>
        <div className="absolute inset-0">
          <img src="/api/placeholder/1920/400" alt="CTA Background" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-white max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for an unforgettable adventure?</h2>
              <p className="text-lg text-emerald-100">Join our newsletter and get exclusive deals, travel tips, and personalized recommendations.</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
              <button className="px-6 py-3 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Inspiration Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Find <span className="text-emerald-500">Inspiration</span> For Your Next Trip
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {inspirationItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group h-80"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-70 group-hover:opacity-80 transition-all duration-300"></div>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Travel Categories Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-emerald-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-3xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Plan Your <span className="text-emerald-500">Next Trip</span> With Us
            </h2>
            <p className={`text-lg text-center mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore our curated travel categories and find the perfect experience for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {travelCategories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group h-80"
                >
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {category.title}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{category.title}</h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};