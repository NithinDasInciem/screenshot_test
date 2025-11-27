import express from 'express';
import {
  // Country routes (no dependencies)
  getAllCountries,
  getAllCountriesSimple,
  getCountryById,
  getCountryByIsoCode,
  createCountry,
  updateCountryById,
  deleteCountryById,
  
  // State routes (depends on country)
  getStatesByCountry,
  getStatesByCountrySimple,
  getAllStates,
  getStateById,
  getStateByIsoCode,
  createState,
  updateStateById,
  deleteStateById,
  
  // City routes (depends on state)
  getCitiesByState,
  getCitiesByStateSimple,
  getCitiesByCountry,
  getAllCities,
  getCityById,
  searchCities,
  createCity,
  updateCityById,
  deleteCityById,
} from '../controllers/geography.controller.js';

const router = express.Router();

// ============================================
// COUNTRY ROUTES (No Dependencies)
// ============================================

/**
 * @route GET /api/geography/countries
 * @desc Get all countries with optional filtering and pagination
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50, max: 100)
 * @query {string} search - Search term for country name, ISO codes, or nationality
 * @query {string} sortBy - Field to sort by (name, iso2, iso3, capital, region_id, subregion_id)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @access Public
 */
router.get('/countries', getAllCountries);

/**
 * @route GET /api/geography/countries/:id
 * @desc Get country by ID
 * @param {number} id - Country ID
 * @access Public
 */
router.get('/countries/:id', getCountryById);

/**
 * @route GET /api/geography/countries/iso/:isoCode
 * @desc Get country by ISO code (2 or 3 letter)
 * @param {string} isoCode - ISO2 or ISO3 country code
 * @access Public
 */
router.get('/countries/iso/:isoCode', getCountryByIsoCode);

/**
 * @route POST /api/geography/countries
 * @desc Create a new country
 * @body {Object} countryData - Country data
 * @access Admin
 */
router.post('/countries', createCountry);

/**
 * @route PUT /api/geography/countries/:id
 * @desc Update country by ID
 * @param {number} id - Country ID
 * @body {Object} updateData - Data to update
 * @access Admin
 */
router.put('/countries/:id', updateCountryById);

/**
 * @route DELETE /api/geography/countries/:id
 * @desc Delete country by ID
 * @param {number} id - Country ID
 * @access Admin
 */
router.delete('/countries/:id', deleteCountryById);

// ============================================
// STATE ROUTES (Depends on Country)
// ============================================

/**
 * @route GET /api/geography/states
 * @desc Get states by country ID (REQUIRES country query parameter) or all states
 * @query {number} country - Country ID (REQUIRED for filtered results)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50, max: 100)
 * @query {string} search - Search term for state name, ISO code, or type
 * @query {string} sortBy - Field to sort by (name, iso2, type, country_name)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @access Public
 * @example /api/geography/states?country=1 - Get all states for country ID 1
 * @example /api/geography/states - Get all states (not filtered by country)
 */
router.get('/states', (req, res, next) => {
  // If country query parameter is provided, get states by country
  if (req.query.country) {
    return getStatesByCountry(req, res, next);
  }
  // Otherwise get all states
  return getAllStates(req, res, next);
});

/**
 * @route GET /api/geography/states/:id
 * @desc Get state by ID
 * @param {number} id - State ID
 * @access Public
 */
router.get('/states/:id', getStateById);

/**
 * @route GET /api/geography/states/iso/:isoCode
 * @desc Get state by ISO code
 * @param {string} isoCode - State ISO code
 * @query {number} country - Optional country ID for additional filtering
 * @access Public
 */
router.get('/states/iso/:isoCode', getStateByIsoCode);

/**
 * @route POST /api/geography/states
 * @desc Create a new state
 * @body {Object} stateData - State data
 * @access Admin
 */
router.post('/states', createState);

/**
 * @route PUT /api/geography/states/:id
 * @desc Update state by ID
 * @param {number} id - State ID
 * @body {Object} updateData - Data to update
 * @access Admin
 */
router.put('/states/:id', updateStateById);

/**
 * @route DELETE /api/geography/states/:id
 * @desc Delete state by ID
 * @param {number} id - State ID
 * @access Admin
 */
router.delete('/states/:id', deleteStateById);

// ============================================
// CITY ROUTES (Depends on State)
// ============================================

/**
 * @route GET /api/geography/cities
 * @desc Get cities by state ID (REQUIRES state query parameter) or by country ID or all cities
 * @query {number} state - State ID (REQUIRED for state-filtered results)
 * @query {number} country - Country ID (alternative filter)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50, max: 100)
 * @query {string} search - Search term for city name, state name, or country name
 * @query {string} sortBy - Field to sort by (name, state_name, country_name, latitude, longitude)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @access Public
 * @example /api/geography/cities?state=3901 - Get all cities for state ID 3901
 * @example /api/geography/cities?country=1 - Get all cities for country ID 1
 * @example /api/geography/cities - Get all cities (not filtered)
 */
router.get('/cities', (req, res, next) => {
  // Priority: state > country > all
  if (req.query.state) {
    return getCitiesByState(req, res, next);
  } else if (req.query.country) {
    return getCitiesByCountry(req, res, next);
  }
  // Otherwise get all cities
  return getAllCities(req, res, next);
});

/**
 * @route GET /api/geography/cities/search
 * @desc Search cities by name with optional filters
 * @query {string} search - Search term (REQUIRED)
 * @query {number} country - Optional country ID filter
 * @query {number} state - Optional state ID filter
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50, max: 100)
 * @access Public
 * @example /api/geography/cities/search?search=New&country=1
 */
router.get('/cities/search', searchCities);

/**
 * @route GET /api/geography/cities/:id
 * @desc Get city by ID
 * @param {number} id - City ID
 * @access Public
 */
router.get('/cities/:id', getCityById);

/**
 * @route POST /api/geography/cities
 * @desc Create a new city
 * @body {Object} cityData - City data
 * @access Admin
 */
router.post('/cities', createCity);

/**
 * @route PUT /api/geography/cities/:id
 * @desc Update city by ID
 * @param {number} id - City ID
 * @body {Object} updateData - Data to update
 * @access Admin
 */
router.put('/cities/:id', updateCityById);

/**
 * @route DELETE /api/geography/cities/:id
 * @desc Delete city by ID
 * @param {number} id - City ID
 * @access Admin
 */
router.delete('/cities/:id', deleteCityById);

// ============================================
// SIMPLIFIED ROUTES (WITHOUT PAGINATION)
// ============================================

/**
 * @route GET /api/geography/countries-simple
 * @desc Get all countries without pagination (simplified endpoint)
 * @query {string} search - Search term for country name, ISO codes, or nationality
 * @query {string} sortBy - Field to sort by (name, iso2, iso3, capital)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @access Public
 */
router.get('/countries-simple', getAllCountriesSimple);

/**
 * @route GET /api/geography/states-simple
 * @desc Get states by country ID without pagination (simplified endpoint)
 * @query {number} country - Country ID (REQUIRED)
 * @query {string} search - Search term for state name or ISO code
 * @query {string} sortBy - Field to sort by (name, iso2, type)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @access Public
 */
router.get('/states-simple', getStatesByCountrySimple);

/**
 * @route GET /api/geography/cities-simple
 * @desc Get cities by state ID without pagination (simplified endpoint)
 * @query {number} state - State ID (REQUIRED)
 * @query {string} search - Search term for city name
 * @query {string} sortBy - Field to sort by (name, latitude, longitude)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @access Public
 */
router.get('/cities-simple', getCitiesByStateSimple);

export default router;