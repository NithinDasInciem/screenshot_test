import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    menu_key: {
      type: String,
      required: true,
      trim: true
    },
    menu_name: {
      type: String,
      required: true,
      trim: true
    },
    route: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'circle'
    },
    is_parent: {
      type: Boolean,
      default: false
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'menus',
      default: null
    },
    order_index: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 1 // 1 = active, 0 = inactive
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    }
  },
  {
    timestamps: true,
  }
);

// Index for better performance
menuSchema.index({ parent_id: 1, order_index: 1 });
menuSchema.index({ is_parent: 1, status: 1 });

export default menuSchema;
