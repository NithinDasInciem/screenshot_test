import { transporter } from '../../config/mail.js';
import logger from './logger.js';

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content (optional)
 * @param {Array} [options.attachments] - Attachments array (optional)
 * @returns {Promise} - Resolves with sending info
 */
export const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', { messageId: info.messageId, to });
    return info;
  } catch (error) {
    logger.error('Error sending email', { error: error.message, to });
    throw error;
  }
};

/**
 * Send a welcome email to new users
 * @param {string} email - User's email address
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Our Platform!';
  const text = `Hello ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`;
  const html = `
    <h2>Welcome to Our Platform!</h2>
    <p>Hello ${name},</p>
    <p>Welcome to our platform! We're excited to have you on board.</p>
    <br>
    <p>Best regards,</p>
    <p>The Team</p>
  `;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send a password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `Hello,\n\nYou requested a password reset. Please click the following link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Team`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested a password reset. Please click the following link to reset your password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
    <br>
    <p>Best regards,</p>
    <p>The Team</p>
  `;

  await sendEmail({ to: email, subject, text, html });
};
