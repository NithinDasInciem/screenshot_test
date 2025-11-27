import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    permission_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    
    isDeleted: { type: Boolean, default: false }, // Soft delete field
  },
  {
    timestamps: true,
  }
);

// To ensure that each permission is unique based on its permission_name
permissionSchema.index({ permission_name: 1 }, { unique: true });

export default permissionSchema;
