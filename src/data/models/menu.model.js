import mongoose from 'mongoose';
import menuSchema from '../schemas/menu.schema.js';

const menuModel = mongoose.model('menus', menuSchema);
export default menuModel;
