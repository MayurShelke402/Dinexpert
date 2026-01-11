// orderController.js
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import { io } from "../index.js";

// Update order status and table state accordingly
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.menuItem").populate("tableId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update table state based on order status
    if (order.tableId) {
      let tableUpdate = {};
      
      switch (status) {
        case 'Pending':
          tableUpdate = {
            isOccupied: true,
            state: 'occupied'
          };
          break;
          
        case 'Cooking':
          tableUpdate = {
            isOccupied: true,
            state: 'cooking'
          };
          break;
          
        case 'Ready':
          tableUpdate = {
            isOccupied: true,
            state: 'ready'  
          };
          break;
          
        case 'Completed':
            const activeOrders = await Order.find({
            tableId: order.tableId._id,
            status: { $nin: ['Completed', 'Cancelled'] },
            _id: { $ne: order._id } // Exclude current order
          });
          
          if (activeOrders.length === 0) {
            // No other active orders, free the table
            tableUpdate = {
              isOccupied: false,
              state: 'available'
            };
          } else {
            // Table still has active orders, keep it occupied
            tableUpdate = {
              isOccupied: true,
              state: 'occupied'
            };
          }
          break;
          
        case 'Cancelled':
          // Same logic as completed
          const activeOrdersCancelled = await Order.find({
            tableId: order.tableId._id,
            status: { $nin: ['Completed', 'Cancelled'] },
            _id: { $ne: order._id }
          });
          
          if (activeOrdersCancelled.length === 0) {
            tableUpdate = {
              isOccupied: false,
              state: 'available'
            };
          } else {
            tableUpdate = {
              isOccupied: true,
              state: 'occupied'
            };
          }
          break;
          
        default:
          // Default to occupied for unknown statuses
          tableUpdate = {
            isOccupied: true,
            state: 'occupied'
          };
      }

      // Update the table
      const updatedTable = await Table.findByIdAndUpdate(
        order.tableId._id,
        tableUpdate,
        { new: true }
      );

      console.log(`📊 Table ${updatedTable.number} updated to: ${updatedTable.state} (occupied: ${updatedTable.isOccupied})`);

      // Emit table update event
      io.emit("table.updated", updatedTable);
    }

    // Emit order update event
    io.emit("order.updated", order);

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new order - also update table status

export const createOrder = async (req, res) => {
  try {
    const { hotelId, userId, tableId, items, notes } = req.body;

    // ✅ IMPORTANT: Populate price and name from MenuItem
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItem);
        
        if (!menuItem) {
          throw new Error(`Menu item ${item.menuItem} not found`);
        }

        return {
          menuItem: item.menuItem,
          name: menuItem.name,        // ✅ Store name
          price: menuItem.price,      // ✅ Store price at time of order
          quantity: item.quantity || 1
        };
      })
    );

    // Calculate total
    const total = populatedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order with populated data
    const order = new Order({
      hotelId,
      userId,
      tableId,
      items: populatedItems,
      total,
      notes
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Order - also free table if needed
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if table should be freed
    if (order.tableId) {
      const activeOrders = await Order.find({
        tableId: order.tableId,
        status: { $nin: ['Completed', 'Cancelled'] }
      });

      if (activeOrders.length === 0) {
        // No active orders left, free the table
        const updatedTable = await Table.findByIdAndUpdate(
          order.tableId,
          { 
            isOccupied: false,
            state: 'available'
          },
          { new: true }
        );
        
        // Emit table update
        io.emit("table.updated", updatedTable);
        
        console.log(`📊 Table freed: ${updatedTable.number}`);
      }
    }

    res.json({ success: true, message: 'Order deleted and table status updated' });
  } catch (err) {
    console.error("Error deleting order:", error);
    next(err);
  }
};




// Get All Orders with Pagination + Filters
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, tableId } = req.query;

    const query = {};

    // 🔹 Only today's orders
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    query.createdAt = { $gte: startOfDay, $lte: endOfDay };

    // optional filters
    if (status) query.status = status;
    if (tableId) query.table = tableId; // or tableId: tableId if that’s the field

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('tableId')
        .populate('items.menuItem')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// Get Order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tableId')
      .populate('items.menuItem')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Get all orders for a specific hotel with filters and pagination
export const getOrdersByHotel = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, tableId, hotelId } = req.query;

    // Build query object
    const query = {};
    
    // Only add hotelId filter if provided (make it optional for now)
    if (hotelId) query.hotel = hotelId;
    if (status) query.status = status;
    if (tableId) query.table = tableId;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('tableId')
        .populate('items.menuItem')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// Update Order Status


// Delete Order

