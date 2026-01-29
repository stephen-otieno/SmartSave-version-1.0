const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateToken } = require('../middleware/generateToken');
const { initiateSTKPush, mpesaCallback } = require('../controllers/mpesaController');

// ADD THIS LINE - This is why it was returning nothing or crashing
const Transaction = require('../models/Transaction'); 

router.post('/stkpush', auth, generateToken, initiateSTKPush);
router.post('/callback', mpesaCallback);

router.get('/history', auth, async (req, res) => {
    try {
        console.log("Fetching history for User ID:", req.user.id);
        
        // Ensure we find transactions linked to this specific user
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(10);
            
        console.log(`Found ${transactions.length} transactions for user.`);
        res.json(transactions);
    } catch (err) {
        console.error("History Route Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;