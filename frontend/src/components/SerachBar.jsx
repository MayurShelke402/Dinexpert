import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { searchMenu } from "../api/menuAPI";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  ClockIcon,
  XMarkIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function SearchBarWithSuggestions() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchSuggestions = debounce(async (q) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await searchMenu(q);
      const results = res.data?.slice(0, 5) || [];
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    } catch (err) {
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target) &&
          dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setFocused(false);
      }
    };

    const handleScroll = () => {
      if (showDropdown && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [showDropdown]);

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const highlightMatch = (text, searchQuery) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-orange-600 bg-orange-50 px-0.5 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const getVegIndicator = (type) => {
    if (type === 'Veg') {
      return (
        <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
        </div>
      );
    } else if (type === 'Non-Veg') {
      return (
        <div className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-600"></div>
        </div>
      );
    }
    return null;
  };

  const DropdownContent = () => (
    <motion.div 
      ref={dropdownRef}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      style={{
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 2147483647
      }}
    >
      {/* Results */}
      <div className="max-h-[400px] overflow-y-auto">
        {suggestions.map((item, index) => (
          <Link 
            key={item._id}
            to={`/product/${item.slug}`} 
            onClick={() => {
              setShowDropdown(false);
              setFocused(false);
            }}
            className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
          >
            {/* Image */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.images?.[0] || "/default-food.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = "/default-food.jpg";
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title row */}
              <div className="flex items-center gap-2 mb-1">
                {item.vegOrNonVeg && getVegIndicator(item.vegOrNonVeg)}
                <h4 className="font-medium text-gray-900 truncate text-sm">
                  {highlightMatch(item.name, query)}
                </h4>
              </div>
              
              {/* Details row */}
              <div className="flex items-center gap-2 text-xs">
                {/* Price */}
                {item.price && (
                  <span className="font-semibold text-gray-900">
                    ₹{item.price}
                  </span>
                )}
                
                {/* Separator */}
                {item.price && item.category?.name && (
                  <span className="text-gray-300">•</span>
                )}
                
                {/* Category */}
                {item.category?.name && (
                  <span className="text-gray-500">
                    {item.category.name}
                  </span>
                )}
                
                {/* Time */}
                {item.timerequired && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>{item.timerequired}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">
              <ArrowRightIcon className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      {suggestions.length >= 5 && (
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              setShowDropdown(false);
              // Navigate to full search page
            }}
            className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all results for "{query}"
          </button>
        </div>
      )}
    </motion.div>
  );

  const NoResultsContent = () => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 text-center"
      style={{
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 2147483647
      }}
    >
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
      <p className="text-xs text-gray-500">Try searching with different keywords</p>
    </motion.div>
  );

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <MagnifyingGlassIcon className={`w-5 h-5 transition-colors duration-200 ${
            focused ? 'text-gray-700' : 'text-gray-400'
          }`} />
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          className={`w-full pl-11 pr-11 py-3 text-sm text-gray-900 rounded-lg bg-white border transition-all duration-200 placeholder-gray-400 focus:outline-none ${
            focused 
              ? 'border-gray-300 shadow-md' 
              : 'border-gray-200 shadow-sm hover:border-gray-300'
          }`}
          placeholder="Search menu items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
        />

        {/* Right side icons */}
        <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Loading indicator */}
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}

          {/* Clear button */}
          <AnimatePresence>
            {query && !loading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                type="button"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Keyboard shortcut hint (optional) */}
      {!focused && !query && (
        <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
            Ctrl K
          </kbd>
        </div>
      )}

      {/* Dropdown portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showDropdown && <DropdownContent />}
          {query.trim().length >= 2 && !loading && suggestions.length === 0 && focused && (
            <NoResultsContent />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
