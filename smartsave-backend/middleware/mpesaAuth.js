const axios = require('axios');
const mpesaConfig = require('../config/mpesa');

const generateToken = async (req, res, next) => {
  const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(mpesaConfig.tokenUrl, {
      headers: { Authorization: `Basic ${auth}` }
    });
    req.token = response.data.access_token;
    next();
  } catch (error) {
    console.error('M-Pesa Token Error:', error.response?.data || error.message);
    res.status(500).json({ msg: 'Failed to generate M-Pesa token' });
  }
};

module.exports = generateToken;