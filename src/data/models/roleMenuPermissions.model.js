import mongoose from 'mongoose';
import roleMenuPermissions from '../schemas/roleMenuPermissions.schema.js';

const roleMenuPermissionsModel = mongoose.model(
  'roleMenuPermissions',
  roleMenuPermissions
);
export default roleMenuPermissionsModel;
