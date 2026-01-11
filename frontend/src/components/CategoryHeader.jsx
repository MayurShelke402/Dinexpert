import { FaLeaf, FaDrumstickBite, FaSeedling } from "react-icons/fa";
import { HiXMark, HiChevronDown } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function CategoryHeader({
  categoryName,
  subcat,
  setSubcat,
  sortBy,
  setSortBy,
  foodType,
  setFoodType,
  clearFilters,
  subcategories,
  sortOptions
}) {
  const [showSubcatDropdown, setShowSubcatDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const hasActiveFilters = foodType || subcat !== subcategories[0] || sortBy !== sortOptions[0];

  const CustomDropdown = ({ value, options, onChange, placeholder, isOpen, setIsOpen }) => (
    <div className="relative flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-gray-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300 flex items-center justify-between"
      >
        <span>{value}</span>
        <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden"
            >
              {options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange({ target: { value: option } });
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    value === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === options.length - 1 ? 'rounded-b-2xl' : ''}`}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
        {hasActiveFilters && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiXMark className="w-4 h-4" />
            Clear
          </motion.button>
        )}
      </div>

      {/* Food Type Chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFoodType(foodType === "Veg" ? "" : "Veg")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
            foodType === "Veg"
              ? "border-green-500 bg-green-500 text-white shadow-md"
              : "border-green-200 text-green-600 hover:border-green-300 bg-white"
          }`}
        >
          <FaLeaf className="w-3 h-3" />
          <span className="font-medium">Veg</span>
        </button>

        <button
          onClick={() => setFoodType(foodType === "Non-Veg" ? "" : "Non-Veg")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
            foodType === "Non-Veg"
              ? "border-red-500 bg-red-500 text-white shadow-md"
              : "border-red-200 text-red-600 hover:border-red-300 bg-white"
          }`}
        >
          <FaDrumstickBite className="w-3 h-3" />
          <span className="font-medium">Non-Veg</span>
        </button>

        <button
          onClick={() => setFoodType(foodType === "Vegan" ? "" : "Vegan")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
            foodType === "Vegan"
              ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
              : "border-emerald-200 text-emerald-600 hover:border-emerald-300 bg-white"
          }`}
        >
          <FaSeedling className="w-3 h-3" />
          <span className="font-medium">Vegan</span>
        </button>
      </div>

      {/* Custom Dropdowns */}
      <div className="flex gap-3">
        <CustomDropdown
          value={subcat}
          options={subcategories}
          onChange={(e) => setSubcat(e.target.value)}
          isOpen={showSubcatDropdown}
          setIsOpen={setShowSubcatDropdown}
        />
        
        <CustomDropdown
          value={sortBy}
          options={sortOptions}
          onChange={(e) => setSortBy(e.target.value)}
          isOpen={showSortDropdown}
          setIsOpen={setShowSortDropdown}
        />
      </div>
    </div>
  );
}
