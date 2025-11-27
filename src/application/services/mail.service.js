import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../utils/mailerService.js';
import ApiError from '../utils/ApiError.js';

/**
 * Sends a generic email based on provided data.
 * @param {object} emailData - The email data.
 * @param {string} emailData.to - Recipient email address.
 * @param {string} emailData.subject - Email subject.
 * @param {string} [emailData.text] - Plain text content.
 * @param {string} [emailData.html] - HTML content.
 * @param {Array} [emailData.attachments] - Array of attachment objects.
 * @returns {Promise<{messageId: string}>} An object containing the messageId of the sent email.
 */
export const sendGenericEmail = async ({ to, subject, text, html, attachments }) => {
  if (!to || !subject || (!text && !html)) {
    throw new ApiError(400, 'Recipient (to), subject, and content (text or html) are required.');
  }

  // Delegate the actual email sending to the lower-level mailerService
  const info = await sendEmail({ to, subject, text, html, attachments });

  return { messageId: info?.messageId };
};

/**
 * Sends a welcome email to a new user.
 * @param {object} welcomeData - The welcome email data.
 * @param {string} welcomeData.email - Recipient's email address.
 * @param {string} welcomeData.name - Recipient's name.
 * @returns {Promise<string>} A success message.
 */
export const sendWelcome = async ({ email, name }) => {
  if (!email || !name) {
    throw new ApiError(400, 'Email and name are required for the welcome email.');
  }

  // Delegate to the lower-level mailer utility
  await sendWelcomeEmail(email, name);

  return 'Welcome email sent successfully';
};

/**
 * Sends a password reset email to a user.
 * @param {object} resetData - The password reset data.
 * @param {string} resetData.email - Recipient's email address.
 * @param {string} resetData.resetToken - The password reset token.
 * @returns {Promise<string>} A success message.
 */
export const sendPasswordReset = async ({ email, resetToken }) => {
  if (!email || !resetToken) {
    throw new ApiError(400, 'Email and resetToken are required for the password reset email.');
  }

  // Delegate to the lower-level mailer utility
  await sendPasswordResetEmail(email, resetToken);

  return 'Password reset email sent successfully';
};
