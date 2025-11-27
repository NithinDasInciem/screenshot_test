import mongoose from 'mongoose';

const securitySettingSchema = new mongoose.Schema(
  {
    maxLoginAttempts: {
      type: Number,
      required: true,
      default: 3,
      min: 1,
      description:
        'Maximum number of failed login attempts before locking an account.',
    },
    lockTimeMinutes: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      description: 'Duration in minutes for which an account is locked.',
    },
    accountLockingEnabled: {
      type: Boolean,
      required: true,
      default: true,
      description: 'Flag to enable or disable the account locking feature.',
    },
  },
  { timestamps: true }
);

export default securitySettingSchema;
