// components/CategoryCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CategoryCard({ cat, delay = 0 }) {
  // Safety check
  if (!cat || !cat.name) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="snap-center"
    >
      <Link
        to={`/category/${encodeURIComponent(cat.name)}`}
        className="group block"
      >
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 w-40 h-48 group-hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-36 overflow-hidden rounded-t-2xl">
            <img
              src={cat.image || "/fallback.jpg"}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "/fallback.jpg"; // Fallback if image fails to load
              }}
            />
          </div>
          
          {/* Content */}
          <div className="p-3 text-center">
            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors duration-200 truncate">
              {cat.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
