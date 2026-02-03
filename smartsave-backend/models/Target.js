const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: { 
    type: String, 
    // Added 'specific' back just in case, and kept the others
    enum: ['general', 'education', 'bills', 'furniture', 'electronic', 'other', 'specific'], 
    default: 'general' 
  },
  title: { 
    type: String, 
    // Changed: Require title for ANY type that isn't 'general'
    required: function() { return this.type !== 'general'; } 
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