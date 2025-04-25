import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, ArrowRight, MessageCircle, X, Calendar, Search,
  Users, CreditCard, Globe, Star, TrendingUp, Shield,
  Briefcase, Gift, Award, Compass, Image, Heart, Coffee,
  ArrowLeft, ArrowUp, Filter, Sun, Moon, Tag, UserCheck
} from "lucide-react";
import { Head, usePage, Link } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ChatBot from "../Components/ChatBot";
import Notification from "../Components/Notification";

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
  
  // Mocked data for inspiration section
  const inspirationItems = [
    { id: 1, title: "Beach Getaways", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a", count: "4,230+ destinations" },
    { id: 2, title: "Mountain Retreats", image: "https://images.unsplash.com/photo-1464822759023-fed622ff877c", count: "2,450+ destinations" },
    { id: 3, title: "Cultural Experiences", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5", count: "3,120+ destinations" },
    { id: 4, title: "Urban Adventures", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785", count: "1,890+ destinations" },
  ];

  // Mocked trending destinations
  const trendingDestinations = [
    { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1558005530-a7958896ec60", price: "$850", rating: 4.8, discount: "20% OFF", tag: "Best Seller" },
    { name: "Cancún, Mexico", image: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18", price: "$920", rating: 4.7, discount: null, tag: "Hot Deal" },
    { name: "Cappadocia, Turkey", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200", price: "$750", rating: 4.6, discount: "15% OFF", tag: null },
    { name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1602081593934-2b93e2c2a1e2", price: "$1,200", rating: 4.9, discount: null, tag: "Luxury" },
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
      title: "Discover Your Next Destination",
      subtitle: "Book unforgettable trips, explore beautiful places, and experience adventure like never before.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      location: "Bali, Indonesia"
    },
    {
      id: 2,
      title: "Explore Hidden Gems",
      subtitle: "Find secret spots and unique locations that most tourists don't know about.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      location: "Swiss Alps, Switzerland"
    },
    {
      id: 3,
      title: "Create Lasting Memories",
      subtitle: "Turn your travel dreams into reality with personalized experiences and local guides.",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      location: "Amalfi Coast, Italy"
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-gradient-to-br from-blue-50 via-white to-gray-100 text-gray-900'}`}>
      <Head>
        <title>Travel Nest - Find Your Perfect Getaway</title>
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
          className="fixed bottom-24 right-24 z-40 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Hero Carousel Section */}
      <section className="relative h-screen">
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
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt={heroSlides[currentSlide].location} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col items-center justify-center h-full px-6 text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={scrollToSearch}
                className="px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg"
              >
                Start Planning
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300 font-medium">
                <MapPin size={18} />
                Explore Map
              </button>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                ></button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* Featured Promotions */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Special <span className="text-blue-500">Offers</span>
              </h2>
              <Link href="/deals" className={`flex items-center gap-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                View all deals <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Promotion Card 1 */}
              <motion.div
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" 
                    alt="Summer Getaway" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    30% OFF
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Summer Escape Package</h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Enjoy sun-soaked beaches and crystal-clear waters with our all-inclusive summer packages.
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>From</span>
                      <span className="text-blue-500 font-bold text-xl">$599</span>
                    </div>
                    <button className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-300`}>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Promotion Card 2 */}
              <motion.div
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1579689189009-874f5cac2db5" 
                    alt="Luxury Resort" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    LIMITED TIME
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Luxury Resort Retreat</h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Experience top-tier luxury with spa treatments, gourmet dining, and exclusive amenities.
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>From</span>
                      <span className="text-blue-500 font-bold text-xl">$1,299</span>
                    </div>
                    <button className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-300`}>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Promotion Card 3 */}
              <motion.div
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963" 
                    alt="Europe Tour" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    BEST VALUE
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>European Heritage Tour</h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Discover historic landmarks and cultural treasures across 5 European countries.
                  </p>
                  <div className="flex items-center justify-between">
                  <div>
                      <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>From</span>
                      <span className="text-blue-500 font-bold text-xl">$1,899</span>
                    </div>
                    <button className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-300`}>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Destinations Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-blue-500">Trending</span> Destinations
              </h2>
              <div className="flex mt-4 md:mt-0 gap-6">
                <button 
                  onClick={() => setActiveTab("popular")}
                  className={`px-4 py-2 rounded-full ${activeTab === "popular" 
                    ? 'bg-blue-600 text-white' 
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700')}`}
                >
                  Most Popular
                </button>
                <button 
                  onClick={() => setActiveTab("deals")}
                  className={`px-4 py-2 rounded-full ${activeTab === "deals" 
                    ? 'bg-blue-600 text-white' 
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700')}`}
                >
                  Best Deals
                </button>
                <button 
                  onClick={() => setActiveTab("hidden")}
                  className={`px-4 py-2 rounded-full ${activeTab === "hidden" 
                    ? 'bg-blue-600 text-white' 
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
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
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
                      <MapPin size={16} className="text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {destination.name.split(',')[1].trim()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Starting from</span>
                        <span className="text-blue-500 font-bold">{destination.price}</span>
                        <span className="text-sm text-gray-500"> / night</span>
                      </div>
                      <button className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                        View Details <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button className={`px-6 py-3 rounded-full ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-300`}>
                Explore More Destinations
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Travel Inspiration Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Find <span className="text-blue-500">Inspiration</span> For Your Next Trip
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {inspirationItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-70 group-hover:opacity-80 transition-all duration-300"></div>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-80 object-cover transform group-hover:scale-110 transition-all duration-700"
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
      {/* <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-3xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Plan Your <span className="text-blue-500">Perfect</span> Journey
            </h2>
            <p className={`text-center mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Whatever your travel style or budget, we have the perfect options for your next adventure
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { icon: <Globe size={24} />, title: "International Tours", description: "Explore famous landmarks worldwide" },
                { icon: <Coffee size={24} />, title: "Cultural Experiences", description: "Immerse in local traditions and cuisine" },
                { icon: <Compass size={24} />, title: "Adventure Travel", description: "Thrilling experiences for the bold" },
                { icon: <Gift size={24} />, title: "Honeymoon Packages", description: "Romantic getaways for couples" },
                { icon: <UserCheck size={24} />, title: "Solo Traveling", description: "Make friends and explore independently" },
                { icon: <Briefcase size={24} />, title: "Business Travel", description: "Comfortable and convenient options" },
                { icon: <Sun size={24} />, title: "Beach Vacations", description: "Relax on pristine sandy shores" },
                { icon: <Image size={24} />, title: "Photography Tours", description: "Capture stunning landscapes and moments" }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
                  className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} transition-all duration-300 text-center`}
                >
                  <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Benefits Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose <span className="text-blue-500">Travel Nest</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: <Tag size={24} />, 
                  title: "Best Price Guarantee", 
                  description: "We match or beat any comparable price you can find elsewhere." 
                },
                { 
                  icon: <Shield size={24} />, 
                  title: "Secure Booking", 
                  description: "Your personal and payment information is always protected." 
                },
                { 
                  icon: <Award size={24} />, 
                  title: "Top-rated Service", 
                  description: "Our dedicated support team is available 24/7 to assist you." 
                },
                { 
                  icon: <TrendingUp size={24} />, 
                  title: "Loyalty Rewards", 
                  description: "Earn points on every booking and unlock exclusive benefits." 
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`p-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
            >
              <X size={18} />
            </button>
            <div className="flex items-center">
              <MessageCircle className="mr-2 text-blue-500" />
              <p>Need help planning your trip? Chat with our AI assistant</p>
            </div>
          </div>
        )}
        <ChatBot isChatOpen={isChatOpen} toggleChat={toggleChat} />
      </div>
    </div>
  );
};

// Default mock data for component development and testing
HomePage.defaultProps = {
  popularDestinations: [],
  featuredDeals: [],
  testimonials: []
};

export default HomePage;