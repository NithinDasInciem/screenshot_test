import StateModel from '../models/state.model.js';
import ApiError from '../../application/utils/ApiError.js';

/**
 * Get states by country ID with optional filtering and pagination
 * @param {number} countryId - Country ID (required)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.search - Search term for state name
 * @param {string} options.sortBy - Field to sort by (default: 'name')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'asc')
 * @returns {Promise<Object>} States with pagination info
 */
export const getStatesByCountry = async (countryId, options = {}) => {
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
        { iso2: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [states, total] = await Promise.all([
      StateModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      StateModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      states,
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
    throw new ApiError(500, `Error fetching states: ${error.message}`);
  }
};

/**
 * Get all states with optional filtering and pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @param {string} options.search - Search term for state name
 * @param {string} options.sortBy - Field to sort by (default: 'name')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'asc')
 * @returns {Promise<Object>} States with pagination info
 */
export const getAllStates = async (options = {}) => {
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
        { country_name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [states, total] = await Promise.all([
      StateModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      StateModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      states,
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
    throw new ApiError(500, `Error fetching states: ${error.message}`);
  }
};

/**
 * Get state by ID
 * @param {number} id - State ID
 * @returns {Promise<Object>} State data
 */
export const getStateById = async (id) => {
  try {
    const state = await StateModel.findOne({ _id: id }).lean();
    
    if (!state) {
      throw new ApiError(404, `State with ID ${id} not found`);
    }
    
    return state;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching state: ${error.message}`);
  }
};

/**
 * Get state by ISO code
 * @param {string} isoCode - State ISO code
 * @param {number} countryId - Country ID (optional for additional filtering)
 * @returns {Promise<Object>} State data
 */
export const getStateByIsoCode = async (isoCode, countryId = null) => {
  try {
    const query = { iso2: isoCode.toUpperCase() };
    
    if (countryId) {
      query.country_id = Number(countryId);
    }
    
    const state = await StateModel.findOne(query).lean();
    
    if (!state) {
      throw new ApiError(404, `State with ISO code ${isoCode} not found`);
    }
    
    return state;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error fetching state: ${error.message}`);
  }
};

/**
 * Create a new state
 * @param {Object} stateData - State data
 * @returns {Promise<Object>} Created state
 */
export const createState = async (stateData) => {
  try {
    const state = new StateModel(stateData);
    const savedState = await state.save();
    return savedState.toObject();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'State with this ID already exists');
    }
    throw new ApiError(500, `Error creating state: ${error.message}`);
  }
};

/**
 * Update state by ID
 * @param {number} id - State ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated state
 */
export const updateStateById = async (id, updateData) => {
  try {
    const state = await StateModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!state) {
      throw new ApiError(404, `State with ID ${id} not found`);
    }
    
    return state;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error updating state: ${error.message}`);
  }
};

/**
 * Delete state by ID
 * @param {number} id - State ID
 * @returns {Promise<Object>} Deleted state
 */
export const deleteStateById = async (id) => {
  try {
    const state = await StateModel.findOneAndDelete({ _id: id }).lean();
    
    if (!state) {
      throw new ApiError(404, `State with ID ${id} not found`);
    }
    
    return state;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting state: ${error.message}`);
  }
};