import mongoose from 'mongoose';
import StateSchema from '../schemas/state.schema.js';

const StateModel = mongoose.model('states', StateSchema);

export default StateModel;