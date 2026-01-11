import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  icon: String,
  image: String,
  description: String,
  order: {
    type: Number,
    default: 0,
    unique: true,
    required: true // lower number appears first
  }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
