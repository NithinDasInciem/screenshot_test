import mongoose from 'mongoose';

// Define the Counter Schema
const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }, // Soft delete field for consistency
});

// Export the schema
export default counterSchema;
