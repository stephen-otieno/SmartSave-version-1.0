module.exports = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  passkey: process.env.MPESA_PASSKEY,
  shortcode: process.env.MPESA_SHORTCODE || '174379', // Standard Sandbox Shortcode
  stkPushUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  tokenUrl: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
};