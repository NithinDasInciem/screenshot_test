import mongoose from 'mongoose';

const roleMenuPermissions = new mongoose.Schema(
  {
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'menus',
      required: true
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      required: true
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'permissions',
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
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

// Compound index to prevent duplicate menu-role combinations
roleMenuPermissions.index(
  { menu_id: 1, role_id: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Indexes for better performance
roleMenuPermissions.index({ menu_id: 1, isDeleted: 1 });
roleMenuPermissions.index({ role_id: 1, isDeleted: 1 });
roleMenuPermissions.index({ permission_id: 1, isDeleted: 1 });

export default roleMenuPermissions;
