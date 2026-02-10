const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Target = require('../models/Target'); // Import Target model for allocation
const sendSavingsEmail = require('../utils/sendSavingsEmail');
const mongoose = require('mongoose');

const initiateSTKPush = async (req, res) => {
    const { phone, amount } = req.body;
    const token = req.token;
    const userId = req.user.id;

    // Format phone to 2547XXXXXXXX
    const formattedPhone = phone.startsWith('0') ? '254' + phone.slice(1) : phone;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const shortCode = "174379";
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const stkData = {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: "174379",
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BASE_URL}/api/transactions/callback`,
        AccountReference: userId,
        TransactionDesc: "Savings Deposit",
    };

    try {
        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            stkData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.ResponseCode === "0") {
            await User.findByIdAndUpdate(userId, {
                tempMerchantID: response.data.MerchantRequestID
            });
        }

        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ msg: "STK Push Failed" });
    }
};

const mpesaCallback = async (req, res) => {
    const { Body } = req.body;
    const { ResultCode, MerchantRequestID } = Body.stkCallback;

    if (ResultCode === 0) {
        try {
            const user = await User.findOne({ tempMerchantID: MerchantRequestID });

            if (!user) {
                console.error("No user found for MerchantID:", MerchantRequestID);
                return res.json({ msg: "User mapping failed" });
            }

            const amount = Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === "Amount").Value;
            const receipt = Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === "MpesaReceiptNumber").Value;

            // 1. Update User Main Balance
            user.savingsBalance = (user.savingsBalance || 0) + Number(amount);
            user.tempMerchantID = null;
            await user.save();

            // --- ALLOCATION LOGIC ---
            // Define a variable to hold the name of the goal for the email
            let goalName = 'General Savings';

            if (user.savingsRules && user.savingsRules.length > 0) {
                // Percentage Split Path
                for (const rule of user.savingsRules) {
                    const share = (Number(amount) * (rule.percentage / 100));
                    await Target.findByIdAndUpdate(rule.targetId, {
                        $inc: { currentAmount: share }
                    });
                }
                goalName = "Multiple Goals (Split)"; // Optional: Change if rules exist
            } else {
                // Fallback Path: 100% to latest target
                const activeTarget = await Target.findOne({
                    user: user._id,
                    status: 'active'
                }).sort({ createdAt: -1 });

                if (activeTarget) {
                    activeTarget.currentAmount += Number(amount);
                    await activeTarget.save();
                    goalName = activeTarget.title; // Assign the title here
                }
            }

            // 3. Save Transaction Record
            await new Transaction({
                user: new mongoose.Types.ObjectId(user._id),
                amount: Number(amount),
                mpesaReceiptNumber: receipt,
                date: new Date()
            }).save();

            // 4. Trigger Email (Now uses the goalName variable defined above)
            if (user.email) {
                await sendSavingsEmail(
                    user.email,
                    user.name.split(' ')[0],
                    amount,
                    goalName
                );
            }

            console.log(`✅ Success! KES ${amount} added to ${user.name}`);
        } catch (err) {
            console.error("Callback processing error:", err);
        }
    }
    res.json({ msg: "Received" });
};

const syncExistingBalances = async () => {
    try {
        const usersWithBalance = await User.find({ savingsBalance: { $gt: 0 } });

        for (let user of usersWithBalance) {
            const activeTarget = await Target.findOne({ user: user._id, status: 'active' });

            if (activeTarget && activeTarget.currentAmount === 0) {
                // Set the target amount to match the user's current savings
                activeTarget.currentAmount = user.savingsBalance;
                await activeTarget.save();
                console.log(`✅ Synced KES ${user.savingsBalance} for ${user.name}`);
            }
        }
    } catch (err) {
        console.error("Migration Error:", err.message);
    }
};

module.exports = { initiateSTKPush, mpesaCallback };