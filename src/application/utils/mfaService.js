import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

/**
 * Generates a new TOTP secret.
 * @param {string} name - A display name for the authenticator app (e.g., user's email).
 * @returns {{base32: string, otpauth_url: string}}
 */
const generateSecret = name => {
  return speakeasy.generateSecret({
    name: `PY-HRM (${name})`,
  });
};

/**
 * Generates a QR code data URL from an otpauth_url.
 * @param {string} otpauthUrl - The otpauth URL from generateSecret.
 * @returns {Promise<string>} A promise that resolves with the data URL of the QR code.
 */
const generateQrCode = async otpauthUrl => {
  try {
    return await qrcode.toDataURL(otpauthUrl);
  } catch (err) {
    console.error('Error generating QR code', err);
    throw new Error('Could not generate QR code.');
  }
};

/**
 * Verifies a TOTP token provided by the user.
 * @param {string} secret - The user's stored base32 secret.
 * @param {string} token - The 6-digit token from the authenticator app.
 * @returns {boolean} True if the token is valid, false otherwise.
 */
const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2, // Allow for a 60-second window on either side
  });
};

export { generateSecret, generateQrCode, verifyToken };
