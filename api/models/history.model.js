import mongoose from 'mongoose';

const colorHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  history: {
    type: [
      {
        type: String, // Only HEX format, e.g., "#FFFFFF"
        required: true,
        match: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i, // Validate HEX format
      },
    ],
  },
});

// Pre-save hook to ensure the array length is limited to 5
colorHistorySchema.pre('save', function (next) {
  if (this.history.length > 12) {
    this.history = this.history.slice(0, 12); // Keep only the most recent 5 colors
  }
  next();
});

const ColorHistory = mongoose.model('ColorHistory', colorHistorySchema);

export default ColorHistory;
