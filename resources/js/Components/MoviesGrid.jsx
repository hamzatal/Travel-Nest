import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Slider from "./Slider";
import MovieCard from "./MovieCard";
import { fetchMovies } from "./tmdb";

const MoviesGrid = ({
    title,
    apiUrl,
    icon,
    isDarkMode,
    isFeatured = false,
    onAddToWishlist,
}) => {
    const [movies, setMovies] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const moviesData = await fetchMovies(apiUrl);
                setMovies(moviesData);
            } catch (err) {
                setError("Failed to fetch movies.");
                console.error("Error fetching movies:", err);
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, [apiUrl]);

    const addToWishlist = (movie) => {
        if (!wishlist.some((m) => m.id === movie.id)) {
            const updatedWishlist = [...wishlist, movie];
            setWishlist(updatedWishlist);
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
            onAddToWishlist(movie);
        }
    };

    const removeFromWishlist = (movieId) => {
        const updatedWishlist = wishlist.filter((m) => m.id !== movieId);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    if (loading)
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`w-full p-8 rounded-3xl shadow-2xl ${
                    isDarkMode
                        ? "bg-gradient-to-br from-gray-900 to-gray-800"
                        : "bg-gradient-to-br from-white to-gray-50"
                }`}
            >
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
                </div>
            </motion.div>
        );

    if (error)
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`w-full p-8 rounded-3xl shadow-2xl ${
                    isDarkMode
                        ? "bg-gradient-to-br from-gray-900 to-gray-800"
                        : "bg-gradient-to-br from-white to-gray-50"
                }`}
            >
                <div className="text-center text-red-500">{error}</div>
            </motion.div>
        );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`w-full p-8 rounded-3xl shadow-2xl ${
                isDarkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-800"
                    : "bg-gradient-to-br from-white to-gray-50"
            }`}
        >
            <div className="flex items-center space-x-6 mb-8">
                {React.isValidElement(icon) &&
                    React.cloneElement(icon, {
                        className: `w-10 h-10 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                        }`,
                    })}
                <h2
                    className={`text-3xl font-extrabold tracking-tight ${
                        isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                    {title}
                </h2>
            </div>

            {movies.length > 0 ? (
                <Slider
                    movies={movies}
                    isDarkMode={isDarkMode}
                    renderMovieCard={(movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isDarkMode={isDarkMode}
                            isInWishlist={wishlist.some((m) => m.id === movie.id)}
                            addToWishlist={addToWishlist}
                            removeFromWishlist={removeFromWishlist}
                        />
                    )}
                />
            ) : (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center text-xl font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                    No movies found
                </motion.p>
            )}
        </motion.div>
    );
};

export default MoviesGrid;