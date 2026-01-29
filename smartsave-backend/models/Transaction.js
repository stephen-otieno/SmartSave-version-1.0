const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, // MUST be this
        ref: 'User', 
        required: true 
    },
    amount: Number,
    mpesaReceiptNumber: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);