import CountryModel from '../models/country.model.js';
import ApiError from '../../application/utils/ApiError.js';

/**
 * Get all countries with optional filtering and pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.search - Search term for country name
 * @param {string} options.sortBy - Field to sort by (default: 'name')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'asc')
 * @returns {Promise<Object>} Countries with pagination info
 */
export const getAllCountries = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
    } = options;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { iso2: { $regex: search, $options: 'i' } },
        { iso3: { $regex: search, $options: 'i' } },
        { nationality: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [countries, total] = await Promise.all([
      CountryModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CountryModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      countries,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    throw new ApiError(500, `Error fetching countries: ${error.message}`);
  }
};

/**
 * Get country by ID
 * @param {number} id - Country ID
 * @returns {Promise<Object>} Country data
 */
export const getCountryById = async (id) => {
  try {
    const country = await CountryModel.findOne({ _id: id }).lean();
    
    if (!country) {
      throw new ApiError(404, `Country with ID ${id} not found`);
    }
    
    return country;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching country: ${error.message}`);
  }
};

/**
 * Get country by ISO code (2 or 3 letter)
 * @param {string} isoCode - ISO2 or ISO3 country code
 * @returns {Promise<Object>} Country data
 */
export const getCountryByIsoCode = async (isoCode) => {
  try {
    const query = isoCode.length === 2 
      ? { iso2: isoCode.toUpperCase() } 
      : { iso3: isoCode.toUpperCase() };
    
    const country = await CountryModel.findOne(query).lean();
    
    if (!country) {
      throw new ApiError(404, `Country with ISO code ${isoCode} not found`);
    }
    
    return country;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching country: ${error.message}`);
  }
};

/**
 * Create a new country
 * @param {Object} countryData - Country data
 * @returns {Promise<Object>} Created country
 */
export const createCountry = async (countryData) => {
  try {
    const country = new CountryModel(countryData);
    const savedCountry = await country.save();
    return savedCountry.toObject();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'Country with this ID already exists');
    }
    throw new ApiError(500, `Error creating country: ${error.message}`);
  }
};

/**
 * Update country by ID
 * @param {number} id - Country ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated country
 */
export const updateCountryById = async (id, updateData) => {
  try {
    const country = await CountryModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!country) {
      throw new ApiError(404, `Country with ID ${id} not found`);
    }
    
    return country;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error updating country: ${error.message}`);
  }
};

/**
 * Delete country by ID
 * @param {number} id - Country ID
 * @returns {Promise<Object>} Deleted country
 */
export const deleteCountryById = async (id) => {
  try {
    const country = await CountryModel.findOneAndDelete({ _id: id }).lean();
    
    if (!country) {
      throw new ApiError(404, `Country with ID ${id} not found`);
    }
    
    return country;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting country: ${error.message}`);
  }
};