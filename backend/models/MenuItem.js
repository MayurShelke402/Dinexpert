import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vegOrNonVeg: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Vegan'],
    required: true
  },
  slug: { type: String, required: true, unique: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  images: [{ type: String }], // array of URLs
  servingSize: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  isAvailable: { type: Boolean, default: true },
  tags: [{ type: String }],
  
  timerequired:{type:String},
}, {
  timestamps: true 
});

export default mongoose.model('MenuItem', menuItemSchema);
