import mongoose from 'mongoose';

const ThemeItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  creator: { type: String, default: 'Original' },
  items: [ThemeItemSchema],
}, {
  timestamps: true,
  collection: 'themes'
});

export const Theme = mongoose.model('Theme', themeSchema);
