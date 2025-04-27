import React, { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { PlayCircle, BookmarkPlus, BookmarkCheck, Star, Info } from "lucide-react";
import MoviePopup from "../Components/PopupMovie";

const MovieCard = ({
    movie,
    isDarkMode,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleWatchNowClick = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleAddToWishlist = () => {
        setIsLoading(true);
        addToWishlist(movie);
        setIsLoading(false);
    };

    const handleRemoveFromWishlist = () => {
        setIsLoading(true);
        removeFromWishlist(movie.id);
        setIsLoading(false);
    };

    return (
        <div>
            <motion.div
                key={movie.id}
                layout
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                className="relative group overflow-hidden rounded-3xl shadow-2xl border border-gray-200/20 transform transition-all duration-300 hover:shadow-2xl"
            >
                <div className="relative w-full h-[400px] overflow-hidden">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 z-20 flex space-x-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                isInWishlist && !isLoading
                                    ? handleRemoveFromWishlist()
                                    : handleAddToWishlist();
                            }}
                            className={`p-2 rounded-full transition-all duration-300 bg-black/60 hover:bg-white/80`}
                            disabled={isLoading}
                        >
                            {isInWishlist ? (
                                <div className="rounded-full p-1">
                                    <BookmarkCheck className="w-6 h-6 text-green-500" />
                                </div>
                            ) : (
                                <div className="rounded-full p-1">
                                    <BookmarkPlus className="w-6 h-6 text-red-500" />
                                </div>
                            )}
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="flex space-x-4 justify-center">
                            <button
                                onClick={handleWatchNowClick}
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                <Info className="w-8 h-6" />
                                <span className="font-large">Details</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className={`p-5 ${
                        isDarkMode
                            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                            : "bg-white text-gray-900"
                    } transition-colors duration-300`}
                >
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-xl truncate flex-grow pr-2">
                            {movie.title}
                        </p>
                        <div className="flex items-center space-x-1 pl-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold">
                                {movie.rating || "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm opacity-70">
                            {movie.release_date || "TBA"}
                        </span>
                        <span
                            className={`text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                            {movie.genre || "Mixed"}
                        </span>
                    </div>
                </div>
            </motion.div>

            {showPopup &&
                createPortal(
                    <MoviePopup
                        movie={movie}
                        isDarkMode={isDarkMode}
                        onClose={closePopup}
                        onAddToWatchlist={(movie, isAdded) => {
                            if (isAdded) {
                                addToWishlist(movie);
                            } else {
                                removeFromWishlist(movie.id);
                            }
                        }}
                        isInWatchlist={isInWishlist}
                    />,
                    document.body
                )}
        </div>
    );
};

export default MovieCard;