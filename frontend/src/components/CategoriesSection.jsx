// components/CategoriesSection.jsx
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import CategoryCard from "./CategoryCard";

export default function CategoriesSection({ categories = [] }) {
  // Don't render if categories is empty or undefined
  if (!categories || categories.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
          <HiSparkles className="w-6 h-6 text-orange-500" />
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
        <HiSparkles className="w-6 h-6 text-orange-500" />
      </motion.div>

      <div className="overflow-x-auto pb-4">
        <div className="inline-grid grid-rows-2 gap-4 auto-cols-[160px] grid-flow-col">
          {categories.map((cat, i) => {
            // Safety check for each category
            if (!cat || !cat._id) {
              console.warn('Invalid category object:', cat);
              return null;
            }

            return (
              <CategoryCard
                key={cat._id}
                cat={{
                  name: cat.name || 'Unknown Category',
                  image: cat.image || "/fallback.jpg",
                }}
                delay={0.7 + i * 0.1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
