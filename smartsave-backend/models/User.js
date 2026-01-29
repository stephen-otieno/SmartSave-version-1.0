const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // For personalized greetings
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mpesaNumber: { type: String, required: true }, // For transaction logic
  savingsBalance: { type: Number, default: 0 }, // For account details view
  tempMerchantID: { type: String },
  targets: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Target' 
  }]
});

module.exports = mongoose.model('User', UserSchema);