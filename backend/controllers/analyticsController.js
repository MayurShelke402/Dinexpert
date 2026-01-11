// controllers/analyticsController.js
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';

// ---------- Shared helpers ----------

// build a consistent filter for Order docs
function buildOrderFilter({ start, end, hotelId }) {
  const filter = {
    createdAt: { $gte: start, $lte: end },
  };

  if (hotelId) {
    // if your Order schema uses `hotel` instead, change this to `filter.hotel = ...`
    filter.hotelId = new mongoose.Types.ObjectId(hotelId);
  }

  return filter;
}

function getTimeLabel(start, end) {
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 1) return 'Today';
  if (daysDiff <= 7) return 'Last 7 Days';
  if (daysDiff <= 30) return 'Last 30 Days';
  if (daysDiff <= 365) return 'This Year';
  return 'Custom Range';
}

// ---------- Main Analytics Endpoint ----------

export const getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, hotelId } = req.query;
    console.log('📊 Analytics Request:', { startDate, endDate, hotelId });

    // parse dates
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.setHours(0, 0, 0, 0));
    const end = endDate ? new Date(endDate) : new Date();

    const baseQuery = buildOrderFilter({ start, end, hotelId });

    const [
      revenueData,
      ordersData,
      topItems,
      hourlyTrend,
      tableStats,
      categoryPerformance,
      previousPeriodRevenue,
    ] = await Promise.all([
      getRevenueData(baseQuery),
      getOrdersData(baseQuery),
      getTopSellingItems(baseQuery, 10),
      getHourlyTrend(baseQuery),
      getTableStatistics(hotelId, start, end),
      getCategoryPerformance(baseQuery),
      getPreviousPeriodRevenue(start, end, hotelId),
    ]);

    const revenueChange =
      previousPeriodRevenue > 0
        ? Number(
            (
              ((revenueData.total - previousPeriodRevenue) / previousPeriodRevenue) *
              100
            ).toFixed(1),
          )
        : 0;

    res.json({
      success: true,
      data: {
        revenue: {
          total: revenueData.total,
          change: revenueChange,
          previousPeriod: previousPeriodRevenue,
          byDay: revenueData.byDay,
          byCategory: categoryPerformance,
        },
        orders: ordersData,
        topItems,
        hourlyTrend,
        tables: tableStats,
        period: {
          start,
          end,
          label: getTimeLabel(start, end),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------- Revenue Data ----------

async function getRevenueData(baseQuery) {
  const pipeline = [
    { $match: baseQuery },
    {
      $facet: {
        total: [
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
            },
          },
        ],
        byDay: [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
              amount: { $sum: '$total' },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              date: '$_id',
              amount: 1,
              orders: 1,
            },
          },
        ],
      },
    },
  ];

  const result = await Order.aggregate(pipeline).exec();
  const facet = result[0] || { total: [], byDay: [] };

  return {
    total: facet.total[0]?.total || 0,
    byDay: facet.byDay || [],
  };
}

// ---------- Orders Statistics ----------

async function getOrdersData(baseQuery) {
  const pipeline = [
    { $match: baseQuery },
    {
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        avgValue: [
          {
            $group: {
              _id: null,
              avg: { $avg: '$total' },
            },
          },
        ],
      },
    },
  ];

  const result = await Order.aggregate(pipeline).exec();
  const facet = result[0] || { total: [], byStatus: [], avgValue: [] };

  const total = facet.total[0]?.count || 0;
  const avgValue = facet.avgValue[0]?.avg || 0;

  const byStatusRaw = facet.byStatus.reduce((acc, item) => {
    const key = (item._id || '').toString().toLowerCase();
    acc[key] = item.count;
    return acc;
  }, {});

  return {
    total,
    avgValue: Math.round(avgValue),
    byStatus: {
      completed: byStatusRaw.completed || byStatusRaw.delivered || 0,
      cancelled: byStatusRaw.cancelled || 0,
      pending: byStatusRaw.pending || 0,
      preparing: byStatusRaw.preparing || byStatusRaw.cooking || 0,
      ready: byStatusRaw.ready || 0,
    },
    change: 0,
  };
}

// ---------- Top Selling Items ----------

async function getTopSellingItems(baseQuery, limit = 10) {
  const pipeline = [
    { $match: baseQuery },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'menuitems', // make sure collection name matches
        localField: 'items.menuItem',
        foreignField: '_id',
        as: 'menuItemData',
      },
    },
    {
      $unwind: {
        path: '$menuItemData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$items.menuItem',
        name: { $first: '$menuItemData.name' },
        orders: { $sum: '$items.quantity' },
        revenue: {
          $sum: {
            $multiply: [
              { $ifNull: ['$menuItemData.price', 0] },
              { $ifNull: ['$items.quantity', 1] },
            ],
          },
        },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        name: 1,
        orders: 1,
        revenue: { $round: ['$revenue', 0] },
      },
    },
  ];

  const result = await Order.aggregate(pipeline).exec();
  return result;
}

// ---------- Hourly Trend ----------

