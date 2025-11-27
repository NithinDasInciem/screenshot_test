import * as countryRepository from '../../data/repositories/country.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get all countries with optional filtering and pagination
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} Countries with pagination info
 */
export const getAllCountries = async (queryParams) => {
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
    const validSortFields = ['name', 'iso2', 'iso3', 'capital', 'region_id', 'subregion_id'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await countryRepository.getAllCountries(options);
    
    return {
      message: 'Countries retrieved successfully',
      data: result.countries,
      pagination: result.pagination,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving countries: ${error.message}`);
  }
};

/**
 * Get country by ID
 * @param {number} id - Country ID
 * @returns {Promise<Object>} Country data
 */
export const getCountryById = async (id) => {
  try {
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid country ID is required');
    }

    const country = await countryRepository.getCountryById(Number(id));
    
    return {
      message: 'Country retrieved successfully',
      data: country,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving country: ${error.message}`);
  }
};

/**
 * Get country by ISO code
 * @param {string} isoCode - ISO2 or ISO3 country code
 * @returns {Promise<Object>} Country data
 */
export const getCountryByIsoCode = async (isoCode) => {
  try {
    if (!isoCode || typeof isoCode !== 'string') {
      throw new ApiError(400, 'Valid ISO code is required');
    }

    if (isoCode.length !== 2 && isoCode.length !== 3) {
      throw new ApiError(400, 'ISO code must be 2 or 3 characters long');
    }

    const country = await countryRepository.getCountryByIsoCode(isoCode);
    
    return {
      message: 'Country retrieved successfully',
      data: country,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving country: ${error.message}`);
  }
};

/**
 * Create a new country
 * @param {Object} countryData - Country data
 * @returns {Promise<Object>} Created country
 */
export const createCountry = async (countryData) => {
  try {
    // Validate required fields
    const requiredFields = ['_id', 'name', 'iso2', 'iso3', 'capital'];
    const missingFields = requiredFields.filter(field => !countryData[field]);
    
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate ISO codes format
    if (countryData.iso2.length !== 2) {
      throw new ApiError(400, 'ISO2 code must be 2 characters long');
    }
    if (countryData.iso3.length !== 3) {
      throw new ApiError(400, 'ISO3 code must be 3 characters long');
    }

    const country = await countryRepository.createCountry(countryData);
    
    return {
      message: 'Country created successfully',
      data: country,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid country ID is required');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'Update data is required');
    }

    // Validate ISO codes format if provided
    if (updateData.iso2 && updateData.iso2.length !== 2) {
      throw new ApiError(400, 'ISO2 code must be 2 characters long');
    }
    if (updateData.iso3 && updateData.iso3.length !== 3) {
      throw new ApiError(400, 'ISO3 code must be 3 characters long');
    }

    // Don't allow updating the primary key
    delete updateData._id;

    const country = await countryRepository.updateCountryById(Number(id), updateData);
    
    return {
      message: 'Country updated successfully',
      data: country,
    };
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
    if (!id || isNaN(id)) {
      throw new ApiError(400, 'Valid country ID is required');
    }

    const country = await countryRepository.deleteCountryById(Number(id));
    
    return {
      message: 'Country deleted successfully',
      data: country,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error deleting country: ${error.message}`);
  }
};

/**
 * Get all countries without pagination (simplified endpoint)
 * @param {Object} queryParams - Query parameters from request
 * @returns {Promise<Object>} All countries without pagination
 */
export const getAllCountriesSimple = async (queryParams = {}) => {
  try {
    const options = {
      page: 1,
      limit: 1000, // Large limit to get all countries
      search: queryParams.search || '',
      sortBy: queryParams.sortBy || 'name',
      sortOrder: queryParams.sortOrder || 'asc',
    };

    // Validate sort order
    if (!['asc', 'desc'].includes(options.sortOrder)) {
      throw new ApiError(400, 'Sort order must be either "asc" or "desc"');
    }

    // Validate sort field
    const validSortFields = ['name', 'iso2', 'iso3', 'capital', 'region_id', 'subregion_id'];
    if (!validSortFields.includes(options.sortBy)) {
      throw new ApiError(400, `Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const result = await countryRepository.getAllCountries(options);
    
    return {
      message: 'Countries retrieved successfully',
      data: result.countries,
      total: result.pagination.total,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Error retrieving countries: ${error.message}`);
  }
};