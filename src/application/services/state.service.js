import * as stateRepository from '../../data/repositories/state.repository.js';
import * as countryRepository from '../../data/repositories/country.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get states by country ID with optional filtering and pagination
 * @param {number} countryId - Country ID (required)
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} States with pagination info
 */
export const getStatesByCountry = async (countryId, queryParams) => {
  try {
    if (!countryId || isNaN(countryId)) {
      throw new ApiError(400, 'Valid country ID is required as query parameter');
    }

    // Validate that the country exists
    await countryRepository.getCountryById(Number(countryId));

    const options = {
      page: parseInt(queryParams.page) || 1,
      limit: parseInt(queryParams.limit) || 50,
      search: queryParams.search || '',
      sortBy: queryParams.sortBy || 'name',
      sortOrder: queryParams.sortOrder || 'asc',
    };

    // Validate pagination parameters
    if (options.page < 1) {
      throw new ApiError(400, 'Page number must be greater than 0');
    }
    if (options.limit < 1 || options.limit > 100) {
      throw new ApiError(400, 'Limit must be between 1 and 100');
    }

    // Validate sort order
    if (!['asc', 'desc'].includes(options.sortOrder)) {
      throw new ApiError(400, 'Sort order must be either "asc" or "desc"');
    }

    // Validate sort field
    const validSortFields = ['name', 'iso2', 'type', 'country_name'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await stateRepository.getStatesByCountry(Number(countryId), options);
    
    return {
      message: 'States retrieved successfully',
      data: result.states,
      pagination: result.pagination,
      countryId: Number(countryId),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving states: ${error.message}`);
  }
};

/**
 * Get all states with optional filtering and pagination
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} States with pagination info
 */
export const getAllStates = async (queryParams) => {
  try {
    const options = {
      page: parseInt(queryParams.page) || 1,
      limit: parseInt(queryParams.limit) || 50,
      search: queryParams.search || '',
      sortBy: queryParams.sortBy || 'name',
      sortOrder: queryParams.sortOrder || 'asc',
    };

    // Validate pagination parameters
    if (options.page < 1) {
      throw new ApiError(400, 'Page number must be greater than 0');
    }
    if (options.limit < 1 || options.limit > 100) {
      throw new ApiError(400, 'Limit must be between 1 and 100');
    }

    // Validate sort order
    if (!['asc', 'desc'].includes(options.sortOrder)) {
      throw new ApiError(400, 'Sort order must be either "asc" or "desc"');
    }

    // Validate sort field
    const validSortFields = ['name', 'iso2', 'type', 'country_name', 'country_id'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await stateRepository.getAllStates(options);
    
    return {
      message: 'States retrieved successfully',
      data: result.states,
      pagination: result.pagination,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving states: ${error.message}`);
  }
};

/**
 * Get state by ID
 * @param {number} id - State ID
 * @returns {Promise<Object>} State data
 */
export const getStateById = async (id) => {
  try {
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid state ID is required');
    }

    const state = await stateRepository.getStateById(Number(id));
    
    return {
      message: 'State retrieved successfully',
      data: state,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving state: ${error.message}`);
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
    if (!isoCode || typeof isoCode !== 'string') {
      throw new ApiError(400, 'Valid ISO code is required');
    }

    if (countryId && isNaN(countryId)) {
      throw new ApiError(400, 'Valid country ID is required if provided');
    }

    const state = await stateRepository.getStateByIsoCode(
      isoCode, 
      countryId ? Number(countryId) : null
    );
    
    return {
      message: 'State retrieved successfully',
      data: state,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving state: ${error.message}`);
  }
};

/**
 * Create a new state
 * @param {Object} stateData - State data
 * @returns {Promise<Object>} Created state
 */
export const createState = async (stateData) => {
  try {
    // Validate required fields
    const requiredFields = ['_id', 'name', 'country_id', 'country_code', 'iso2'];
    const missingFields = requiredFields.filter(field => !stateData[field]);
    
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate that the country exists
    await countryRepository.getCountryById(Number(stateData.country_id));

    // Validate country code format
    if (stateData.country_code.length !== 2) {
      throw new ApiError(400, 'Country code must be 2 characters long');
    }

    const state = await stateRepository.createState(stateData);
    
    return {
      message: 'State created successfully',
      data: state,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid state ID is required');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'Update data is required');
    }

    // Validate country ID if provided
    if (updateData.country_id) {
      await countryRepository.getCountryById(Number(updateData.country_id));
    }

    // Validate country code format if provided
    if (updateData.country_code && updateData.country_code.length !== 2) {
      throw new ApiError(400, 'Country code must be 2 characters long');
    }

    // Don't allow updating the primary key
    delete updateData._id;

    const state = await stateRepository.updateStateById(Number(id), updateData);
    
    return {
      message: 'State updated successfully',
      data: state,
    };
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
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid state ID is required');
    }

    const state = await stateRepository.deleteStateById(Number(id));
    
    return {
      message: 'State deleted successfully',
      data: state,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting state: ${error.message}`);
  }
};

/**
 * Get states by country ID without pagination (simplified endpoint)
 * @param {number} countryId - Country ID (required)
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} All states for the country without pagination
 */
export const getStatesByCountrySimple = async (countryId, queryParams = {}) => {
  try {
    if (!countryId || isNaN(countryId)) {
      throw new ApiError(400, 'Valid country ID is required');
    }

    // Validate that the country exists
    await countryRepository.getCountryById(Number(countryId));

    const options = {
      page: 1,
      limit: 1000, // Large limit to get all states
      search: queryParams.search || '',
      sortBy: queryParams.sortBy || 'name',
      sortOrder: queryParams.sortOrder || 'asc',
    };

    // Validate sort order
    if (!['asc', 'desc'].includes(options.sortOrder)) {
      throw new ApiError(400, 'Sort order must be either "asc" or "desc"');
    }

    // Validate sort field
    const validSortFields = ['name', 'iso2', 'type', 'country_name'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await stateRepository.getStatesByCountry(Number(countryId), options);
    
    return {
      message: 'States retrieved successfully',
      data: result.states,
      total: result.pagination.total,
      countryId: Number(countryId),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving states: ${error.message}`);
  }
};