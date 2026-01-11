import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaClock } from "react-icons/fa";
import { HiSparkles, HiShoppingCart } from "react-icons/hi2";
import useCartStore from "../store/CartStore";
import { useSessionStore } from "../store/useSessionStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { createOrder } from "../api/orderAPI";

export default function Cart() {
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
  const [loading, setLoading] = useState(false);
  const prevQuantities = useRef({});

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
      items: orderItems,
      notes: "",
      userId: userId
    };

    try {
      setLoading(true);
      await toast.promise(createOrder(payload), {
        loading: "Placing your order...",
        success: "✅ Order placed successfully!",
        error: (err) => `❌ ${err.message}`,
      });
      clearCart();
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

  if (!orderItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center">
            <HiShoppingCart className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <FaShoppingBag className="w-4 h-4" />
            Browse Menu
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="z-50 min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-40">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Your Order
              </h1>
              <p className="text-sm text-gray-600">{hotelName}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
              <HiSparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">{orderItems.length} items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 px-4 max-w-2xl mx-auto">
        {/* Order Items */}
        <div className="space-y-4 mb-8">
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
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.images?.[0] || "/fallback.jpg"}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shadow-md"
                        onError={(e) => {
                          e.target.src = "/fallback.jpg";
                          e.target.onerror = null;
                        }}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{quantity}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with Remove Button */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-green-600 font-bold text-sm">
                            ₹{item.price.toFixed(2)} each
                          </p>
                        </div>
                        
                        {/* Separated Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item._id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors flex-shrink-0"
                        >
                          <FaTrash size={12} />
                        </motion.button>
                      </div>

                      {/* Controls and Total */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => decreaseQuantity(item._id)}
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
                          >
                            <FaMinus size={10} />
                          </motion.button>
                          <span className="px-3 py-1 font-bold text-gray-800 min-w-[2rem] text-center">
                            {quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addToCart(item, 1)}
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors"
                          >
                            <FaPlus size={10} />
                          </motion.button>
                        </div>

                        {/* Item Total */}
                        <span className="font-bold text-lg text-gray-800">
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

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-orange-200 p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaClock className="w-5 h-5 text-orange-600" />
            Order Summary
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({orderItems.length} items)</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes & Charges</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total Amount</span>
              <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Order Button - Above Bottom Nav */}
      <div className="fixed bottom-16 left-0 right-0 z-50 px-4 py-4 bg-white/95 backdrop-blur-xl shadow-2xl">
        <motion.button
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full max-w-2xl mx-auto relative overflow-hidden text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg ${
            loading
              ? "bg-gray-400"
              : "bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:shadow-2xl hover:shadow-orange-500/25"
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
              <>
                
                Place Order • ₹{totalAmount.toFixed(2)}
              </>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
