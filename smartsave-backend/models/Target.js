const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: { 
    type: String, 
    enum: ['general', 'specific'], 
    default: 'general' 
  },
  title: { 
    type: String, 
    required: function() { return this.type === 'specific'; } 
  },
  targetAmount: { 
    type: Number, 
    required: true 
  },
  currentAmount: { 
    type: Number, 
    default: 0 
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'failed'], 
    default: 'active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Target', TargetSchema);