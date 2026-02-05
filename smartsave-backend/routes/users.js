// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { addTarget } = require('../controllers/userController');

// @route    POST api/users/targets
router.post('/targets', auth, addTarget);

// @route    POST api/users/update-rules
router.post('/update-rules', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Update the savings rules array
        user.savingsRules = req.body.savingsRules;
        await user.save();
        
        res.json({ msg: "Rules updated successfully", rules: user.savingsRules });
    } catch (err) {
        console.error("Update Rules Error:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router; 