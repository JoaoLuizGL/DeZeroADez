import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  data: { type: String, required: true }, // base64 data
}, {
  timestamps: true,
  collection: 'images'
});

export const Image = mongoose.model('Image', imageSchema);
