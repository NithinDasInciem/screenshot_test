import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    f_name: {
      type: String,
      // required: true
    },
    l_name: {
      type: String,
      // required: true
    },
    profile_img: {
      type: String,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      // required: true
    },
    password: {
      type: String,
      // required: true,
      minlength: 8,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'roles', // Ensure this matches the model name in your roles schema
    },
    status: {
      type: String,
      enum: ['pending', 'requested', 'active'],
      default: 'requested',
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      // required: true
    },
    city: {
      type: String,
      // required: true
    },
    state: {
      type: String,
      // required: true
    },
    zip_code: {
      type: String,
      // required: true
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete field
  },
  {
    timestamps: true,
  }
);

export default UserSchema;
