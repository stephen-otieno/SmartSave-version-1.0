const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Target = require('../models/Target');

// @route   POST /api/targets
// @desc    Create a new savings target
router.post('/', auth, async (req, res) => {
  const { type, title, targetAmount, deadline } = req.body;

  try {
    const newTarget = new Target({
      user: req.user.id,
      type,
      title,
      targetAmount,
      deadline
    });

    const target = await newTarget.save();
    res.json(target);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/targets
// @desc    Get all targets for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const targets = await Target.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(targets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;