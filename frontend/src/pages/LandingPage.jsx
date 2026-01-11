import { useEffect, useState } from "react";
import SearchBar from "../components/SerachBar";
import BottomNav from "../components/BottomNav";
import TodaysPicks from "../components/TodaysPicks";
import CategoriesSection from "../components/CategoriesSection";
import { motion } from "framer-motion";
import SpecialOffers from "../components/SpecialOffer";
import { getAllCategories } from "../api/categoriesAPI";
import toast from "react-hot-toast";
import { useSessionStore } from "../store/useSessionStore";
import CartModal from "../components/CartModel";
import FloatingCartButton from "../components/CartButton";

export default function LandingPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const hotelName = useSessionStore((s) => s.hotelName);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await getAllCategories();
        
        if (Array.isArray(res)) {
          setCategories(res);
        } else if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.categories && Array.isArray(res.categories)) {
          setCategories(res.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        toast.error("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section with Search - Back to original */}
      <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-red-500 px-4 pt-8 pb-12 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-8 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-white rounded-full"></div>
        </div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mb-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to {hotelName || "Our Hotel"}
          </h1>
          <p className="text-white/90 text-lg">
            Discover delicious dishes crafted with love
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Today's Picks Section - Back to original position */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="-mt-6 relative z-20"
      >
        <TodaysPicks />
      </motion.div>

      {/* Categories Section */}
      <div className="relative z-10">
        <CategoriesSection categories={categories} />
      </div>

      {/* Special Offers Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10"
      >
        <SpecialOffers />
      </motion.div>

      {/* Spacer for Bottom Nav */}
      <div className="h-20"></div>

      <BottomNav />

      {/* Floating Cart Button */}
      <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
