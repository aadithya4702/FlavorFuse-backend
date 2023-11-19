const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Function to send OTP via email
const sendOtpEmail = async (userEmail, otp, username) => {
  // Create a transporter using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mailer_email,
      pass: process.env.mailer_pass,
    },
  });

  // Email template
  const mailOptions = {
    from: process.env.mailer_email,
    to: userEmail,
    subject: "E-mail Verification",
    html: `
      <p>Dear ${username},</p>
      <p>Your OTP for verification is: <code>${otp}</code></p>
      <p>This OTP is valid for a short period. Do not share it with anyone.</p>
      <p>Regards,<br/>FlavorFuse</p>
    `,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    return otp; // Return the OTP for verification on the server
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendOtpEmail;