async function getHourlyTrend(baseQuery) {
  const pipeline = [
    { $match: baseQuery },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        orders: { $sum: 1 },
        revenue: { $sum: { $ifNull: ['$total', 0] } },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        hourIndex: '$_id',
        orders: 1,
        revenue: { $round: ['$revenue', 0] },
      },
    },
  ];

  const raw = await Order.aggregate(pipeline).exec();

  // map to 2‑hour buckets 0‑2, 2‑4, ...
  const buckets = [];
  for (let i = 0; i < 24; i += 2) {
    const rangeLabel = `${i}-${i + 2}`;
    const rangeOrders = raw
      .filter((h) => h.hourIndex >= i && h.hourIndex < i + 2)
      .reduce(
        (acc, curr) => ({
          orders: acc.orders + curr.orders,
          revenue: acc.revenue + curr.revenue,
        }),
        { orders: 0, revenue: 0 },
      );

    buckets.push({
      hour: rangeLabel,
      orders: rangeOrders.orders,
      revenue: rangeOrders.revenue,
    });
  }

  return buckets;
}

// ---------- Table Statistics ----------

async function getTableStatistics(hotelId, startDate, endDate) {
  const tableFilter = hotelId
    ? { hotelId: new mongoose.Types.ObjectId(hotelId) }
    : {};

  const totalTables = await Table.countDocuments(tableFilter).exec();
  const occupiedTables = await Table.countDocuments({
    ...tableFilter,
    isOccupied: true,
  }).exec();

  const orderFilter = buildOrderFilter({ start: startDate, end: endDate, hotelId });

  const turnoverData = await Order.aggregate([
    { $match: { ...orderFilter, status: { $in: ['Delivered', 'Completed', 'Ready'] } } },
    {
      $group: {
        _id: '$tableId',
        orderCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        avgTurnover: { $avg: '$orderCount' },
      },
    },
  ]).exec();

  const avgTurnover = turnoverData[0]?.avgTurnover || 0;
  const occupancyRate =
    totalTables > 0 ? Number(((occupiedTables / totalTables) * 100).toFixed(1)) : 0;

  const peakHoursAgg = await Order.aggregate([
    { $match: orderFilter },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { orderCount: -1 } },
    { $limit: 2 },
  ]).exec();

  const peakHours =
    peakHoursAgg.length > 0
      ? peakHoursAgg.map((p) => {
          const h = p._id;
          const endH = h + 2;
          const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
          return `${pad(h)}:00-${pad(endH)}:00`;
        })
      : ['12:00-14:00', '19:00-21:00'];

  return {
    totalTables,
    occupancyRate,
    avgTurnover: Number(avgTurnover.toFixed(1)),
    peakHours,
  };
}

// ---------- Category Performance ----------

async function getCategoryPerformance(baseQuery) {
  const pipeline = [
    { $match: baseQuery },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'menuitems',
        localField: 'items.menuItem',
        foreignField: '_id',
        as: 'menuItem',
      },
    },
    {
      $unwind: {
        path: '$menuItem',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$menuItem.category',
        revenue: {
          $sum: {
            $multiply: [{ $ifNull: ['$items.price', 0] }, '$items.quantity'],
          },
        },
        orders: { $sum: '$items.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $project: {
        _id: 0,
        category: { $ifNull: ['$_id', 'Uncategorized'] },
        revenue: { $round: ['$revenue', 0] },
        orders: 1,
      },
    },
  ];

  return Order.aggregate(pipeline).exec();
}

// ---------- Previous Period Revenue ----------

async function getPreviousPeriodRevenue(startDate, endDate, hotelId) {
  const periodLength = endDate - startDate;
  const previousStart = new Date(startDate.getTime() - periodLength);
  const previousEnd = new Date(startDate);

  const base = buildOrderFilter({
    start: previousStart,
    end: previousEnd,
    hotelId,
  });

  const result = await Order.aggregate([
    { $match: base },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
      },
    },
  ]).exec();

  return result[0]?.total || 0;
}

// ---------- Daily Summary Endpoint ----------

export const getDailySummary = async (req, res, next) => {
  try {
    const { date, hotelId } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const baseQuery = buildOrderFilter({
      start: startOfDay,
      end: endOfDay,
      hotelId,
    });

    const [summary] = await Order.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' },
          completedOrders: {
            $sum: {
              $cond: [{ $in: ['$status', ['Completed', 'Delivered']] }, 1, 0],
            },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] },
          },
        },
      },
    ]).exec();

    res.json({
      success: true,
      data:
        summary || {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          completedOrders: 0,
          cancelledOrders: 0,
        },
    });
  } catch (error) {
    next(error);
  }
};

// ---------- Peak Hours Endpoint ----------

export const getPeakHours = async (req, res, next) => {
  try {
    const { startDate, endDate, hotelId } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setDate(new Date().getDate() - 7));
    const end = endDate ? new Date(endDate) : new Date();

    const baseQuery = buildOrderFilter({ start, end, hotelId });

    const pipeline = [
      { $match: baseQuery },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          orders: 1,
          revenue: { $round: ['$revenue', 0] },
        },
      },
    ];

    const peakHours = await Order.aggregate(pipeline).exec();

    res.json({
      success: true,
      data: peakHours,
    });
  } catch (error) {
    next(error);
  }
};
