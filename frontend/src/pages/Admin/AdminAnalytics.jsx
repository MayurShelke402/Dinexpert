import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  FireIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import AdminNav from '../../components/admin/AdminNav.jsx';
import { fetchAnalytics } from '../../api/analyticsAPI.js';
import { useSessionStore } from '../../store/useSessionStore.js';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const hotelId = useSessionStore((s) => s.hotelId);

  // Date range helper
  const getDateRange = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeRange) {
      case 'today':
        return {
          startDate: today.toISOString(),
          endDate: now.toISOString(),
          label: 'Today'
        };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return {
          startDate: weekAgo.toISOString(),
          endDate: now.toISOString(),
          label: 'Last 7 Days'
        };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return {
          startDate: monthAgo.toISOString(),
          endDate: now.toISOString(),
          label: 'Last 30 Days'
        };
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return {
          startDate: yearAgo.toISOString(),
          endDate: now.toISOString(),
          label: 'Last Year'
        };
      default:
        return {
          startDate: today.toISOString(),
          endDate: now.toISOString(),
          label: 'Today'
        };
    }
  }, [timeRange]);

  // Fetch analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      console.log("🔄 Loading analytics...");
      setLoading(true);
      setError(null);
      
      try {
        const { startDate, endDate } = getDateRange();
        console.log("📅 Date range:", { startDate, endDate, hotelId });
        
        const response = await fetchAnalytics(startDate, endDate, hotelId);
        
        // ✅ Detailed logging
        console.log("📦 Raw Response:", response);
        console.log("📊 Response Data:", response.data);
        console.log("💰 Revenue Structure:", response.data?.revenue);
        console.log("📈 Hourly Trend:", response.data?.hourlyTrend);
        console.log("🏆 Top Items:", response.data?.topItems);
        
        if (response.success && response.data) {
          setAnalyticsData(response.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange, getDateRange, hotelId]);

  // ✅ Safe data access with fallback
  const data = analyticsData || {
    revenue: { 
      total: 0, 
      change: 0, 
      byDay: [] 
    },
    orders: { 
      total: 0, 
      change: 0, 
      avgValue: 0, 
      byStatus: {
        pending: 0,
        preparing: 0,
        completed: 0,
        cancelled: 0
      }
    },
    tables: { 
      totalTables: 0, 
      occupancyRate: 0, 
      avgTurnover: 0, 
      peakHours: [] 
    },
    topItems: [],
    hourlyTrend: []
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-4">
            <p className="text-red-400 text-lg mb-2">⚠️ Error Loading Analytics</p>
            <p className="text-white/60 text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main Dashboard UI
  return (
    <>
      <AdminNav/>
   
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-white/60">Comprehensive insights into your restaurant performance</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg border border-white/10">
              {['today', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {range === 'today' ? 'Today' :
                   range === 'week' ? '7 Days' :
                   range === 'month' ? '30 Days' : 'Year'}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue Card */}
            <MetricCard
              title="Total Revenue"
              value={`₹${(data.revenue?.total || 0).toLocaleString()}`}
              change={data.revenue?.change || 0}
              icon={CurrencyRupeeIcon}
              color="green"
            />

            {/* Total Orders Card */}
            <MetricCard
              title="Total Orders"
              value={data.orders?.total || 0}
              change={data.orders?.change || 0}
              icon={ShoppingBagIcon}
              color="blue"
            />

            {/* Average Order Value */}
            <MetricCard
              title="Avg Order Value"
              value={`₹${(data.orders?.avgValue || 0).toFixed(0)}`}
              change={5.2}
              icon={ChartBarIcon}
              color="purple"
            />

            {/* Table Occupancy */}
            <MetricCard
              title="Table Occupancy"
              value={`${(data.tables?.occupancyRate || 0).toFixed(1)}%`}
              change={3.1}
              icon={UserGroupIcon}
              color="orange"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend Chart */}
          <ChartCard title="Revenue Trend" subtitle="Daily revenue over selected period">
            <RevenueChart data={data.revenue?.byDay || []} />
          </ChartCard>

          {/* Hourly Orders Chart */}
          <ChartCard title="Order Distribution" subtitle="Orders by time of day">
            <HourlyChart data={data.hourlyTrend || []} />
          </ChartCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Selling Items */}
          <div className="lg:col-span-2">
            <TopItemsTable items={data.topItems || []} />
          </div>

          {/* Quick Stats */}
          <QuickStatsCard
            occupancy={data.tables?.occupancyRate || 0}
            turnover={data.tables?.avgTurnover || 0}
            peakHours={data.tables?.peakHours || []}
            completionRate={
              data.orders?.byStatus?.completed && data.orders?.total
                ? ((data.orders.byStatus.completed / data.orders.total) * 100).toFixed(1)
                : 0
            }
          />
        </div>
      </div>
    </>
  );
}

