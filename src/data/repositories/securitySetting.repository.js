import SecuritySettingModel from '../models/securitySetting.model.js';

/**
 * Retrieves the security settings.
 * If no settings exist, it creates and returns the default settings.
 * @returns {Promise<Document>} The security settings document.
 */
export const getSettings = async () => {
  let settings = await SecuritySettingModel.findOne();
  if (!settings) {
    settings = await SecuritySettingModel.create({});
  }
  return settings;
};

/**
 * Updates the security settings.
 * @param {object} updateData - The data to update.
 * @returns {Promise<Document>} The updated security settings document.
 */
export const updateSettings = async updateData => {
  return SecuritySettingModel.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true });
};
