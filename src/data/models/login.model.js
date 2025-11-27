import mongoose from 'mongoose';
import LoginSchema from '../schemas/login.schema.js';
const LoginModel = mongoose.model('logins', LoginSchema); // Use the imported schema
export default LoginModel;
