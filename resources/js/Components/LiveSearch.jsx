// resources/js/Components/LiveSearch.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const LiveSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const dummyData = [
    { id: 1, name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1602081593934-2b93e2c2a1e2", price: "$1,200" },
    { id: 2, name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1545565078-6aa49e01e369", price: "$1,450" },
    { id: 3, name: "Patagonia, Chile", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba", price: "$1,800" },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const filteredResults = dummyData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500); 
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search
            className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300"
          />
        </div>
        <motion.input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search destinations..."
          className="w-full pl-12 pr-12 py-3 rounded-full text-base font-medium tracking-tight border-0 shadow-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-4 focus:ring-blue-500/30 focus:outline-none transition-all duration-300 shadow-gray-900/50"
        />
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-blue-500"
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
            className="absolute z-50 w-full mt-3 rounded-2xl overflow-hidden bg-gray-800 shadow-2xl shadow-gray-900/50 border border-gray-700/50"
          >
            {isSearching ? (
              <div className="px-4 py-3 text-center">
                <div className="animate-pulse text-sm text-gray-400">Searching...</div>
              </div>
            ) : (
              <>
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-center">
                    <p className="text-sm font-medium text-gray-500">No results found</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {searchResults.map((destination) => (
                      <motion.div
                        key={destination.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-3 cursor-pointer flex items-center space-x-4"
                      >
                        <div className="relative">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-14 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold truncate text-white">{destination.name}</h3>
                          <p className="text-sm text-gray-400 truncate">Price: {destination.price}</p>
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
    </div>
  );
};

export default LiveSearch;