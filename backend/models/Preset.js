// models/Preset.js
import mongoose from "mongoose";

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      specialPrice: {
        type: Number,
      },
      badge: {
        type: String, // "25% OFF!", "BUY 1 GET 1"
      },
      description: {
        type: String, // Custom description for this item in preset
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  tag: {
    type: String, // "TodaysSpecial", "Combo", "SpecialOffers"
    required: true,
  },
  date: {
    type: Date,
  },
}, { timestamps: true });

// ✅ Compound unique index: name must be unique per hotel
presetSchema.index({ name: 1, hotel: 1 }, { unique: true });

export default mongoose.model("Preset", presetSchema);
