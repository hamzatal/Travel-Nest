import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react"; // Import X icon for the clear button
import MoviePopup from "../Components/PopupMovie";
import { createPortal } from "react-dom";

const LiveSearch = ({ onSearchResults, isDarkMode }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [watchlist, setWatchlist] = useState(() => {
        return JSON.parse(localStorage.getItem("watchlist")) || [];
    });

    useEffect(() => {
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }, [watchlist]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // إذا كان النص فارغًا، نعيد التهيئة ونوقف البحث
        if (query.trim().length === 0) {
            setSearchResults([]);
            onSearchResults([]);
            return;
        }

        setIsSearching(true);

        // تأكد من استخدام الرابط الصحيح مع الـ API Key ودمج الاستعلام
        axios
            .get(`https://api.themoviedb.org/3/search/movie?api_key=ba4493b817fe50ef7a9d2c61203c7289&query=${query}`)
            .then((response) => {
                const results = response.data.results || []; // تأكد أن البيانات تأتي من response.data.results
                setSearchResults(results);
                onSearchResults(results);
            })
            .catch((error) => {
                console.error("Search failed:", error);
                setSearchResults([]);
                onSearchResults([]);
            })
            .finally(() => {
                setIsSearching(false);
            });
    };

    const handleClearSearch = () => {
        setSearchQuery(""); // Clear the search query
        setSearchResults([]); // Clear the search results
        onSearchResults([]); // Notify parent component
    };

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
    };

    const closePopup = () => {
        setSelectedMovie(null);
    };

    const handleAddToWatchlist = async (movie) => {
        const isInWatchlist = watchlist.some((item) => item.id === movie.id);

        try {
            const userResponse = await axios.get("/user"); // Fetch user info to get user_id
            const userId = userResponse.data.id;

            if (isInWatchlist) {
                // Remove from watchlist
                await axios.delete(`/favorites/${movie.id}`, {
                    data: { user_id: userId }, // Send user_id in the request body
                });

                setWatchlist((prev) =>
                    prev.filter((item) => item.id !== movie.id)
                );
                console.log(`${movie.title} removed from watchlist.`);
            } else {
                // Add to watchlist
                await axios.post(`/favorites/${movie.id}`, { user_id: userId });
                setWatchlist((prev) => [...prev, movie]);
                console.log(`${movie.title} added to watchlist.`);
            }
        } catch (err) {
            console.error("Failed to update watchlist:", err);
        }
    };

    // تنسيق التقييم ليظهر كعدد عشري مكون من رقمين
    const formatRating = (rating) => {
        return rating ? rating.toFixed(1) : "N/A"; // تحويل التقييم لرقم عشري مكون من رقم واحد بعد الفاصلة
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            {/* Search Input */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search
                        className={`w-5 h-5 transition-all duration-300 ${
                            isDarkMode
                                ? "text-gray-300 group-focus-within:text-cyan-400"
                                : "text-gray-500 group-focus-within:text-indigo-600"
                        }`}
                    />
                </div>
                <motion.input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Explore movies..."
                    className={`w-full pl-12 pr-12 py-3 rounded-full text-base font-medium tracking-tight border-0 shadow-lg transition-all duration-300 focus:ring-4 focus:outline-none ${
                        isDarkMode
                            ? "bg-gray-800 text-white placeholder-gray-500 shadow-2xl shadow-gray-900/50 focus:ring-cyan-500/30"
                            : "bg-white text-gray-900 placeholder-gray-400 shadow-xl shadow-gray-300/50 focus:ring-indigo-500/30"
                    }`}
                />
                {/* Clear Button */}
                {searchQuery && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClearSearch}
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                            isDarkMode
                                ? "text-gray-300 hover:text-cyan-400"
                                : "text-gray-500 hover:text-indigo-600"
                        }`}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className={`absolute z-50 w-full mt-3 rounded-2xl overflow-hidden ${
                            isDarkMode
                                ? "bg-gray-800 shadow-2xl shadow-gray-900/50 border border-gray-700/50"
                                : "bg-white shadow-xl shadow-gray-300/50 border border-gray-200/50"
                        }`}
                    >
                        {isSearching ? (
                            <div className="px-4 py-3 text-center">
                                <div className="animate-pulse text-sm text-gray-400">
                                    Searching...
                                </div>
                            </div>
                        ) : (
                            <>
                                {searchResults.length === 0 ? (
                                    <div className="px-4 py-3 text-center">
                                        <p className="text-sm font-medium text-gray-500">
                                            No results found
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="max-h-72 overflow-y-auto overflow-x-hidden custom-scrollbar"
                                        style={{
                                            scrollbarWidth: "thin",
                                            scrollbarColor: isDarkMode
                                                ? "rgba(255,255,255,0.2) transparent"
                                                : "rgba(0,0,0,0.2) transparent",
                                        }}
                                    >
                                        {searchResults.map((movie) => (
                                            <motion.div
                                                key={movie.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleMovieSelect(movie)}
                                                className="px-4 py-3 cursor-pointer flex items-center space-x-4"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Full URL for the poster image
                                                        alt={movie.title}
                                                        className="w-14 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="absolute bottom-0 right-0 bg-yellow-400 text-xs text-black font-bold px-1 rounded">
                                                        {formatRating(movie.vote_average)} {/* عرض التقييم بشكل رقم عشري */}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold truncate">
                                                        {movie.title}
                                                    </h3>
                                                    <div className="text-sm truncate">
                                                    <div className="text-sm truncate">
    Popularity: {formatRating(movie.vote_average)} / 10 {/* عرض التقييم بالنظام العشري */}
</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Movie Popup */}
            {selectedMovie &&
                createPortal(
                    <MoviePopup
                        movie={selectedMovie}
                        isDarkMode={isDarkMode}
                        onClose={closePopup}
                        onAddToWatchlist={handleAddToWatchlist}
                        isInWatchlist={watchlist.some(
                            (item) => item.id === selectedMovie.id
                        )}
                    />,
                    document.body
                )}
        </div>
    );
};

export default LiveSearch;
