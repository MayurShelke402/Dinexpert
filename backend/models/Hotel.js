import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      default: '',
    },
    logo: {
      type: String, // store filename or URL (e.g. /uploads/hotels/logo.png)
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// === Virtuals ===

// 1. Hotel → MenuItems
hotelSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'hotel',
});

// 2. Hotel → Tables
hotelSchema.virtual('tables', {
  ref: 'Table',
  localField: '_id',
  foreignField: 'hotel',
});

export default mongoose.model('Hotel', hotelSchema);
