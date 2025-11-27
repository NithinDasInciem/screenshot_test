import mongoose from 'mongoose';
import rolesSchema from '../schemas/roles.schema.js';
const rolesModel = mongoose.model('roles', rolesSchema); // Use the imported schema
export default rolesModel;
