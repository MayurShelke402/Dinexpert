// pages/ActiveOrders.jsx
import React, { useEffect, useState } from "react";
import { Clock, ChefHat, CheckCircle, Package } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { motion, AnimatePresence } from "framer-motion";
import { HiShoppingBag } from "react-icons/hi2";
import FloatingCartButton from "../components/CartButton";
import CartModal from "../components/CartModel";

export default function ActiveOrders() {
  const { activeOrders, getPendingCount } = useOrderStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        label: "Order Received",
        description: "Your order is being processed"
      },
      preparing: {
        icon: ChefHat,
        color: "bg-orange-100 text-orange-700 border-orange-300",
        label: "Preparing",
        description: "Chef is preparing your food"
      },
      ready: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700 border-green-300",
        label: "Ready to Serve",
        description: "Your order will be served shortly"
      }
    };
    return configs[status] || configs.pending;
  };

  if (activeOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Orders</h2>
          <p className="text-gray-600 mb-6">Your placed orders will appear here</p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <HiShoppingBag className="w-4 h-4" />
            Browse Menu
          </motion.a>
        </motion.div>
      </div>
    );
  }

  useEffect(() => {
    console.log("orders",activeOrders);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Active Orders
              </h1>
              <p className="text-sm text-gray-600">Track your orders in real-time</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                {getPendingCount()} pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="pt-6 px-4 max-w-2xl mx-auto space-y-4">
        <AnimatePresence>
          {activeOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={order.localId || order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Order #{(order.localId || order._id).slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.placedAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    <span className="text-xs font-bold">{statusConfig.label}</span>
                  </div>
                </div>

                {/* Status Description */}
                <p className="text-sm text-gray-600 mb-4">{statusConfig.description}</p>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.images?.[0] && (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                  <span className="font-semibold text-gray-700">Order Total</span>
                  <span className="font-bold text-lg text-orange-600">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <FloatingCartButton onClick={() => setIsCartOpen(true)} />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
