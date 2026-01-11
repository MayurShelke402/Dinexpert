import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchActivePresets } from "../api/presetAPI"; // ✅ Updated import
import { useSessionStore } from "../store/useSessionStore"; // ✅ Import session store
import { HiFire, HiStar, HiSparkles } from "react-icons/hi";

export default function TodaysPicks() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const hotelId = useSessionStore((s) => s.hotelId); // ✅ Get hotelId from store

  useEffect(() => {
    if (hotelId) {
      loadPresets();
    }
  }, [hotelId]);

  const loadPresets = async () => {
    try {
      setLoading(true);
      const response = await fetchActivePresets(hotelId); // ✅ Pass hotelId
      
      if (response.success && response.data) {
        setPresets(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch presets", err);
      setPresets([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl mx-4 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
            <HiFire className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Today's Picks</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[180px] flex-shrink-0">
              <div className="bg-gray-200 rounded-2xl animate-pulse">
                <div className="w-full h-36 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Don't render if no presets
  if (presets.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl mx-4 p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
          <HiFire className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Today's Picks</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2"
        >
          {presets.flatMap((preset, presetIndex) =>
            preset.items.map((entry, i) => {
              const item = entry.item;
              const isSpecial = preset.tag === "TodaysSpecial";
              const price = entry.specialPrice || item.price;

              return (
                <motion.div
                  key={`${preset._id}-${item._id}`}
                  className="min-w-[180px] flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link to={`/product/${item.slug}`} 
                  className=" inline-block w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
                    {/* Image Section */}
                    <div className="relative">
                      <img
                        src={item.images?.[0] || "/fallback.jpg"}
                        alt={item.name}
                        className="w-full h-36 object-cover"
                      />
                      
                      {/* Badge */}
                      <div className="absolute top-2 left-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          isSpecial 
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" 
                            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        }`}>
                          <div className="flex items-center gap-1">
                            {isSpecial ? <HiFire className="w-3 h-3" /> : <HiStar className="w-3 h-3" />}
                            {isSpecial ? "Hot" : "Combo"}
                          </div>
                        </div>
                      </div>

                      {/* Special Price Badge */}
                      {entry.specialPrice && entry.specialPrice < item.price && (
                        <div className="absolute top-2 right-2">
                          <div className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                            Save ₹{(item.price - entry.specialPrice).toFixed(0)}
                          </div>
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      {/* Price with strikethrough if special price */}
                      <div className="mb-3">
                        {entry.specialPrice && entry.specialPrice < item.price ? (
                          <div className="flex items-center gap-2">
                            <p className="text-gray-400 line-through text-sm">
                              ₹{item.price}
                            </p>
                            <p className="text-green-600 font-bold text-lg">
                              ₹{entry.specialPrice}
                            </p>
                          </div>
                        ) : (
                          <p className="text-green-600 font-bold text-lg">
                            ₹{price}
                          </p>
                        )}
                      </div>
                      
                      <Link
                        to={`/product/${item.slug}`}
                        className="block w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white text-sm font-medium rounded-xl text-center transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Order Now
                      </Link>


                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
