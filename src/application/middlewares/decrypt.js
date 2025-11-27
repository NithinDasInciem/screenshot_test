import CryptoJS from 'crypto-js';
import ApiError from '../utils/ApiError.js';
import dotenv from 'dotenv';

dotenv.config();

const decryptionKey = process.env.ENCRYPTION_KEY;

export const decryptRequestBody = (req, res, next) => {
  if (!decryptionKey) {
    console.error(
      'ENCRYPTION_KEY is not set in .env file. Skipping all decryption.'
    );
    return next();
  }

  // Decrypt request body if payload exists
  if (req.body && req.body.payload) {
    try {
      const bytes = CryptoJS.AES.decrypt(req.body.payload, decryptionKey);
      const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedDataString) {
        throw new ApiError(400, 'Invalid request body. Decryption failed.');
      }

      req.body = JSON.parse(decryptedDataString);
    } catch (error) {
      return next(
        new ApiError(400, 'Failed to decrypt or parse request body.')
      );
    }
  }

  // Decrypt query parameters if payload exists
  if (req.query && req.query.payload) {
    try {
      const bytes = CryptoJS.AES.decrypt(req.query.payload, decryptionKey);
      const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedDataString) {
        throw new ApiError(400, 'Invalid query parameters. Decryption failed.');
      }

      req.query = JSON.parse(decryptedDataString);
    } catch (error) {
      return next(
        new ApiError(400, 'Failed to decrypt or parse query parameters.')
      );
    }
  }

  next();
};