import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, ArrowRight, Film, Trash2, X, BookmarkPlus, AlertTriangle, Bookmark, Search } from "lucide-react";
import { Link } from "@inertiajs/react";
import NavBar from "../components/Nav";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState("dateAdded");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWishlist, setFilteredWishlist] = useState([]);

  // Pagination settings
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    setIsLoading(true);

    setTimeout(() => {
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
        setFilteredWishlist(parsedWishlist);
      }
      setIsLoading(false);
    }, 800);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter wishlist when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWishlist(wishlist);
    } else {
      const filtered = wishlist.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWishlist(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, wishlist]);

  // Custom toast component that matches the NavBar design language
  const CustomToast = ({ closeToast, toastProps, icon, title, message, color }) => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`flex items-center py-3 px-4 rounded-lg shadow-lg backdrop-blur-md ${
        isDarkMode 
        ? "bg-gray-900/90 text-white border border-gray-800/50" 
        : "bg-white/90 text-gray-900 border border-gray-200/50"
      }`}
    >
      <div className={`mr-3 p-2 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{message}</p>
      </div>
      <button 
        onClick={closeToast} 
        className={`ml-2 p-1 rounded-full hover:${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <X size={16} />
      </button>
    </motion.div>
  );

  // Wishlist management functions
  const sortWishlist = (list) => {
    switch (sortMethod) {
      case "titleAsc":
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case "titleDesc":
        return [...list].sort((a, b) => b.title.localeCompare(a.title));
      case "ratingDesc":
        return [...list].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case "dateAdded":
      default:
        return list;
    }
  };

  const getCurrentPageItems = () => {
    const sortedList = sortWishlist(filteredWishlist);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedList.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleAddToWishlist = (movie) => {
    if (!wishlist.some((m) => m.id === movie.id)) {
      const newWishlist = [...wishlist, { ...movie, dateAdded: new Date().toISOString() }];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      
      toast((props) => (
        <CustomToast
          {...props}
          icon={<BookmarkPlus className="w-5 h-5 text-white" />}
          title={`${movie.title} added to watchlist`}
          message="You can find it in your watchlist section"
          color="bg-green-500"
        />
      ), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: false
      });
    } else {
      toast((props) => (
        <CustomToast
          {...props}
          icon={<AlertTriangle className="w-5 h-5 text-white" />}
          title={`${movie.title} is already in watchlist`}
          message="This movie is already saved in your list"
          color="bg-amber-500"
        />
      ), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: false
      });
    }
  };

  const handleRemoveFromWishlist = (movieId) => {
    const movie = wishlist.find((m) => m.id === movieId);
    const newWishlist = wishlist.filter((m) => m.id !== movieId);
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));

    if (currentPage > 1 && getCurrentPageItems().length === 1) {
      setCurrentPage(currentPage - 1);
    }
    
    toast((props) => (
      <CustomToast
        {...props}
        icon={<Trash2 className="w-5 h-5 text-white" />}
        title={`${movie?.title} removed from watchlist`}
        message="The movie has been removed from your list"
        color="bg-red-500"
      />
    ), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      closeButton: false
    });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const buttonClass = (isActive) =>
      `w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        isActive
          ? isDarkMode
            ? "bg-red-600 text-white"
            : "bg-red-500 text-white"
          : isDarkMode
          ? "text-gray-300 hover:bg-gray-700"
          : "text-gray-700 hover:bg-gray-200"
      }`;

    if (totalPages <= 0) return pages;

    pages.push(
      <button key={1} onClick={() => handlePageChange(1)} className={buttonClass(currentPage === 1)}>
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(<span key="ellipsis1" className="mx-1 text-gray-500">...</span>);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue;
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)} className={buttonClass(currentPage === i)}>
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis2" className="mx-1 text-gray-500">...</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={buttonClass(currentPage === totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleLogout = () => {
    console.log("Logging out");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <NavBar isDarkMode={isDarkMode} wishlist={wishlist} handleLogout={handleLogout} />

      <main className="pt-28 px-6 max-w-7xl mx-auto pb-20">
      
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`mb-8 p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/90"
            } backdrop-blur-sm shadow-lg`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              {/* Search input */}
              <div className="relative flex-grow md:max-w-md">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search your movies..."
                  className={`pl-10 pr-10 py-2 w-full rounded-lg border transition-all focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    isDarkMode 
                      ? "bg-gray-700/70 border-gray-600 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-4">
                <div className="text-sm">
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {filteredWishlist.length === 0 && searchQuery ? (
                      "No results found"
                    ) : (
                      <>
                        Showing <span className="font-medium">{Math.min(filteredWishlist.length, currentPage * itemsPerPage)}</span> of{" "}
                        <span className="font-medium">{filteredWishlist.length}</span> items
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className={`text-sm whitespace-nowrap ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Sort by:</label>
                  <select
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value)}
                    className={`rounded-md border ${
                      isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
                    } py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value="dateAdded">Date Added</option>
                    <option value="titleAsc">Title (A-Z)</option>
                    <option value="titleDesc">Title (Z-A)</option>
                    <option value="ratingDesc">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 border-4 rounded-full ${
                isDarkMode ? "border-gray-600 border-t-red-500" : "border-gray-200 border-t-red-600"
              }`}
            />
          </div>
        ) : wishlist.length > 0 ? (
          <>
            {filteredWishlist.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={pageTransition}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 grid-auto-rows-[1fr]"
                >
                  <AnimatePresence>
                    {getCurrentPageItems().map((movie) => (
                      <motion.div
                        key={movie.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="min-h-[300px]" // Ensure all cards have a minimum height
                      >
                        <MovieCard
                          movie={movie}
                          isDarkMode={isDarkMode}
                          isInWishlist={true}
                          addToWishlist={handleAddToWishlist}
                          removeFromWishlist={handleRemoveFromWishlist}
                          posterSize="w-full h-48 object-cover"
                          animateRemoval={true}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-6"
                >
                  <Search size={60} className={`${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
                </motion.div>
                <p className={`text-center text-xl font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  No movies matching "{searchQuery}"
                </p>
                <p className={`text-center max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Try searching with a different term or clear your search
                </p>
                <button
                  onClick={handleClearSearch}
                  className={`mt-4 flex items-center space-x-2 px-6 py-3 rounded-lg transition-all hover:scale-105 ${
                    isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                  <span>Clear Search</span>
                </button>
              </motion.div>
            )}

            {filteredWishlist.length > 0 && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-12 flex justify-center items-center"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentPage === 1
                        ? isDarkMode
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDarkMode
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } transition-all duration-300 shadow-md`}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center space-x-2 px-2">{renderPaginationNumbers()}</div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentPage === totalPages
                        ? isDarkMode
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDarkMode
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } transition-all duration-300 shadow-md`}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6"
            >
              <Film size={80} className={`${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
            </motion.div>
            <p className={`text-center text-xl font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Your wishlist is empty
            </p>
            <p className={`text-center max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Start adding your favorite movies to create your personal collection!
            </p>
            <Link
              href="/home"
              className={`mt-4 flex items-center space-x-2 px-6 py-3 rounded-lg transition-all hover:scale-105 ${
                isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              <Film className="w-5 h-5" />
              <span>Browse Movies</span>
            </Link>
          </motion.div>
        )}
      </main>

      <Footer isDarkMode={isDarkMode} />

      <ToastContainer 
        position="top-right"
        newestOnTop
        limit={3}
        className="mt-16"
        toastStyle={{
          background: 'transparent',
          boxShadow: 'none',
          padding: 0
        }}
        closeButton={false}
      />
    </div>
  );
};

export default Wishlist;