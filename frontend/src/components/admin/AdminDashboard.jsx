// components/admin/AdminDashboard.jsx - Complete and Fixed
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import AdminNav from "./AdminNav";
import TableGrid from "./TableGrid";
import OrdersPanel from "./OrderPanel";
import OrderHistory from "../../pages/admin/OrderHistory";
import AdminAnalytics from "../../pages/Admin/AdminAnalytics";
import AdminSettings from "../../pages/admin/AdminSettings";
import Legend from "./Legend";
import {
  fetchTablesWithOrders,
  fetchAllOrders,
  updateOrderStatus,
  updateTableState,
} from "../../api/adminAPI";

import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { HiBars3, HiXMark, HiWifi, HiSignal } from "react-icons/hi2";

const SOCKET_URL = "http://localhost:8080";

// Main Dashboard Component (Tables + Orders)
function MainDashboard() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [showMobileOrders, setShowMobileOrders] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const isMounted = useRef(true);
  const socketRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load function - FIXED: Empty dependency array
  const load = useCallback(async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        fetchTablesWithOrders(),
        fetchAllOrders()
      ]);
      
      if (!isMounted.current) return;
      
      const tables = tablesRes.tables || tablesRes;
      const orders = ordersRes.orders?.data || ordersRes.data || [];
      
      setTables(tables);
      setOrders(orders);
    } catch (err) {
      console.error("Failed loading admin data:", err);
      if (isMounted.current) {
        setTables([]);
        setOrders([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []); // ✅ FIXED: Empty dependency array

  // Socket setup - FIXED: Empty dependency array
  useEffect(() => {
    isMounted.current = true;
    load();

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
    
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("✅ Socket connected");
      if (isMounted.current) setConnectionStatus("connected");
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      if (isMounted.current) setConnectionStatus("disconnected");
    };

    const handleOrderCreated = (newOrder) => {
      console.log("📦 New order created:", newOrder);
      if (isMounted.current && newOrder) {
        setOrders((prev) => [newOrder, ...prev]);
      }
    };

    const handleOrderUpdated = (updatedOrder) => {
      console.log("🔄 Order updated:", updatedOrder);
      if (isMounted.current && updatedOrder?._id) {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
      }
    };

    const handleTableUpdated = (updatedTable) => {
      console.log("🪑 Table updated:", updatedTable);
      if (isMounted.current && updatedTable?._id) {
        setTables((prev) =>
          prev.map((t) => (t._id === updatedTable._id ? updatedTable : t))
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("order.created", handleOrderCreated);
    socket.on("order.updated", handleOrderUpdated);
    socket.on("table.updated", handleTableUpdated);

    return () => {
      console.log("🧹 Cleaning up socket connection");
      isMounted.current = false;
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("order.created", handleOrderCreated);
        socket.off("order.updated", handleOrderUpdated);
        socket.off("table.updated", handleTableUpdated);
        socket.disconnect();
      }
    };
  }, []); // ✅ FIXED: Empty dependency array

  const handleSelectTable = useCallback((table) => {
    setSelectedTable((s) => (s && s._id === table._id ? null : table));
  }, []);

  // Handle order actions - FIXED: Complete implementation with empty deps
  const handleOrderAction = useCallback(async (order, newStatus) => {
    if (!order?._id) {
      console.error("❌ Invalid order:", order);
      return;
    }

    try {
      console.log(`🔄 Updating order ${order._id} to status: ${newStatus}`);
      
      // Optimistically update UI
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: newStatus } : o
        )
      );

      // Call API to update order status
      const response = await updateOrderStatus(order._id, newStatus);

      if (response.success) {
        console.log("✅ Order updated successfully:", response.data);
        
        // Update with server response
        if (response.data) {
          setOrders((prev) =>
            prev.map((o) => (o._id === response.data._id ? response.data : o))
          );
        }
      } else {
        // throw new Error(response.message || "Failed to update order");
      }
    } catch (error) {
      console.error("❌ Error updating order:", error);
      
      // Revert optimistic update on error by reloading
      try {
        const ordersRes = await fetchAllOrders();
        const orders = ordersRes.orders?.data || ordersRes.data || [];
        setOrders(orders);
      } catch (reloadError) {
        console.error("❌ Failed to reload orders:", reloadError);
      }
      
      // Optional: Show error notification
      alert(`Failed to update order: ${error.message}`);
    }
  }, []); // ✅ FIXED: Empty dependency array

  // In MainDashboard component, add this handler after handleOrderAction:

const handleTableAction = useCallback(async (table, newStatus) => {
  if (!table?._id) {
    console.error("❌ Invalid table:", table);
    return;
  }

  try {
    console.log(`🪑 Updating table ${table._id} to status: ${newStatus}`);
    
    // Optimistically update UI
    setTables((prev) =>
      prev.map((t) =>
        t._id === table._id ? { ...t, status: newStatus } : t
      )
    );

    // Call API to update table status
    const response = await updateTableState(table._id, newStatus);

    if (response.success) {
      console.log("✅ Table updated successfully:", response.data);
      
      // Update with server response
      if (response.data) {
        setTables((prev) =>
          prev.map((t) => (t._id === response.data._id ? response.data : t))
        );
      }
    } else {
      throw new Error(response.message || "Failed to update table");
    }
  } catch (error) {
    console.error("❌ Error updating table:", error);
    
    // Revert optimistic update on error by reloading
    try {
      const tablesRes = await fetchTablesWithOrders();
      const tables = tablesRes.tables || tablesRes;
      setTables(tables);
    } catch (reloadError) {
      console.error("❌ Failed to reload tables:", reloadError);
    }
    
    // Optional: Show error notification
    alert(`Failed to update table: ${error.message}`);
  }
}, []); // Empty dependency array


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071029] via-[#081429] to-[#06121f] text-white">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-1">
                  Live Dashboard
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                  <span>Floor 1 • Live orders</span>
                  <div className="flex items-center gap-2">
                    {connectionStatus === 'connected' && (
                      <>
                        <HiWifi className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Connected</span>
                      </>
                    )}
                    {connectionStatus === 'error' && (
                      <>
                        <HiSignal className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Error</span>
                      </>
                    )}
                    {connectionStatus === 'disconnected' && (
                      <>
                        <HiSignal className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">Connecting...</span>
                      </>
                    )}
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-4">
                <Legend />
              </div>

              <div className="lg:hidden flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileOrders(!showMobileOrders)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                >
                  {showMobileOrders ? (
                    <HiXMark className="w-5 h-5" />
                  ) : (
                    <HiBars3 className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {showMobileOrders ? 'Tables' : 'Orders'}
                  </span>
                  {!showMobileOrders && orders.filter(o => o.status !== "Completed").length > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {orders.filter(o => o.status !== "Completed").length}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          <div className="lg:hidden px-4 pb-4">
            <Legend />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden lg:flex h-full gap-6 p-6">
            <div className="flex-1 min-w-0 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                    <p className="text-white/60">Loading tables...</p>
                  </div>
                </div>
              ) : (
                <TableGrid
                  tables={tables}
                  onSelectTable={handleSelectTable}
                  selectedTableId={selectedTable?._id}
                />
              )}
            </div>

            <div className="w-96 flex-shrink-0">
              <OrdersPanel
                orders={orders}
                onAction={handleOrderAction}
                filterTableId={selectedTable?._id}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden h-full">
            <AnimatePresence mode="wait">
              {!showMobileOrders ? (
                <motion.div
                  key="tables"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full bg-gradient-to-br from-white/5 to-white/2 border-t border-white/10"
                >
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
                        <p className="text-white/60">Loading tables...</p>
                      </div>
                    </div>
                  ) : (
                    <TableGrid
                      tables={tables}
                      onSelectTable={handleSelectTable}
                      selectedTableId={selectedTable?._id}
                      onTableAction={handleTableAction}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full border-t border-white/10"
                >
                  <OrdersPanel
                    orders={orders}
                    onAction={handleOrderAction}
                    filterTableId={selectedTable?._id}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden flex-shrink-0 bg-black/40 backdrop-blur-sm border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-white/60">
                Tables: <span className="text-white font-medium">{tables.length}</span>
              </span>
              <span className="text-white/60">
                Active: <span className="text-white font-medium">
                  {orders.filter(o => o.status !== "Completed").length}
                </span>
              </span>
            </div>
            <div className="text-white/40 font-mono text-xs">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Admin Component with Navigation
export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <AdminNav />
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
}
