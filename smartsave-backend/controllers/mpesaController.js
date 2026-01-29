const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); 
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
    PartyA: phone, // The source (payer)
    PartyB: "174379",
    PhoneNumber: phone,
    CallBackURL: `${process.env.BASE_URL}/api/transactions/callback`,
    // WE USE THIS TO TAG THE RECEIVER
    AccountReference: userId, 
    TransactionDesc: "Savings Deposit",
  };



 try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // SAVE THE MERCHANT ID TO THE USER
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
            // FIND THE USER TAGGED WITH THIS TRANSACTION
            const user = await User.findOne({ tempMerchantID: MerchantRequestID });

            if (!user) {
                console.error("No user found for MerchantID:", MerchantRequestID);
                return res.json({ msg: "User mapping failed" });
            }

            const amount = Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === "Amount").Value;
            const receipt = Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === "MpesaReceiptNumber").Value;

            // Update balance and clear the temp ID
            user.savingsBalance += Number(amount);
            user.tempMerchantID = null; 
            await user.save();

            // Save Transaction record
            await new Transaction({
                user: user._id,
                amount,
                mpesaReceiptNumber: receipt
            }).save();

            console.log(`✅ Success! KES ${amount} added to ${user.name}`);
        } catch (err) {
            console.error("Callback processing error:", err);
        }
    }
    res.json({ msg: "Received" });
};

module.exports = { initiateSTKPush, mpesaCallback };

