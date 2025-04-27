import React from 'react';
import { Search, Plus, Film, Edit, Trash, X } from 'lucide-react';

const MovieView = ({
  movies,
  categories,
  searchQuery,
  setSearchQuery,
  showMovieModal,
  setShowMovieModal,
  selectedMovie,
  setSelectedMovie,
  movieFormData,
  setMovieFormData,
  handleMovieSubmit,
  handleDeleteMovie,
  resetMovieForm
}) => {
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              resetMovieForm();
              setShowMovieModal(true);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Movie
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {movie.poster_url ? (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Film className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">{movie.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {movie.genre}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {movie.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rating: {movie.rating}/10
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setMovieFormData(movie);
                        setShowMovieModal(true);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

            {/* Movie Modal */}
            {showMovieModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">
                        {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
                      </h3>
                      <button onClick={() => setShowMovieModal(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>
      
                    <form onSubmit={handleMovieSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={movieFormData.title}
                          onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
      
                      <div>
                        <label className="block text-sm font-medium mb-1">Genre</label>
                        <input
                          type="text"
                          value={movieFormData.genre}
                          onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
      
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={movieFormData.description}
                          onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          rows={3}
                          required
                        />
                      </div>
      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Release Date</label>
                          <input
                            type="date"
                            value={movieFormData.release_date}
                            onChange={(e) => setMovieFormData({ ...movieFormData, release_date: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Rating</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={movieFormData.rating}
                            onChange={(e) => setMovieFormData({ ...movieFormData, rating: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          />
                        </div>
                      </div>
      
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          value={movieFormData.category_id}
                          onChange={(e) => setMovieFormData({ ...movieFormData, category_id: e.target.value })}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Poster URL</label>
                          <input
                            type="text"
                            value={movieFormData.poster_url}
                            onChange={(e) => setMovieFormData({ ...movieFormData, poster_url: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Trailer URL</label>
                          <input
                            type="text"
                            value={movieFormData.trailer_url}
                            onChange={(e) => setMovieFormData({ ...movieFormData, trailer_url: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Director</label>
                          <input
                            type="text"
                            value={movieFormData.director}
                            onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Cast</label>
                          <input
                            type="text"
                            value={movieFormData.cast}
                            onChange={(e) => setMovieFormData({ ...movieFormData, cast: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
      
                      <div className="flex justify-end space-x-2 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowMovieModal(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          {selectedMovie ? 'Update Movie' : 'Create Movie'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      };
      export default MovieView;
      
    