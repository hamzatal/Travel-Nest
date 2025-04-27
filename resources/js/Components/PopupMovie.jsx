import React, { useState, useEffect } from "react";
import { X, PlayCircle, Bookmark, BookmarkCheck, Star, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { fetchMovieDetails } from "./tmdb";

const MoviePopup = ({
    movie,
    isDarkMode,
    onClose,
    onAddToWatchlist,
    isInWatchlist,
}) => {
    const [isAdded, setIsAdded] = useState(isInWatchlist);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
    const [watchNowLoading, setWatchNowLoading] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState('');

    const getYoutubeVideoId = (url) => {
        if (!url) return null;
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^[a-zA-Z0-9_-]{11}$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        if (url.length === 11) {
            return url;
        }

        return null;
    };

    useEffect(() => {
        const loadMovieDetails = async () => {
            try {
                setLoading(true);
                const details = await fetchMovieDetails(movie.id);
                setMovieDetails(details);
                
                if (details.trailer_url) {
                    const videoId = getYoutubeVideoId(details.trailer_url);
                    if (videoId) {
                        setTrailerUrl(videoId);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (movie?.id) {
            loadMovieDetails();
        }
    }, [movie?.id]);

        const handleToggleWatchlist = async () => {
            try {
                const response = await api.post("/favorites", {
                    movie_id: movie.id,
                });
        
                if (response.status === 201) {
                    setIsAdded(!isAdded);
                    onAddToWatchlist(movie); 
                }
            } catch (error) {
                console.error("Error adding to watchlist:", error);
            }
        };
    const handleToggleTrailer = () => {
        setIsTrailerPlaying(!isTrailerPlaying);
    };

    const handleWatchNowClick = async () => {
        try {
            setWatchNowLoading(true);
            const userResponse = await axios.get("/user");
            const userId = userResponse.data.id;
            
            await axios.post("/watched-movies", {
                user_id: userId,
                movie_id: movie.id,
            });

            handleToggleTrailer();
        } catch (error) {
            console.error("Error marking movie as watched:", error);
        } finally {
            setWatchNowLoading(false);
        }
    };

    const renderTrailerOrPoster = () => {
        if (isTrailerPlaying && trailerUrl) {
            return (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black"
                >
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&enablejsapi=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Movie Trailer"
                    />
                </motion.div>
            );
        }

        return (
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
            >
                <img
                    src={details?.poster_url}
                    alt={details?.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </motion.div>
        );
    };

    if (!movie || loading) return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="text-white text-xl">Error loading movie details: {error}</div>
        </div>
    );

    const details = movieDetails || movie;
    const canPlayTrailer = Boolean(trailerUrl);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.7, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.7, y: 50, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                    }}
                    className={`relative w-[90vw] h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 flex flex-col ${
                        isDarkMode
                            ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
                            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
                    }`}
                    style={{
                        '--scrollbar-track': isDarkMode ? '#1f2937' : '#f3f4f6',
                        '--scrollbar-thumb': isDarkMode ? '#4b5563' : '#d1d5db',
                    }}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-10">
                        <img
                            src={details.backdrop_url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Close Button */}
                    <motion.button
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className={`absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                            isDarkMode
                                ? "bg-gray-800 hover:bg-gray-700 text-white"
                                : "bg-white hover:bg-gray-100 text-black"
                        }`}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>

                    {/* Content Container */}
                    <div className="flex flex-col md:flex-row h-full relative z-10">
                        {/* Left Section - Poster & Trailer */}
                        <div className="md:w-[40%] h-[40vh] md:h-full flex flex-col items-center justify-center p-6">
                            {renderTrailerOrPoster()}
                        </div>

                        {/* Right Section - Details */}
                        <div
                            className={`md:w-[60%] flex flex-col p-6 overflow-y-auto space-y-6 custom-scrollbar ${
                                isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-4xl font-bold tracking-tight">
                                    {details.title}
                                </h2>

                                {/* Movie Metadata */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center space-x-2 bg-yellow-400/20 px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold text-yellow-500">
                                            {details.rating} / 10
                                        </span>
                                    </div>
                                    <span className="text-sm px-3 py-1 rounded-full bg-gray-700/20">
                                        {details.release_date}
                                    </span>
                                    <span className="text-sm px-3 py-1 rounded-full bg-gray-700/20">
                                        {details.genres}
                                    </span>
                                    {details.runtime && (
                                        <span className="text-sm px-3 py-1 rounded-full bg-gray-700/20 flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {details.runtime} min
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Overview */}
                            <motion.p
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className={`text-base leading-relaxed ${
                                    isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                                {details.overview}
                            </motion.p>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleToggleTrailer}
                                    disabled={!canPlayTrailer || watchNowLoading}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 text-sm ${
                                        isDarkMode
                                            ? "bg-red-600 hover:bg-red-700 text-white"
                                            : "bg-red-500 hover:bg-red-600 text-white"
                                    } ${(!canPlayTrailer || watchNowLoading) && "opacity-50 cursor-not-allowed"}`}
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    <span className="font-medium">
                                        {watchNowLoading ? "Loading..." : 
                                         !canPlayTrailer ? "No Trailer Available" :
                                         isTrailerPlaying ? "Hide Trailer" : "Watch Trailer"}
                                    </span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleToggleWatchlist}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 text-sm ${
                                        isDarkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                                    }`}
                                >
                                    {isAdded ? (
                                        <>
                                            <BookmarkCheck className="w-5 h-5 text-green-500" />
                                            <span className="font-medium">Added</span>
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="w-5 h-5" />
                                            <span className="font-medium">Add to Watchlist</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>

                            {/* Additional Info Grid */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {details.director && (
                                    <div className="space-y-2">
                                        <span className="text-xs uppercase tracking-wider opacity-70">Director</span>
                                        <p className="text-sm font-semibold">{details.director}</p>
                                    </div>
                                )}
                                {details.cast && (
                                    <div className="space-y-2">
                                        <span className="text-xs uppercase tracking-wider opacity-70">Cast</span>
                                        <p className="text-sm font-semibold">{details.cast}</p>
                                    </div>
                                )}
                                {details.production && (
                                    <div className="space-y-2">
                                        <span className="text-xs uppercase tracking-wider opacity-70">Production</span>
                                        <p className="text-sm font-semibold">{details.production}</p>
                                    </div>
                                )}
                                {details.budget !== 'N/A' && (
                                    <div className="space-y-2">
                                        <span className="text-xs uppercase tracking-wider opacity-70">Budget</span>
                                        <p className="text-sm font-semibold">{details.budget}</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MoviePopup;