import mongoose from 'mongoose';
import securitySettingSchema from '../schemas/securitySetting.schema.js';

const SecuritySettingModel = mongoose.model(
  'SecuritySetting',
  securitySettingSchema
);

export default SecuritySettingModel;
