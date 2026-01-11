// OrderCard.jsx - FIXED VERSION
import React from "react";
import { motion } from "framer-motion";
import { 
  ClockIcon, 
  FireIcon, 
  CheckCircleIcon,
  CurrencyRupeeIcon
} from "@heroicons/react/24/outline";

function OrderCard({ order, onAction }) {
  // ❌ REMOVED: console.log('🎯 OrderCard received order:', order);
  
  // Helper functions
  const getTableInfo = (order) => {
    if (!order.tableId) return { id: null, number: 'N/A' };
    
    if (typeof order.tableId === 'object') {
      return {
        id: order.tableId._id,
        number: order.tableId.number || 'N/A'
      };
    }
    
    return { id: order.tableId, number: 'N/A' };
  };

  const calculateTotal = (order) => {
    if (order.total && order.total > 0) return order.total;
    if (order.totalAmount && order.totalAmount > 0) return order.totalAmount;
    
    return order.items?.reduce((sum, item) => {
      const price = item.price || item.menuItem?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0) || 0;
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return {
          icon: ClockIcon,
          color: 'yellow',
          bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-300',
          pulse: true
        };
      case 'cooking':
      case 'preparing':
        return {
          icon: FireIcon,
          color: 'orange',
          bg: 'bg-gradient-to-br from-orange-500/20 to-red-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-300',
          pulse: true
        };
      case 'ready':
        return {
          icon: CheckCircleIcon,
          color: 'blue',
          bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
          pulse: true
        };
      case 'completed':
      case 'delivered':
        return {
          icon: CheckCircleIcon,
          color: 'green',
          bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/10',
          border: 'border-green-500/30',
          text: 'text-green-300',
          pulse: false
        };
      default:
        return {
          icon: ClockIcon,
          color: 'gray',
          bg: 'bg-gradient-to-br from-gray-500/20 to-slate-500/10',
          border: 'border-gray-500/30',
          text: 'text-gray-300',
          pulse: false
        };
    }
  };

  // Handle action - simplified (removed debug log to reduce spam)
  const handleAction = (newStatus) => {
    if (onAction) {
      onAction(order, newStatus);
    }
  };

  const tableInfo = getTableInfo(order);
  const total = calculateTotal(order);
  const itemCount = order.items?.length || 0;
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const currentStatus = order.status?.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${statusConfig.bg} ${statusConfig.border}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold text-white">{tableInfo.number}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white text-sm sm:text-base truncate">Table {tableInfo.number}</h4>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <CurrencyRupeeIcon className="w-3 h-3" />
              <span>{total}</span>
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full border ${statusConfig.border} ${statusConfig.bg} flex-shrink-0`}>
          <StatusIcon className={`w-3 h-3 ${statusConfig.text} ${statusConfig.pulse ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-medium ${statusConfig.text} hidden sm:inline`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-3 sm:mb-4 space-y-1 sm:space-y-2">
        {order.items?.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs sm:text-sm bg-white/5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-4 h-4 sm:w-5 sm:h-5 bg-white/10 rounded text-xs flex items-center justify-center text-white/80 flex-shrink-0">
                {item.quantity || 1}
              </span>
              <span className="text-white/90 truncate">
                {item.name || item.menuItem?.name || 'Unknown Item'}
              </span>
            </div>
            {(item.price || item.menuItem?.price) && (
              <span className="text-white/60 text-xs flex-shrink-0 ml-2">
                ₹{item.price || item.menuItem?.price}
              </span>
            )}
          </div>
        ))}
        
        {itemCount > 2 && (
          <div className="text-xs text-white/50 text-center py-1">
            +{itemCount - 2} more items
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed Logic */}
      {currentStatus !== 'completed' && currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
        <div className="space-y-1.5 sm:space-y-2">
          {currentStatus === 'pending' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('preparing')}
              className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
            >
              Start Cooking
            </motion.button>
          )}
          
          {(currentStatus === 'cooking' || currentStatus === 'preparing') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('ready')}
              className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Mark Ready
            </motion.button>
          )}
          
          {/* {(currentStatus === 'ready' || currentStatus === 'cooking' || currentStatus === 'preparing') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('Completed')}
              className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              Complete Order
            </motion.button>
          )} */}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
        <span>#{order._id?.slice(-6) || 'Unknown'}</span>
        <span className="hidden sm:inline">{new Date(order.createdAt).toLocaleTimeString()}</span>
        <span className="sm:hidden">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </motion.div>
  );
}

// ✅ CRITICAL FIX: Export with React.memo
export default React.memo(OrderCard);
