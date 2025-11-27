/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *         _id:
 *           type: integer
 *           description: Unique country identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Country name
 *           example: "United States"
 *         iso3:
 *           type: string
 *           description: ISO 3166-1 alpha-3 country code
 *           example: "USA"
 *         iso2:
 *           type: string
 *           description: ISO 3166-1 alpha-2 country code
 *           example: "US"
 *         numeric_code:
 *           type: string
 *           description: ISO 3166-1 numeric country code
 *           example: "840"
 *         phonecode:
 *           type: string
 *           description: International dialing code
 *           example: "1"
 *         capital:
 *           type: string
 *           description: Capital city
 *           example: "Washington, D.C."
 *         currency:
 *           type: string
 *           description: Currency code
 *           example: "USD"
 *         currency_name:
 *           type: string
 *           description: Currency name
 *           example: "United States Dollar"
 *         currency_symbol:
 *           type: string
 *           description: Currency symbol
 *           example: "$"
 *         tld:
 *           type: string
 *           description: Top-level domain
 *           example: ".us"
 *         native:
 *           type: string
 *           description: Native country name
 *           example: "United States"
 *         region_id:
 *           type: integer
 *           description: Region identifier
 *           example: 2
 *         subregion_id:
 *           type: integer
 *           description: Subregion identifier
 *           example: 21
 *         nationality:
 *           type: string
 *           description: Nationality/demonym
 *           example: "American"
 *         latitude:
 *           type: string
 *           description: Country latitude
 *           example: "38.00000000"
 *         longitude:
 *           type: string
 *           description: Country longitude
 *           example: "-97.00000000"
 *         emoji:
 *           type: string
 *           description: Country flag emoji
 *           example: "🇺🇸"
 *         emojiU:
 *           type: string
 *           description: Country flag emoji unicode
 *           example: "U+1F1FA U+1F1F8"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     State:
 *       type: object
 *       properties:
 *         _id:
 *           type: integer
 *           description: Unique state identifier
 *           example: 3901
 *         name:
 *           type: string
 *           description: State name
 *           example: "California"
 *         country_id:
 *           type: integer
 *           description: ID of the parent country
 *           example: 1
 *         country_code:
 *           type: string
 *           description: Country ISO2 code
 *           example: "US"
 *         country_name:
 *           type: string
 *           description: Country name
 *           example: "United States"
 *         iso2:
 *           type: string
 *           description: State ISO2 code
 *           example: "CA"
 *         fips_code:
 *           type: string
 *           description: FIPS code
 *           example: "06"
 *         type:
 *           type: string
 *           description: Administrative division type
 *           example: "state"
 *         level:
 *           type: string
 *           nullable: true
 *           description: Administrative level
 *         parent_id:
 *           type: integer
 *           nullable: true
 *           description: Parent administrative division ID
 *         latitude:
 *           type: string
 *           description: State latitude
 *           example: "36.77826100"
 *         longitude:
 *           type: string
 *           description: State longitude
 *           example: "-119.41793240"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     City:
 *       type: object
 *       properties:
 *         _id:
 *           type: integer
 *           description: Unique city identifier
 *           example: 84
 *         name:
 *           type: string
 *           description: City name
 *           example: "Los Angeles"
 *         state_id:
 *           type: integer
 *           description: ID of the parent state
 *           example: 3901
 *         state_code:
 *           type: string
 *           description: State ISO2 code
 *           example: "CA"
 *         state_name:
 *           type: string
 *           description: State name
 *           example: "California"
 *         country_id:
 *           type: integer
 *           description: ID of the parent country
 *           example: 1
 *         country_code:
 *           type: string
 *           description: Country ISO2 code
 *           example: "US"
 *         country_name:
 *           type: string
 *           description: Country name
 *           example: "United States"
 *         latitude:
 *           type: string
 *           description: City latitude
 *           example: "34.05223000"
 *         longitude:
 *           type: string
 *           description: City longitude
 *           example: "-118.24368000"
 *         wikiDataId:
 *           type: string
 *           nullable: true
 *           description: WikiData identifier
 *           example: "Q65"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     GeographyPagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of items
 *           example: 250
 *         page:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Items per page
 *           example: 50
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *           example: 5
 *         hasNextPage:
 *           type: boolean
 *           description: Whether there are more pages
 *           example: true
 *         hasPrevPage:
 *           type: boolean
 *           description: Whether there are previous pages
 *           example: false
 *
 *     GeographyError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Country with ID 99999 not found"
 *         error:
 *           type: string
 *           example: "Resource not found"
 */

/**
 * @swagger
 * tags:
 *   name: Geography
 *   description: Geographic data endpoints for countries, states, and cities with hierarchical dependencies
 */

