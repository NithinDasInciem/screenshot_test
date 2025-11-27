import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema(
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
    iso3: {
      type: String,
      required: true,
      length: 3,
      uppercase: true,
    },
    iso2: {
      type: String,
      required: true,
      length: 2,
      uppercase: true,
    },
    numeric_code: {
      type: String,
      required: true,
    },
    phonecode: {
      type: String,
      required: true,
    },
    capital: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    currency_name: {
      type: String,
      required: true,
    },
    currency_symbol: {
      type: String,
      required: true,
    },
    tld: {
      type: String,
      required: true,
    },
    native: {
      type: String,
      required: true,
    },
    region: {
      $ref: {
        type: String,
        default: 'regions',
      },
      $id: {
        type: Number,
        required: true,
      },
    },
    region_id: {
      type: Number,
      required: true,
    },
    subregion: {
      $ref: {
        type: String,
        default: 'subregions',
      },
      $id: {
        type: Number,
        required: true,
      },
    },
    subregion_id: {
      type: Number,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    timezones: [
      {
        zoneName: String,
        gmtOffset: Number,
        gmtOffsetName: String,
        abbreviation: String,
        tzName: String,
      },
    ],
    translations: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    emojiU: {
      type: String,
      required: true,
    },
  },
  {
    _id: false, // Disable automatic _id generation since we're using custom _id
    timestamps: true,
    collection: 'countries',
  }
);

// Create indexes for better performance
CountrySchema.index({ name: 1 });
CountrySchema.index({ iso2: 1 });
CountrySchema.index({ iso3: 1 });

export default CountrySchema;
