const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1. Create the transporter (The connection to Gmail)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: '"Value Village Thrift" <' + process.env.EMAIL_USER + '>', // Customize your sender name!
      to: options.email,
      subject: options.subject,
      text: options.message, // Plain text version
      html: options.html,    // Optional: HTML version for styled emails
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${options.email}`);
    
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;