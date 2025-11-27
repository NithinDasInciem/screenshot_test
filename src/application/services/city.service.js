import * as cityRepository from '../../data/repositories/city.repository.js';
import * as stateRepository from '../../data/repositories/state.repository.js';
import * as countryRepository from '../../data/repositories/country.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get cities by state ID with optional filtering and pagination
 * @param {number} stateId - State ID (required)
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} Cities with pagination info
 */
export const getCitiesByState = async (stateId, queryParams) => {
  try {
    if (!stateId || isNaN(stateId)) {
      throw new ApiError(400, 'Valid state ID is required as query parameter');
    }

    // Validate that the state exists
    await stateRepository.getStateById(Number(stateId));

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
    const validSortFields = ['name', 'state_name', 'country_name', 'latitude', 'longitude'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await cityRepository.getCitiesByState(Number(stateId), options);
    
    return {
      message: 'Cities retrieved successfully',
      data: result.cities,
      pagination: result.pagination,
      stateId: Number(stateId),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving cities: ${error.message}`);
  }
};

/**
 * Get cities by country ID with optional filtering and pagination
 * @param {number} countryId - Country ID (required)
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} Cities with pagination info
 */
export const getCitiesByCountry = async (countryId, queryParams) => {
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
    const validSortFields = ['name', 'state_name', 'country_name', 'latitude', 'longitude'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await cityRepository.getCitiesByCountry(Number(countryId), options);
    
    return {
      message: 'Cities retrieved successfully',
      data: result.cities,
      pagination: result.pagination,
      countryId: Number(countryId),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving cities: ${error.message}`);
  }
};

/**
 * Get all cities with optional filtering and pagination
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} Cities with pagination info
 */
export const getAllCities = async (queryParams) => {
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
    const validSortFields = ['name', 'state_name', 'country_name', 'state_id', 'country_id'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await cityRepository.getAllCities(options);
    
    return {
      message: 'Cities retrieved successfully',
      data: result.cities,
      pagination: result.pagination,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving cities: ${error.message}`);
  }
};

/**
 * Get city by ID
 * @param {number} id - City ID
 * @returns {Promise<Object>} City data
 */
export const getCityById = async (id) => {
  try {
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid city ID is required');
    }

    const city = await cityRepository.getCityById(Number(id));
    
    return {
      message: 'City retrieved successfully',
      data: city,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving city: ${error.message}`);
  }
};

/**
 * Search cities by name across all states and countries
 * @param {string} searchTerm - Search term
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} Cities with pagination info
 */
export const searchCities = async (searchTerm, queryParams) => {
  try {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      throw new ApiError(400, 'Valid search term is required');
    }

    const options = {
      page: parseInt(queryParams.page) || 1,
      limit: parseInt(queryParams.limit) || 50,
      countryId: queryParams.countryId ? Number(queryParams.countryId) : null,
      stateId: queryParams.stateId ? Number(queryParams.stateId) : null,
    };

    // Validate pagination parameters
    if (options.page < 1) {
      throw new ApiError(400, 'Page number must be greater than 0');
    }
    if (options.limit < 1 || options.limit > 100) {
      throw new ApiError(400, 'Limit must be between 1 and 100');
    }

    // Validate country and state IDs if provided
    if (options.countryId && isNaN(options.countryId)) {
      throw new ApiError(400, 'Valid country ID is required if provided');
    }
    if (options.stateId && isNaN(options.stateId)) {
      throw new ApiError(400, 'Valid state ID is required if provided');
    }

    // Validate that country exists if provided
    if (options.countryId) {
      await countryRepository.getCountryById(options.countryId);
    }

    // Validate that state exists if provided
    if (options.stateId) {
      await stateRepository.getStateById(options.stateId);
    }

    const result = await cityRepository.searchCities(searchTerm.trim(), options);
    
    return {
      message: 'Cities search completed successfully',
      data: result.cities,
      pagination: result.pagination,
      searchTerm: searchTerm.trim(),
      filters: {
        countryId: options.countryId,
        stateId: options.stateId,
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
    // Validate required fields
    const requiredFields = ['_id', 'name', 'state_id', 'country_id', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !cityData[field]);
    
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate that the state exists
    await stateRepository.getStateById(Number(cityData.state_id));

    // Validate that the country exists
    await countryRepository.getCountryById(Number(cityData.country_id));

    // Validate country code format if provided
    if (cityData.country_code && cityData.country_code.length !== 2) {
      throw new ApiError(400, 'Country code must be 2 characters long');
    }

    const city = await cityRepository.createCity(cityData);
    
    return {
      message: 'City created successfully',
      data: city,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid city ID is required');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'Update data is required');
    }

    // Validate state ID if provided
    if (updateData.state_id) {
      await stateRepository.getStateById(Number(updateData.state_id));
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

    const city = await cityRepository.updateCityById(Number(id), updateData);
    
    return {
      message: 'City updated successfully',
      data: city,
    };
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
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid city ID is required');
    }

    const city = await cityRepository.deleteCityById(Number(id));
    
    return {
      message: 'City deleted successfully',
      data: city,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting city: ${error.message}`);
  }
};

/**
 * Get cities by state ID without pagination (simplified endpoint)
 * @param {number} stateId - State ID (required)
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} All cities for the state without pagination
 */
export const getCitiesByStateSimple = async (stateId, queryParams = {}) => {
  try {
    if (!stateId || isNaN(stateId)) {
      throw new ApiError(400, 'Valid state ID is required');
    }

    // Validate that the state exists
    await stateRepository.getStateById(Number(stateId));

    const options = {
      page: 1,
      limit: 5000, // Large limit to get all cities
      search: queryParams.search || '',
      sortBy: queryParams.sortBy || 'name',
      sortOrder: queryParams.sortOrder || 'asc',
    };

    // Validate sort order
    if (!['asc', 'desc'].includes(options.sortOrder)) {
      throw new ApiError(400, 'Sort order must be either "asc" or "desc"');
    }

    // Validate sort field
    const validSortFields = ['name', 'state_name', 'country_name', 'latitude', 'longitude'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await cityRepository.getCitiesByState(Number(stateId), options);
    
    return {
      message: 'Cities retrieved successfully',
      data: result.cities,
      total: result.pagination.total,
      stateId: Number(stateId),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving cities: ${error.message}`);
  }
};