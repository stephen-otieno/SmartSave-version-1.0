const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addTarget } = require('../controllers/userController');

// @route   POST api/users/targets
// @desc    Add a new savings target
// @access  Private
router.post('/targets', auth, addTarget);

module.exports = router;