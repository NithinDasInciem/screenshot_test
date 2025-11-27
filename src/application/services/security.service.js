import * as securityRepository from '../../data/repositories/securitySetting.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Retrieves the current security settings.
 * It will create and return default settings if none exist.
 * @returns {Promise<object>} The security settings document.
 */
export const getSecuritySettings = async () => {
  const settings = await securityRepository.getSettings();
  if (!settings) {
    // This case is handled by getSettings which creates a default if none exists,
    // but this check is for robustness.
    throw new ApiError(404, 'Security settings could not be found or created.');
  }
  return settings;
};

/**
 * Updates or creates (upserts) the application's security settings.
 * @param {object} settingsData - The data to update.
 * @param {number} [settingsData.maxLoginAttempts] - Max failed login attempts before lockout.
 * @param {number} [settingsData.lockTimeMinutes] - Lockout duration in minutes.
 * @param {boolean} [settingsData.accountLockingEnabled] - Flag to enable/disable the account locking feature.
 * @returns {Promise<object>} The updated security settings document.
 */
export const upsertSecuritySettings = async settingsData => {
  const updatePayload = {};

  // Validate and build the payload to prevent unwanted fields from being saved.
  if (settingsData.maxLoginAttempts !== undefined) {
    updatePayload.maxLoginAttempts = settingsData.maxLoginAttempts;
  }
  if (settingsData.lockTimeMinutes !== undefined) {
    updatePayload.lockTimeMinutes = settingsData.lockTimeMinutes;
  }
  if (settingsData.accountLockingEnabled !== undefined) {
    updatePayload.accountLockingEnabled = settingsData.accountLockingEnabled;
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, 'No valid settings data provided for update.');
  }

  // The repository's updateSettings function already performs an upsert.
  const updatedSettings = await securityRepository.updateSettings(updatePayload);
  return updatedSettings;
};