/**
 * @swagger
 * /api/geography/countries:
 *   get:
 *     summary: Get all countries
 *     description: Retrieve all countries with optional filtering, pagination, and sorting. No dependencies required.
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for country name, ISO codes, or nationality
 *         example: "united"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, iso2, iso3, capital, region_id, subregion_id]
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Countries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Countries retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Country'
 *                 pagination:
 *                   $ref: '#/components/schemas/GeographyPagination'
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeographyError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeographyError'
 *
 *   post:
 *     summary: Create a new country
 *     description: Create a new country entry
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - name
 *               - iso2
 *               - iso3
 *               - capital
 *             properties:
 *               _id:
 *                 type: integer
 *                 description: Unique country identifier
 *                 example: 999
 *               name:
 *                 type: string
 *                 description: Country name
 *                 example: "Test Country"
 *               iso2:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: ISO2 country code
 *                 example: "TC"
 *               iso3:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *                 description: ISO3 country code
 *                 example: "TCO"
 *               capital:
 *                 type: string
 *                 description: Capital city
 *                 example: "Test City"
 *               currency:
 *                 type: string
 *                 description: Currency code
 *                 example: "USD"
 *               phonecode:
 *                 type: string
 *                 description: Phone code
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Country created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Country created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Country'
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - Country already exists
 *
 * /api/geography/countries/{id}:
 *   get:
 *     summary: Get country by ID
 *     description: Retrieve a specific country by its ID
 *     tags: [Geography]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Country ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Country retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Country retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeographyError'
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update country by ID
 *     description: Update an existing country
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Country ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capital:
 *                 type: string
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Country not found
 *
 *   delete:
 *     summary: Delete country by ID
 *     description: Delete a country
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Country ID
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Country not found
 *
 * /api/geography/countries/iso/{isoCode}:
 *   get:
 *     summary: Get country by ISO code
 *     description: Retrieve a country by its ISO2 or ISO3 code
 *     tags: [Geography]
 *     parameters:
 *       - in: path
 *         name: isoCode
 *         required: true
 *         schema:
 *           type: string
 *         description: ISO2 (2 chars) or ISO3 (3 chars) country code
 *         example: "US"
 *     responses:
 *       200:
 *         description: Country retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Country retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Country'
 *       400:
 *         description: Invalid ISO code format
 *       404:
 *         description: Country not found
 *
 * /api/geography/states:
 *   get:
 *     summary: Get states (requires country parameter for filtering)
 *     description: |
 *       Get states with dependency on country. 
 *       - With `country` parameter: Returns states for specific country (primary use case)
 *       - Without `country` parameter: Returns all states (unfiltered)
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: integer
 *         description: Country ID (REQUIRED for filtered results)
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for state name, ISO code, or type
 *         example: "california"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, iso2, type, country_name]
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: States retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "States retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/State'
 *                 pagination:
 *                   $ref: '#/components/schemas/GeographyPagination'
 *                 countryId:
 *                   type: integer
 *                   description: Country ID filter applied (if any)
 *                   example: 1
 *       400:
 *         description: Bad request - Invalid country ID or parameters
 *       404:
 *         description: Country not found (when country parameter is provided)
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new state
 *     description: Create a new state entry (requires valid country_id)
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - name
 *               - country_id
 *               - country_code
 *               - iso2
 *             properties:
 *               _id:
 *                 type: integer
 *                 example: 9999
 *               name:
 *                 type: string
 *                 example: "Test State"
 *               country_id:
 *                 type: integer
 *                 description: Must reference existing country
 *                 example: 1
 *               country_code:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: "US"
 *               iso2:
 *                 type: string
 *                 example: "TS"
 *               type:
 *                 type: string
 *                 example: "state"
 *     responses:
 *       201:
 *         description: State created successfully
 *       400:
 *         description: Bad request - Invalid input or country doesn't exist
 *       401:
 *         description: Unauthorized
 *
 * /api/geography/states/{id}:
 *   get:
 *     summary: Get state by ID
 *     description: Retrieve a specific state by its ID
 *     tags: [Geography]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: State ID
 *         example: 3901
 *     responses:
 *       200:
 *         description: State retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "State retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/State'
 *       404:
 *         description: State not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update state by ID
 *     description: Update an existing state
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: State ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               country_id:
 *                 type: integer
 *                 description: Must reference existing country
 *     responses:
 *       200:
 *         description: State updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: State not found
 *
 *   delete:
 *     summary: Delete state by ID
 *     description: Delete a state
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: State ID
 *     responses:
 *       200:
 *         description: State deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: State not found
 *
 * /api/geography/states/iso/{isoCode}:
 *   get:
 *     summary: Get state by ISO code
 *     description: Retrieve a state by its ISO code with optional country filtering
 *     tags: [Geography]
 *     parameters:
 *       - in: path
 *         name: isoCode
 *         required: true
 *         schema:
 *           type: string
 *         description: State ISO code
 *         example: "CA"
 *       - in: query
 *         name: country
 *         schema:
 *           type: integer
 *         description: Country ID for additional filtering
 *         example: 1
 *     responses:
 *       200:
 *         description: State retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "State retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/State'
 *       404:
 *         description: State not found
 *
 * /api/geography/cities:
 *   get:
 *     summary: Get cities (requires state parameter for filtering)
 *     description: |
 *       Get cities with dependency on state/country.
 *       - With `state` parameter: Returns cities for specific state (primary use case)
 *       - With `country` parameter: Returns cities for specific country (alternative)
 *       - Without parameters: Returns all cities (unfiltered)
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: integer
 *         description: State ID (REQUIRED for state-filtered results - primary use case)
 *         example: 3901
 *       - in: query
 *         name: country
 *         schema:
 *           type: integer
 *         description: Country ID (alternative filter)
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for city, state, or country name
 *         example: "los angeles"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, state_name, country_name, latitude, longitude]
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cities retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *                 pagination:
 *                   $ref: '#/components/schemas/GeographyPagination'
 *                 stateId:
 *                   type: integer
 *                   description: State ID filter applied (if any)
 *                   example: 3901
 *                 countryId:
 *                   type: integer
 *                   description: Country ID filter applied (if any)
 *                   example: 1
 *       400:
 *         description: Bad request - Invalid state/country ID or parameters
 *       404:
 *         description: State or country not found (when filter parameters are provided)
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new city
 *     description: Create a new city entry (requires valid state_id and country_id)
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - name
 *               - state_id
 *               - country_id
 *               - latitude
 *               - longitude
 *             properties:
 *               _id:
 *                 type: integer
 *                 example: 99999
 *               name:
 *                 type: string
 *                 example: "Test City"
 *               state_id:
 *                 type: integer
 *                 description: Must reference existing state
 *                 example: 3901
 *               country_id:
 *                 type: integer
 *                 description: Must reference existing country
 *                 example: 1
 *               latitude:
 *                 type: string
 *                 example: "34.05223000"
 *               longitude:
 *                 type: string
 *                 example: "-118.24368000"
 *               country_code:
 *                 type: string
 *                 example: "US"
 *     responses:
 *       201:
 *         description: City created successfully
 *       400:
 *         description: Bad request - Invalid input or state/country doesn't exist
 *       401:
 *         description: Unauthorized
 *
 * /api/geography/cities/search:
 *   get:
 *     summary: Search cities by name
 *     description: Search cities by name with optional country and state filters
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (REQUIRED)
 *         example: "new york"
 *       - in: query
 *         name: country
 *         schema:
 *           type: integer
 *         description: Optional country ID filter
 *         example: 1
 *       - in: query
 *         name: state
 *         schema:
 *           type: integer
 *         description: Optional state ID filter
 *         example: 3901
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Cities search completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cities search completed successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *                 pagination:
 *                   $ref: '#/components/schemas/GeographyPagination'
 *                 searchTerm:
 *                   type: string
 *                   example: "new york"
 *                 filters:
 *                   type: object
 *                   properties:
 *                     countryId:
 *                       type: integer
 *                       nullable: true
 *                     stateId:
 *                       type: integer
 *                       nullable: true
 *       400:
 *         description: Bad request - Missing search term or invalid filters
 *       404:
 *         description: Country or state not found (when filters are applied)
 *
 * /api/geography/cities/{id}:
 *   get:
 *     summary: Get city by ID
 *     description: Retrieve a specific city by its ID
 *     tags: [Geography]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *         example: 84
 *     responses:
 *       200:
 *         description: City retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "City retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update city by ID
 *     description: Update an existing city
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state_id:
 *                 type: integer
 *                 description: Must reference existing state
 *               country_id:
 *                 type: integer
 *                 description: Must reference existing country
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *     responses:
 *       200:
 *         description: City updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: City not found
 *
 *   delete:
 *     summary: Delete city by ID
 *     description: Delete a city
 *     tags: [Geography]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: City not found
 */

/**
 * @swagger
 * /api/geography/countries-simple:
 *   get:
 *     summary: Get all countries without pagination (simplified)
 *     description: Get all countries without pagination for easier frontend consumption
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for country name, ISO codes, or nationality
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, iso2, iso3, capital]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Countries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Countries retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Country'
 *
 * /api/geography/states-simple:
 *   get:
 *     summary: Get states by country without pagination (simplified)
 *     description: Get states by country ID without pagination for easier frontend consumption
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: country
 *         required: true
 *         schema:
 *           type: integer
 *         description: Country ID (required)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for state name or ISO code
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, iso2, type]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: States retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "States retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/State'
 *       400:
 *         description: Bad request - country parameter required
 *       404:
 *         description: Country not found
 *
 * /api/geography/cities-simple:
 *   get:
 *     summary: Get cities by state without pagination (simplified)
 *     description: Get cities by state ID without pagination for easier frontend consumption
 *     tags: [Geography]
 *     parameters:
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: integer
 *         description: State ID (required)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for city name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, latitude, longitude]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cities retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request - state parameter required
 *       404:
 *         description: State not found
 */