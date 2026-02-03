const transporter = require('../config/mailer');

const sendSavingsEmail = async (userEmail, userName, amount, targetName) => {
  const date = new Date().toLocaleDateString('en-KE'); // Kenyan date format
  const time = new Date().toLocaleTimeString('en-KE');

  const mailOptions = {
    from: `"SmartSave 💰" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Deposit Confirmed: KES ${amount} Saved!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px;">
        <h2 style="color: #49b248;">Hello, ${userName}!</h2>
        <p>Your deposit was successful. You are one step closer to your goal!</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 15px; margin: 20px 0;">
          <p><strong>Amount:</strong> KES ${amount}</p>
          <p><strong>Goal:</strong> ${targetName || 'General Savings'}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>

        <p style="color: #64748b; font-size: 14px;">Keep up the consistent saving tendency to reach your target on time!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Personalized savings email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
  }
};

module.exports = sendSavingsEmail;