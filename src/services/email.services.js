import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config() 
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, 
      to, 
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {

  const subject = 'Welcome to Backend Ledger! 🚀';

  // Plain text version (for clients that block HTML)
  const text = `Hello ${name},

Welcome to Backend Ledger! We are thrilled to have you on board.

Your account has been successfully created. You can now start managing your ledgers securely and efficiently.

If you have any questions, feel free to reply to this email.

Best regards,
The Backend Ledger Team`;

  // HTML version with styling
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header h1 { color: #333333; margin: 0; font-size: 24px; }
    .content { padding: 20px 0; color: #555555; line-height: 1.6; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Backend Ledger</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Welcome to <strong>Backend Ledger</strong>! We're excited to help you streamline your banking and ledger management.</p>
      <p>Your account is all set up. You can now access our secure platform to track transactions and manage your data.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Backend Ledger. All rights reserved.</p>
      <p>From the Developer Side , Tech City</p>
    </div>
  </div>
</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}

// Improved success email
async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = '✅ Transaction Successful';

  const text = `Hello ${name},

Your transaction was completed successfully.

Details:
- Amount: $${amount}
- To account: ${toAccount}
- Status: Successful

You can log in to Backend Ledger anytime to review your full transaction history.

Best regards,
The Backend Ledger Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header h1 { color: #28a745; margin: 0; font-size: 24px; }
    .content { padding: 20px 0; color: #555555; line-height: 1.6; }
    .summary { background-color: #f8fff9; border: 1px solid #d4edda; border-radius: 6px; padding: 12px 16px; margin-top: 10px; }
    .summary p { margin: 4px 0; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Transaction Successful</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your transaction has been processed successfully. Below are the details:</p>
      <div class="summary">
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>To account:</strong> ${toAccount}</p>
        <p><strong>Status:</strong> Successful</p>
      </div>
      <p>You can log in to <strong>Backend Ledger</strong> at any time to review this and all your previous transactions.</p>
      <p>If you did not authorize this transaction, please review your account activity immediately.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Backend Ledger. All rights reserved.</p>
      <p>From the Developer Side , Tech City</p>
    </div>
  </div>
</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}

// Improved failure email
async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = '⚠️ Transaction Failed';

  const text = `Hello ${name},

We were unable to complete your transaction.

Details:
- Amount: $${amount}
- To account: ${toAccount}
- Status: Failed

No funds have been moved for this transaction. You can try again later or verify your account details.

If this was not initiated by you, please check your account activity.

Best regards,
The Backend Ledger Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header h1 { color: #dc3545; margin: 0; font-size: 24px; }
    .content { padding: 20px 0; color: #555555; line-height: 1.6; }
    .summary { background-color: #fff8f8; border: 1px solid #f5c6cb; border-radius: 6px; padding: 12px 16px; margin-top: 10px; }
    .summary p { margin: 4px 0; }
    .note { margin-top: 12px; color: #777777; font-size: 14px; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Transaction Failed</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>We were unable to process the transaction you attempted. Here are the details we have on record:</p>
      <div class="summary">
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>To account:</strong> ${toAccount}</p>
        <p><strong>Status:</strong> Failed</p>
      </div>
      <p class="note">
        No funds have been debited from your account for this failed transaction. 
        You can try again later or verify that all account details and available balance are correct.
      </p>
      <p>If you do not recognize this activity, please log in to <strong>Backend Ledger</strong> and review your recent transactions.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Backend Ledger. All rights reserved.</p>
      <p>From the Developer Side , Tech City</p>
    </div>
  </div>
</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}

export default { sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail };