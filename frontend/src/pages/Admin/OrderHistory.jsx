// pages/admin/OrderHistory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import AdminNav from '../../components/admin/AdminNav';
import { 
  ClockIcon, 
  BanknotesIcon, 
  ShoppingBagIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { fetchOrderHistory } from '../../api/adminAPI';

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const pages = [];
  const showPages = 5; // Show 5 page numbers at most
  
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);
  
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6 p-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-700/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-700/80'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-700/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function OrderHistory() {
  
  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [timeFilter, setTimeFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('');
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrder: 0
  });

  // Helper function to get date range based on filter
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeFilter) {
      case 'today':
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return {
          startDate: weekAgo.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0]
        };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return {
          startDate: monthAgo.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0]
        };
      case 'custom':
        return {
          startDate: customDateRange.start,
          endDate: customDateRange.end
        };
      default:
        return {};
    }
  };

  // Get time filter label
  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'custom': return `${customDateRange.start} to ${customDateRange.end}`;
      default: return 'All Time';
    }
  };

  // Load orders with proper cleanup and error handling
  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Simple filters without hotelId for debugging
        const filters = {
          page: pagination.page,
          limit: pagination.limit,
          ...(statusFilter && { status: statusFilter })
        };

        console.log('🔍 Fetching orders with filters:', filters);

        const response = await fetchOrderHistory(filters);
        
        console.log('📦 API Response:', response);
        
        if (!isMounted) return;

        if (response.success) {
          // Handle response data structure from your working controller
          const ordersData = response.data || [];
          setOrders(ordersData);
          
          // Update pagination from response
          setPagination(prev => ({
            ...prev,
            total: response.total || 0,
            totalPages: response.totalPages || 0
          }));

          // Calculate analytics from orders data
          const revenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
          setAnalytics({
            totalRevenue: revenue,
            totalOrders: response.total || ordersData.length,
            averageOrder: ordersData.length ? revenue / ordersData.length : 0
          });

          console.log('✅ Orders loaded:', ordersData.length);
        } else {
          throw new Error(response.message || 'Failed to fetch orders');
        }
      } catch (error) {
        if (!isMounted) return;
        setError(error.message || 'Failed to load orders');
        console.error('❌ Error loading orders:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [pagination.page, statusFilter]); // Removed timeFilter and hotelId for debugging

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Handle filter changes
  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Apply filters and close dropdown
  const applyFilters = () => {
    setShowFilters(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Status color helper
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'preparing':
      case 'cooking':
        return 'bg-orange-500/20 text-orange-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <>
    <AdminNav/>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Order History & Analytics</h1>
              <p className="text-white/60">Revenue insights and order tracking</p>
            </div>
          </div>

          {/* Debug Info */}
          <div className="text-xs text-white/40 bg-slate-800/50 px-3 py-2 rounded">
            Debug: {orders.length} orders loaded
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-700/80 transition-all"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filters</span>
                {statusFilter && <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Status: {statusFilter}</span>}
              </button>

              {showFilters && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                  <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl z-20 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Order Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => handleStatusFilterChange(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                        >
                          <option value="">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={applyFilters}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <BanknotesIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-white">{analytics.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <ShoppingBagIcon className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium mb-1">Average Order</p>
                <p className="text-3xl font-bold text-white">₹{analytics.averageOrder.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-6">
        <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Order Details</h2>
                <p className="text-white/60">
                  Showing {orders.length} orders {pagination.total > 0 && `of ${pagination.total.toLocaleString()}`}
                </p>
              </div>
              <div className="text-sm text-white/60">
                Page {pagination.page} of {pagination.totalPages || 1}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6 bg-red-500/10 border-l-4 border-red-500 m-6 rounded">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400 mr-3" />
                <div>
                  <h3 className="text-red-400 font-medium">Error loading orders</h3>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60"></div>
            </div>
          ) : orders.length > 0 ? (
            <>
              <div className="divide-y divide-white/10">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <ShoppingBagIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-medium">
                              Order #{order._id?.slice(-6)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-white/60">
                            {order.tableId?.number && `Table ${order.tableId.number} • `}
                            {order.user?.name && `${order.user.name} • `}
                            {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">₹{(order.price || order.total || 0).toLocaleString()}</div>
                        <div className="text-sm text-white/60">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 ml-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {order.items.slice(0, 6).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                              <span className="text-white/80">{item.name || item.menuItem?.name || 'Unknown Item'}</span>
                              <span className="text-white/60">×{item.quantity || 1}</span>
                            </div>
                          ))}
                          {order.items.length > 6 && (
                            <div className="text-sm text-white/60 px-3 py-2">
                              +{order.items.length - 6} more items
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <ShoppingBagIcon className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
              <p className="text-white/60">No orders match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
