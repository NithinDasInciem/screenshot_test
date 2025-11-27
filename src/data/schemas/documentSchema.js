import mongoose from 'mongoose';

export const documentSchema = new mongoose.Schema(
  {
    company_id: {
      type: Number,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentTypes',
    },
    url:{
      type:String
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
  }
);
