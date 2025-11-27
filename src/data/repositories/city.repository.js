import CityModel from '../models/city.model.js';
import ApiError from '../../application/utils/ApiError.js';

/**
 * Get cities by state ID with optional filtering and pagination
 * @param {number} stateId - State ID (required)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.search - Search term for city name
 * @param {string} options.sortBy - Field to sort by (default: 'name')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'asc')
 * @returns {Promise<Object>} Cities with pagination info
 */
export const getCitiesByState = async (stateId, options = {}) => {
  try {
    if (!stateId) {
      throw new ApiError(400, 'State ID is required');
    }

    const {
      page = 1,
      limit = 50,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
    } = options;

    // Build query - state_id is required
    const query = { state_id: Number(stateId) };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state_name: { $regex: search, $options: 'i' } },
        { country_name: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [cities, total] = await Promise.all([
      CityModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CityModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      cities,
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
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching cities: ${error.message}`);
  }
};

/**
 * Get cities by country ID with optional filtering and pagination
 * @param {number} countryId - Country ID (required)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.search - Search term for city name
 * @param {string} options.sortBy - Field to sort by (default: 'name')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'asc')
 * @returns {Promise<Object>} Cities with pagination info
 */
export const getCitiesByCountry = async (countryId, options = {}) => {
  try {
    if (!countryId) {
      throw new ApiError(400, 'Country ID is required');
    }

    const {
      page = 1,
      limit = 50,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
    } = options;

    // Build query - country_id is required
    const query = { country_id: Number(countryId) };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state_name: { $regex: search, $options: 'i' } },
        { country_name: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [cities, total] = await Promise.all([
      CityModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CityModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      cities,
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
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching cities: ${error.message}`);
  }
};

/**
 * Get all cities with optional filtering and pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.search - Search term for city name
 * @param {string} options.sortBy - Field to sort by (default: 'name')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'asc')
 * @returns {Promise<Object>} Cities with pagination info
 */
export const getAllCities = async (options = {}) => {
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
        { state_name: { $regex: search, $options: 'i' } },
        { country_name: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [cities, total] = await Promise.all([
      CityModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CityModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      cities,
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
    throw new ApiError(500, `Error fetching cities: ${error.message}`);
  }
};

/**
 * Get city by ID
 * @param {number} id - City ID
 * @returns {Promise<Object>} City data
 */
export const getCityById = async (id) => {
  try {
    const city = await CityModel.findOne({ _id: id }).lean();
    
    if (!city) {
      throw new ApiError(404, `City with ID ${id} not found`);
    }
    
    return city;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching city: ${error.message}`);
  }
};

/**
 * Search cities by name across all states and countries
 * @param {string} searchTerm - Search term
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {number} options.countryId - Optional country filter
 * @param {number} options.stateId - Optional state filter
 * @returns {Promise<Object>} Cities with pagination info
 */
export const searchCities = async (searchTerm, options = {}) => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new ApiError(400, 'Search term is required');
    }

    const {
      page = 1,
      limit = 50,
      countryId = null,
      stateId = null,
    } = options;

    // Build query
    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { state_name: { $regex: searchTerm, $options: 'i' } },
        { country_name: { $regex: searchTerm, $options: 'i' } },
      ]
    };

    // Add optional filters
    if (countryId) {
      query.country_id = Number(countryId);
    }
    if (stateId) {
      query.state_id = Number(stateId);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [cities, total] = await Promise.all([
      CityModel.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CityModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      cities,
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
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error searching cities: ${error.message}`);
  }
};

/**
 * Create a new city
 * @param {Object} cityData - City data
 * @returns {Promise<Object>} Created city
 */
export const createCity = async (cityData) => {
  try {
    const city = new CityModel(cityData);
    const savedCity = await city.save();
    return savedCity.toObject();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'City with this ID already exists');
    }
    throw new ApiError(500, `Error creating city: ${error.message}`);
  }
};

/**
 * Update city by ID
 * @param {number} id - City ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated city
 */
export const updateCityById = async (id, updateData) => {
  try {
    const city = await CityModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!city) {
      throw new ApiError(404, `City with ID ${id} not found`);
    }
    
    return city;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error updating city: ${error.message}`);
  }
};

/**
 * Delete city by ID
 * @param {number} id - City ID
 * @returns {Promise<Object>} Deleted city
 */
export const deleteCityById = async (id) => {
  try {
    const city = await CityModel.findOneAndDelete({ _id: id }).lean();
    
    if (!city) {
      throw new ApiError(404, `City with ID ${id} not found`);
    }
    
    return city;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting city: ${error.message}`);
  }
};