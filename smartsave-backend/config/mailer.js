// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   // Use the direct IP address for Gmail's SMTP to bypass DNS 'ETIMEOUT'
//   host: "142.251.10.108", 
//   port: 587,
//   secure: false, // Must be false for port 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     // This is mandatory when using a direct IP
//     rejectUnauthorized: false, 
//     servername: 'smtp.gmail.com' 
//   }
// });

// // Verification check
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Still Blocked:", error.message);
//   } else {
//     console.log("✅ SUCCESS: Mailer is now connected!");
//   }
// });

// module.exports = transporter;



const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer Connection Error:", error.message);
  } else {
    console.log("✅ Mailer is ready to send Michael's notifications!");
  }
});

module.exports = transporter;



// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS // Use Google App Password here
//   }
// });

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

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Mailer Connection Error:", error);
//   } else {
//     console.log("✅ Mailer is ready to send messages");
//   }
// });

// module.exports = transporter;