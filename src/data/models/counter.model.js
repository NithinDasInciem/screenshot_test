import mongoose from 'mongoose';
import CounterSchema from '../schemas/counter.schema.js'; // Adjust the path as needed

// Create the Counter model
const Counter = mongoose.model('counters', CounterSchema);

export default Counter;
