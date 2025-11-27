import mongoose from 'mongoose';
import CitySchema from '../schemas/city.schema.js';

const CityModel = mongoose.model('cities', CitySchema);

export default CityModel;