import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // creating through the function prefix+code+increment
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`,
      },
    },

    password: {
      type: String,
      required: true,
      // minlength: 8
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    passwordResetRequired: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      default: null,
    },
    mfaEnabled: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    isInvite: {
      type: Boolean,
      default: false,
    },
    permissionsUpdatedAt: {
      type: Date,
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
    sessionExpiresAt: {
      type: Date,
      default: null,
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete field
  },
  {
    timestamps: true,
  }
);

export default LoginSchema;
