const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Target = require('../models/Target');
const User = require('../models/User');
// Import your Target model

// @route   POST api/targets
// @desc    Create a new savings target
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, targetAmount, deadline } = req.body;

    // 1. Create the target
    const newTarget = new Target({
      user: req.user.id,
      type: type || 'general',
      title: title || (type !== 'general' ? type : 'Savings Goal'),
      targetAmount: Number(targetAmount),
      deadline: deadline
    });

    const savedTarget = await newTarget.save();

    // 2. Update User (Wrap in try/catch to see if THIS is the part failing)
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { targets: savedTarget._id }
      });
    } catch (userUpdateError) {
      console.error("User Update Failed:", userUpdateError.message);
      // We don't necessarily want to crash the whole request if only the link fails
    }

    res.status(201).json(savedTarget);

  } catch (err) {
    console.error("❌ TARGET SAVE CRASH:", err.message);
    // Sending JSON so frontend doesn't throw "Unexpected token S"
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});
// @route   GET api/targets
// @desc    Get all targets for the logged in user
router.get('/', auth, async (req, res) => {
  try {
    const targets = await Target.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(targets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;