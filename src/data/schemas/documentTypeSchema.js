// models/DocumentType.js
import mongoose from "mongoose";

export const documentTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    allowMultiple: { type: Boolean, default: false }
  },
  { timestamps: true }
);


