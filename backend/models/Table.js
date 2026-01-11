import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  qrCodeValue: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    default: 4
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
   state: { 
    type: String, 
    enum: ['available', 'occupied', 'cooking', 'ready', 'reserved'], 
    default: 'available' 
  },
 
}, {
  timestamps: true
});

export default mongoose.model('Table', tableSchema);
