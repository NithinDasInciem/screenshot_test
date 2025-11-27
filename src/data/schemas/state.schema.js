import mongoose from 'mongoose';

const StateSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country_id: {
      type: Number,
      required: true,
      ref: 'countries',
    },
    country_code: {
      type: String,
      required: true,
      length: 2,
      uppercase: true,
    },
    country_name: {
      type: String,
      required: true,
    },
    iso2: {
      type: String,
      required: true,
      uppercase: true,
    },
    fips_code: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      default: null,
    },
    parent_id: {
      type: Number,
      default: null,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    country: {
      $ref: {
        type: String,
        default: 'countries',
      },
      $id: {
        type: Number,
        required: true,
      },
    },
  },
  {
    _id: false, // Disable automatic _id generation since we're using custom _id
    timestamps: true,
    collection: 'states',
  }
);

// Create indexes for better performance
StateSchema.index({ name: 1 });
StateSchema.index({ country_id: 1 });
StateSchema.index({ country_code: 1 });
StateSchema.index({ iso2: 1 });

export default StateSchema;
