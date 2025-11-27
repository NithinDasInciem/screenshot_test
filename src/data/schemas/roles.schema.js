import mongoose from 'mongoose';

const rolesSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true, // Ensures role names are unique
    },
    description: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    defaultRole: {
      type: Boolean,
      default: false,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      //  required : true
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete field
  },
  {
    timestamps: true,
  }
);

export default rolesSchema;
