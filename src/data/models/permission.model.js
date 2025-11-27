import mongoose from 'mongoose';
import permissionSchema from '../schemas/permission.schema.js';
const permissionModel = mongoose.model('permissions', permissionSchema); // Use the imported schema
export default permissionModel;
