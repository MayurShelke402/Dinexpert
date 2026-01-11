// OrdersPanel.jsx - FIXED VERSION
import React, { useMemo, useState, useCallback } from "react";
import OrderCard from "./OrderCard";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlassIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function OrdersPanel({ orders, onAction, filterTableId }) {
  const [query, setQuery] = useState("");

  // ✅ Memoize helper functions to prevent recreation on every render
  const getTableInfo = useCallback((order) => {
    if (!order.tableId) return { id: null, number: 'N/A' };
    
    if (typeof order.tableId === 'object') {
      return {
        id: order.tableId._id,
        number: order.tableId.number || 'N/A'
      };
    }
    
    return { id: order.tableId, number: 'N/A' };
  }, []);

  const calculateTotal = useCallback((order) => {
    if (order.total && order.total > 0) return order.total;
    
    return order.items?.reduce((sum, item) => {
      const price = item.price || item.menuItem?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0) || 0;
  }, []);

  // ✅ Memoize separated orders - only recalculate when orders change
  const active = useMemo(() => 
    orders.filter(o => o.status !== "Completed" && o.status !== "Cancelled"), 
    [orders]
  );
  
  const completed = useMemo(() => 
    orders.filter(o => o.status === "Completed" || o.status === "Cancelled"), 
    [orders]
  );

  // ✅ Memoize filter function to prevent recreation
  const filterFn = useCallback((o) => {
    const tableInfo = getTableInfo(o);
    
    if (filterTableId && tableInfo.id !== filterTableId) return false;
    
    if (!query) return true;
    
    const q = query.toLowerCase();
    return (
      `${tableInfo.number}`.includes(q) ||
      (o._id || "").toLowerCase().includes(q) ||
      (o.userId || "").toLowerCase().includes(q) ||
      (o.items || []).some(item => {
        const itemName = item.name || item.menuItem?.name || "";
        return itemName.toLowerCase().includes(q);
      })
    );
  }, [query, filterTableId, getTableInfo]);

  // ✅ Memoize filtered results - THIS IS THE KEY FIX
  const filteredActive = useMemo(() => 
    active.filter(filterFn), 
    [active, filterFn]
  );
  
  const filteredCompleted = useMemo(() => 
    completed.filter(filterFn), 
    [completed, filterFn]
  );

  // ✅ Memoize stats calculations
  const stats = useMemo(() => {
    const totalRevenue = completed.reduce((sum, order) => sum + calculateTotal(order), 0);
    const pendingCount = active.filter(o => o.status === 'Pending').length;
    const cookingCount = active.filter(o => o.status === 'Cooking').length;
    const readyCount = active.filter(o => o.status === 'Ready').length;
    
    return { totalRevenue, pendingCount, cookingCount, readyCount };
  }, [active, completed, calculateTotal]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0f1419] to-[#1a1f2e] rounded-xl lg:rounded-2xl overflow-hidden">
      {/* Header Section */}
      <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/10">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-1 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
            Orders
          </h2>
          <div className="text-xs sm:text-sm text-white/60">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 lg:mb-4">
          <div className="bg-white/5 rounded-lg p-2 sm:p-3 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-white/60 uppercase tracking-wide">Active</div>
            <div className="text-lg font-bold text-white">{filteredActive.length}</div>
          </div>
          {/* <div className="bg-white/5 rounded-lg p-2 sm:p-3 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-white/60 uppercase tracking-wide">Completed</div>
            <div className="text-lg font-bold text-green-400">{filteredCompleted.length}</div>
          </div> */}
        </div>

        {/* Status Pills - Responsive */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 lg:mb-4">
          {stats.pendingCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-300 font-medium">{stats.pendingCount} Pending</span>
            </div>
          )}
          {stats.cookingCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full border border-orange-500/30">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-orange-300 font-medium">{stats.cookingCount} Cooking</span>
            </div>
          )}
          {stats.readyCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-300 font-medium">{stats.readyCount} Ready</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Orders Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* Active Orders */}
        <div className="flex-1 min-h-0">
          <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Active Orders ({filteredActive.length})
              </h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-2 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {filteredActive.length ? (
                filteredActive.map(order => (
                  <OrderCard key={order._id || order.id} order={order} onAction={onAction} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6 lg:py-8"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
                  </div>
                  <p className="text-white/50 text-sm sm:text-base">No active orders</p>
                  <p className="text-white/30 text-xs sm:text-sm">All caught up! 🎉</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completed Orders - Collapsible on mobile */}
        <div className="border-t border-white/10 bg-gradient-to-b from-green-500/5 to-transparent">
          <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                  Completed ({filteredCompleted.length})
                </h3>
              </div>
              {stats.totalRevenue > 0 && (
                <div className="text-xs text-green-400 font-medium">
                  ₹{stats.totalRevenue} earned
                </div>
              )}
            </div>
          </div>
          
          <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto px-3 sm:px-4 lg:px-6 py-2 space-y-1 sm:space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {filteredCompleted.length ? filteredCompleted.map(order => {
              const tableInfo = getTableInfo(order);
              const total = calculateTotal(order);
              
              return (
                <motion.div 
                  key={order._id || order.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-white flex items-center gap-2">
                        <span className="truncate">Table {tableInfo.number}</span>
                        <span className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></span>
                        <span className="text-xs text-white/60 flex-shrink-0">{order.items?.length || 0} items</span>
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-xs sm:text-sm font-bold text-green-400">₹{total}</div>
                      <div className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded border border-green-500/30 mt-1">
                        {order.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-3 sm:py-4 text-white/40 text-xs sm:text-sm">
                No completed orders yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
