// models/Order.js - FIXED VERSION
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem', 
    required: true 
  },
  name: { 
    type: String, 
    required: true  // ✅ ADD: Store item name
  },
  price: { 
    type: Number, 
    required: true  // ✅ ADD: Store item price at time of order
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Table', 
    required: true 
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  total: { 
    type: Number, 
    default: 0 
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ ADD: Auto-calculate total before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate total from items if not already set
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 1));
    }, 0);
  }
  
  next();
});

export default mongoose.model('Order', orderSchema);
