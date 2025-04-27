import axios from 'axios';

// TMDB API Constants
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'ba4493b817fe50ef7a9d2c61203c7289'; // Replace with your actual TMDB API key
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Axios instance for TMDB API
const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

/**
 * Fetches movies from TMDB API.
 * @param {string} endpoint - The TMDB API endpoint (e.g., '/movie/now_playing').
 * @param {number} numPages - Number of pages to fetch (default: 1).
 * @param {object} params - Additional query parameters (optional).
 * @returns {Promise<Array>} - Transformed movie data.
 */
export const fetchMovies = async (endpoint, numPages = 1, params = {}) => {
    try {
        const allMovies = [];

        // Fetch data for each page
        for (let page = 1; page <= numPages; page++) {
            const response = await tmdbApi.get(endpoint, { params: { ...params, page } });
            if (response.data.results) {
                allMovies.push(...response.data.results);
            }
        }

        return transformMovieData(allMovies);
    } catch (error) {
        console.error(`Error fetching movies from endpoint "${endpoint}":`, error);
        throw new Error(`Failed to fetch movies: ${error.message}`);
    }
};

/**
 * Fetches detailed information for a specific movie.
 * @param {number} movieId - The ID of the movie.
 * @returns {Promise<object>} - Transformed movie details.
 */
export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'videos,credits',
            },
        });
        return transformMovieDetails(response.data);
    } catch (error) {
        console.error(`Error fetching details for movie ID ${movieId}:`, error);
        throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
};

/**
 * Transforms raw movie data into a standardized format.
 * @param {Array} movies - Array of raw movie data from TMDB.
 * @returns {Array} - Transformed movie data.
 */
const transformMovieData = (movies) => {
    return movies.map(movie => ({
        id: movie.id || null,
        title: movie.title || 'Untitled',
        poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
        backdrop_url: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
        release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA',
        rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
        genre: movie.genre_ids ? 'Mixed' : 'N/A',
        overview: movie.overview || 'No overview available.',
    }));
};

/**
 * Transforms raw movie details into a standardized format.
 * @param {object} movie - Raw movie details from TMDB.
 * @returns {object} - Transformed movie details.
 */
const transformMovieDetails = (movie) => ({
    id: movie.id || null,
    title: movie.title || 'Untitled',
    poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
    backdrop_url: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
    release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    genres: movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A',
    overview: movie.overview || 'No overview available.',
    runtime: movie.runtime || 'N/A',
    trailer_url: movie.videos?.results?.[0]?.key ?
        `https://www.youtube.com/watch?v=${movie.videos.results[0].key}` : null,
    cast: movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A',
    director: movie.credits?.crew?.find(member => member.job === 'Director')?.name || 'N/A',
    production: movie.production_companies?.map(company => company.name).join(', ') || 'N/A',
    budget: movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A',
    revenue: movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A',
});

/**
 * TMDB API endpoints for different movie categories.
 */
export const movieEndpoints = {
    featured: '/movie/now_playing',
    trending: '/trending/movie/week',
    action: '/discover/movie?with_genres=28',
    'sci-fi': '/discover/movie?with_genres=878',
    horror: '/discover/movie?with_genres=27',
    drama: '/discover/movie?with_genres=18',
    romantic: '/discover/movie?with_genres=10749',
    fantasy: '/discover/movie?with_genres=14',
    crime: '/discover/movie?with_genres=80',
};