// MetricCard Component
function MetricCard({ title, value, change, icon: Icon, color }) {
  const isPositive = change >= 0;
  const colorClasses = {
    green: 'from-green-500/20 to-emerald-500/10 border-green-500/30',
    blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
    purple: 'from-purple-500/20 to-pink-500/10 border-purple-500/30',
    orange: 'from-orange-500/20 to-red-500/10 border-orange-500/30'
  };

  const iconColorClasses = {
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${iconColorClasses[color].split(' ')[0]} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[color].split(' ')[1]}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

// Chart Card Wrapper
function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-white/60 text-sm">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

// Revenue Bar Chart
function RevenueChart({ data }) {
  console.log('💰 Revenue Chart received:', data);
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-white/40">No revenue data available</p>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount || 0), 1);
  
  return (
    <div className="space-y-3">
      {data.map((day, idx) => (
        <div key={idx}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">
              {day.date || day._id || `Day ${idx + 1}`}
            </span>
            <span className="text-white font-semibold">
              ₹{(day.amount || 0).toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((day.amount || 0) / maxAmount) * 100}%` }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Hourly Orders Chart
function HourlyChart({ data }) {
  console.log('📊 Hourly Chart Data:', data);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-white/40">No order data available</p>
      </div>
    );
  }

  const maxOrders = Math.max(...data.map(d => d.orders || 0), 1);
  
  return (
    <div className="h-64 px-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((slot, idx) => {
          const hasOrders = (slot.orders || 0) > 0;
          const heightPercent = hasOrders 
            ? Math.max(((slot.orders || 0) / maxOrders) * 100, 15)
            : 0;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center min-w-[20px]">
              <div className="relative w-full h-48 flex items-end">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: hasOrders ? `${heightPercent}%` : '2px',
                    opacity: hasOrders ? 1 : 0.3
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: idx * 0.05,
                    ease: "easeOut"
                  }}
                  className={`w-full rounded-t-lg relative group cursor-pointer ${
                    hasOrders 
                      ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/20' 
                      : 'bg-white/10'
                  }`}
                  style={{
                    minHeight: hasOrders ? '20px' : '2px'
                  }}
                >
                  {hasOrders && (
                    <>
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-3 rounded-xl text-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-20 shadow-xl border border-blue-500/30 pointer-events-none">
                        <div className="font-bold mb-2 text-blue-300">{slot.hour}</div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-white/90">{slot.orders} orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 font-semibold">₹{slot.revenue || 0}</span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-blue-500/30 rotate-45"></div>
                      </div>
                      
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-300">
                        {slot.orders}
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
              
              <span className={`text-[11px] mt-3 font-medium ${
                hasOrders ? 'text-blue-300' : 'text-white/40'
              }`}>
                {slot.hour || `${idx}:00`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Top Items Table
function TopItemsTable({ items }) {
  console.log('🏆 Top Items received:', items);
  
  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top Selling Items</h3>
        <div className="flex items-center justify-center h-48">
          <p className="text-white/40">No sales data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
    >
      <h3 className="text-xl font-bold text-white mb-6">Top Selling Items</h3>
      <div className="space-y-4">
        {items.slice(0, 5).map((item, idx) => (
          <div key={item._id || idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 font-bold">{idx + 1}</span>
              </div>
              <div>
                <p className="text-white font-medium">{item.name || 'Unknown Item'}</p>
                <p className="text-white/60 text-sm">{item.orders || item.count || 0} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">₹{(item.revenue || item.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-green-400 text-sm">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Quick Stats Card
function QuickStatsCard({ occupancy, turnover, peakHours, completionRate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
    >
      <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
      <div className="space-y-6">
        <StatItem
          icon={UserGroupIcon}
          label="Table Occupancy"
          value={`${(occupancy || 0).toFixed(1)}%`}
          color="blue"
        />
        <StatItem
          icon={ClockIcon}
          label="Avg Table Turnover"
          value={`${(turnover || 0).toFixed(1)}x`}
          color="purple"
        />
        <StatItem
          icon={FireIcon}
          label="Peak Hours"
          value={peakHours?.length > 0 ? peakHours.join(', ') : 'N/A'}
          color="orange"
        />
        <StatItem
          icon={CheckCircleIcon}
          label="Order Completion"
          value={`${completionRate || 0}%`}
          color="green"
        />
      </div>
    </motion.div>
  );
}

function StatItem({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
    green: 'bg-green-500/20 text-green-400'
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`p-3 ${colorClasses[color].split(' ')[0]} rounded-lg`}>
        <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[1]}`} />
      </div>
      <div className="flex-1">
        <p className="text-white/60 text-sm">{label}</p>
        <p className="text-white font-bold">{value}</p>
      </div>
    </div>
  );
}
