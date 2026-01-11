// components/FloatingCartButton.jsx
import React from "react";
import { HiShoppingCart } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/CartStore";

export default function FloatingCartButton({ onClick }) {
  const { cartItems, getQuantityById } = useCartStore();
  
  const totalItems = cartItems.reduce(
    (sum, item) => sum + getQuantityById(item._id),
    0
  );
  
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * getQuantityById(item._id),
    0
  );

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:shadow-orange-500/50 transition-all"
      >
        {/* Cart Icon with Badge */}
        <div className="relative">
          <HiShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        
        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium opacity-90">View Cart</span>
          <span className="text-sm font-bold">₹{totalAmount.toFixed(2)}</span>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
