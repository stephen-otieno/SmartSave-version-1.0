const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use Google App Password here
  }
});

// const transporter = nodemailer.createTransport({
//   host: "142.251.10.108", // Direct IP for smtp.gmail.com
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     // This is mandatory when using a direct IP because the 
//     // certificate is issued to 'smtp.gmail.com', not the IP.
//     rejectUnauthorized: false, 
//     servername: 'smtp.gmail.com' 
//   }
// });
module.exports = transporter;