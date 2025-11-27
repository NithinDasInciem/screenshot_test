import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
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
    state_id: {
      type: Number,
      required: true,
      ref: 'states',
    },
    state_code: {
      type: String,
      required: true,
      uppercase: true,
    },
    state_name: {
      type: String,
      required: true,
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
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    wikiDataId: {
      type: String,
      default: null,
    },
    state: {
      $ref: {
        type: String,
        default: 'states',
      },
      $id: {
        type: Number,
        required: true,
      },
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
    collection: 'cities',
  }
);

// Create indexes for better performance
CitySchema.index({ name: 1 });
CitySchema.index({ state_id: 1 });
CitySchema.index({ country_id: 1 });
CitySchema.index({ state_code: 1 });
CitySchema.index({ country_code: 1 });

export default CitySchema;
