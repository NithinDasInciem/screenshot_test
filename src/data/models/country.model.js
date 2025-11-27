import mongoose from 'mongoose';
import CountrySchema from '../schemas/country.schema.js';

const CountryModel = mongoose.model('countries', CountrySchema);

export default CountryModel;
