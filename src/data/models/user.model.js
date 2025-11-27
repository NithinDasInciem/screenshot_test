import mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema.js';
const UserModel = mongoose.model('users', UserSchema); // Use the imported schema
export default UserModel;
