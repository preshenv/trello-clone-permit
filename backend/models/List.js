const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }],
  position: {
    type: Number,
    default: 0
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
listSchema.index({ board: 1, position: 1 });

const List = mongoose.model('List', listSchema);

module.exports = List; 