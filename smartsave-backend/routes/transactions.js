const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateToken } = require('../middleware/generateToken');
const { initiateSTKPush, mpesaCallback } = require('../controllers/mpesaController');
const Transaction = require('../models/Transaction');

router.post('/stkpush', auth, generateToken, initiateSTKPush);
router.post('/callback', mpesaCallback);

router.get('/history', auth, async (req, res) => {
    try {
        // Log to confirm the route is being hit
        // console.log("Fetching history for User ID:", req.user.id);

        // Convert string ID to ObjectId to ensure MongoDB matches correctly
        const queryId = new mongoose.Types.ObjectId(req.user.id);

        const transactions = await Transaction.find({ user: queryId })
            .sort({ date: -1 })
            .limit(10);

        // console.log(`Successfully found ${transactions.length} transactions.`);
        res.json(transactions);
    } catch (err) {
        console.error("History fetch error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;