// components/CartModal.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaPlus, FaMinus, FaTrash, FaTimes, FaClock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import useCartStore from "../store/CartStore";
import { useSessionStore } from "../store/useSessionStore";
import {useOrderStore}  from "../store/useOrderStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { createOrder } from "../api/orderAPI";

export default function CartModal({ isOpen, onClose }) {
  const {
    cartItems = [],
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,
    getQuantityById,
  } = useCartStore();

  const hotelId = useSessionStore((s) => s.hotelId);
  const tableId = useSessionStore((s) => s.tableId);
  const userId = useSessionStore((s) => s.userId);
  const hotelName = useSessionStore((s) => s.hotelName);
  
  const { addActiveOrder, startSession, sessionId } = useOrderStore();
  
  const [loading, setLoading] = useState(false);
  const prevQuantities = useRef({});

  // Initialize session on first load
  useEffect(() => {
    if (!sessionId && tableId) {
      startSession();
    }
  }, [sessionId, tableId, startSession]);

  // Notify on item removal
  useEffect(() => {
    cartItems.forEach((item) => {
      const currentQty = getQuantityById(item._id);
      const prevQty = prevQuantities.current[item._id] || 0;

      if (prevQty > 0 && currentQty === 0) {
        toast.success(`${item.name} removed from cart`);
      }

      prevQuantities.current[item._id] = currentQty;
    });
  }, [cartItems, getQuantityById]);

  const orderItems = useMemo(
    () =>
      cartItems
        .filter((item) => getQuantityById(item._id) > 0)
        .map((item) => ({
          menuItem: item._id,
          quantity: getQuantityById(item._id),
          price: item.price,
          name: item.name,
          images: item.images
        })),
    [cartItems, getQuantityById]
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.price * getQuantityById(item._id),
        0
      ),
    [cartItems, getQuantityById]
  );

  const handlePlaceOrder = async () => {
    if (!tableId || orderItems.length === 0) {
      toast.error("Table or items missing");
      return;
    }

    const payload = {
      tableId,
      hotelId,
      total: totalAmount,
      items: orderItems.map(item => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: item.price
      })),
      notes: "",
      userId: userId,
      sessionId: sessionId
    };

    try {
      setLoading(true);
      
      const response = await toast.promise(createOrder(payload), {
        loading: "Placing your order...",
        success: "✅ Order placed successfully!",
        error: (err) => `❌ ${err.message}`,
      });

      if (response.success) {
        addActiveOrder({
          _id: response.data._id,
          items: orderItems,
          total: totalAmount,
          tableId,
          hotelId,
          status: response.data.status || 'pending'
        });
      }

      clearCart();
      onClose(); // Close modal after success
      
    } catch (err) {
      console.error("Create order failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const listVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[80] bg-gradient-to-br from-orange-50 via-white to-pink-50 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/90 border-b border-gray-100 shadow-sm px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-600">{hotelName}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
                    <HiSparkles className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {orderItems.length} items
                    </span>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-4 py-4">
              {orderItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items from the menu</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    <AnimatePresence initial={false}>
                      {orderItems.map((itemData) => {
                        const item = cartItems.find((i) => i._id === itemData.menuItem);
                        const quantity = itemData.quantity;

                        return (
                          <motion.div
                            key={item._id}
                            layout
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={listVariants}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-white rounded-xl shadow-md border border-gray-100 p-3 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start gap-3">
                              {/* Image */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={item.images?.[0] || "/fallback.jpg"}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                                  onError={(e) => {
                                    e.target.src = "/fallback.jpg";
                                    e.target.onerror = null;
                                  }}
                                />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{quantity}</span>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1 pr-2">
                                    {item.name}
                                  </h3>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFromCart(item._id)}
                                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors flex-shrink-0"
                                  >
                                    <FaTrash size={10} />
                                  </motion.button>
                                </div>

                                <p className="text-green-600 font-bold text-xs mb-2">
                                  ₹{item.price.toFixed(2)} each
                                </p>

                                <div className="flex items-center justify-between">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => decreaseQuantity(item._id)}
                                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
                                    >
                                      <FaMinus size={8} />
                                    </motion.button>
                                    <span className="px-2 py-0.5 font-bold text-gray-800 text-sm min-w-[1.5rem] text-center">
                                      {quantity}
                                    </span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => addToCart(item, 1)}
                                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors"
                                    >
                                      <FaPlus size={8} />
                                    </motion.button>
                                  </div>

                                  {/* Item Total */}
                                  <span className="font-bold text-sm text-gray-800">
                                    ₹{(item.price * quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-orange-200 p-4 shadow-md">
                    <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaClock className="w-4 h-4 text-orange-600" />
                      Order Summary
                    </h3>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal ({orderItems.length} items)</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Taxes & Charges</span>
                        <span className="text-green-600">Free</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer - Fixed Order Button */}
            {orderItems.length > 0 && (
              <div className="sticky bottom-0 px-4 py-3 bg-white/95 backdrop-blur-xl border-t border-gray-200">
                <motion.button
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full relative overflow-hidden text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg ${
                    loading
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:shadow-xl"
                  }`}
                >
                  {loading && (
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-white/20"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Placing Order...
                      </>
                    ) : (
                      <>Place Order • ₹{totalAmount.toFixed(2)}</>
                    )}
                  </span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
