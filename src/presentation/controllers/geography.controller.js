import * as countryService from '../../application/services/country.service.js';
import * as stateService from '../../application/services/state.service.js';
import * as cityService from '../../application/services/city.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

// ============================================
// COUNTRY CONTROLLERS (No Dependencies)
// ============================================

/**
 * Get all countries with optional filtering and pagination
 */
export const getAllCountries = async (req, res, next) => {
  try {
    const result = await countryService.getAllCountries(req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all countries without pagination (simplified endpoint)
 */
export const getAllCountriesSimple = async (req, res, next) => {
  try {
    const result = await countryService.getAllCountriesSimple(req.query);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get country by ID
 */
export const getCountryById = async (req, res, next) => {
  try {
    const result = await countryService.getCountryById(req.params.id);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get country by ISO code
 */
export const getCountryByIsoCode = async (req, res, next) => {
  try {
    const result = await countryService.getCountryByIsoCode(req.params.isoCode);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new country
 */
export const createCountry = async (req, res, next) => {
  try {
    const result = await countryService.createCountry(req.body);
    ApiResponse.created(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Update country by ID
 */
export const updateCountryById = async (req, res, next) => {
  try {
    const result = await countryService.updateCountryById(req.params.id, req.body);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete country by ID
 */
export const deleteCountryById = async (req, res, next) => {
  try {
    const result = await countryService.deleteCountryById(req.params.id);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

// ============================================
// STATE CONTROLLERS (Depends on Country)
// ============================================

/**
 * Get states by country ID (REQUIRES country query parameter)
 */
export const getStatesByCountry = async (req, res, next) => {
  try {
    const countryId = req.query.country;
    const result = await stateService.getStatesByCountry(countryId, req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all states with optional filtering and pagination
 */
export const getAllStates = async (req, res, next) => {
  try {
    const result = await stateService.getAllStates(req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get state by ID
 */
export const getStateById = async (req, res, next) => {
  try {
    const result = await stateService.getStateById(req.params.id);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get state by ISO code
 */
export const getStateByIsoCode = async (req, res, next) => {
  try {
    const result = await stateService.getStateByIsoCode(
      req.params.isoCode, 
      req.query.country
    );
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new state
 */
export const createState = async (req, res, next) => {
  try {
    const result = await stateService.createState(req.body);
    ApiResponse.created(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Update state by ID
 */
export const updateStateById = async (req, res, next) => {
  try {
    const result = await stateService.updateStateById(req.params.id, req.body);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete state by ID
 */
export const deleteStateById = async (req, res, next) => {
  try {
    const result = await stateService.deleteStateById(req.params.id);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get states by country ID without pagination (simplified endpoint)
 */
export const getStatesByCountrySimple = async (req, res, next) => {
  try {
    const countryId = req.query.country;
    const result = await stateService.getStatesByCountrySimple(countryId, req.query);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

// ============================================
// CITY CONTROLLERS (Depends on State)
// ============================================

/**
 * Get cities by state ID (REQUIRES state query parameter)
 */
export const getCitiesByState = async (req, res, next) => {
  try {
    const stateId = req.query.state;
    const result = await cityService.getCitiesByState(stateId, req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get cities by country ID (REQUIRES country query parameter)
 */
export const getCitiesByCountry = async (req, res, next) => {
  try {
    const countryId = req.query.country;
    const result = await cityService.getCitiesByCountry(countryId, req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all cities with optional filtering and pagination
 */
export const getAllCities = async (req, res, next) => {
  try {
    const result = await cityService.getAllCities(req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get city by ID
 */
export const getCityById = async (req, res, next) => {
  try {
    const result = await cityService.getCityById(req.params.id);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Search cities by name with optional filters
 */
export const searchCities = async (req, res, next) => {
  try {
    const searchTerm = req.query.search;
    const result = await cityService.searchCities(searchTerm, req.query);
    ApiResponse.success(result.message, result.data, result.pagination).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new city
 */
export const createCity = async (req, res, next) => {
  try {
    const result = await cityService.createCity(req.body);
    ApiResponse.created(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Update city by ID
 */
export const updateCityById = async (req, res, next) => {
  try {
    const result = await cityService.updateCityById(req.params.id, req.body);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete city by ID
 */
export const deleteCityById = async (req, res, next) => {
  try {
    const result = await cityService.deleteCityById(req.params.id);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get cities by state ID without pagination (simplified endpoint)
 */
export const getCitiesByStateSimple = async (req, res, next) => {
  try {
    const stateId = req.query.state;
    const result = await cityService.getCitiesByStateSimple(stateId, req.query);
    ApiResponse.success(result.message, result.data).send(res);
  } catch (error) {
    next(error);
  }
};