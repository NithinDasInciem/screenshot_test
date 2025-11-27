import LoginModel from '../models/login.model.js';

/**
 * Creates a new login document.
 * @param {object} data - The data for the new login.
 * @returns {Promise<Document>}
 */
export const create = async data => {
  return LoginModel.create(data);
};

/**
 * Finds a single login document by a query.
 * @param {object} query - The Mongoose query object.
 * @param {string | object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query (e.g., lean, populate).
 * @returns {Promise<Document|object|null>}
 */
export const findOne = async (query, projection, options) => {
  let q = LoginModel.findOne(query);
  if (projection) {
    q = q.select(projection);
  }
  if (options && options.populate) {
    q = q.populate(options.populate);
    delete options.populate;
  }
  if (options && Object.keys(options).length > 0) {
    q = q.setOptions(options);
  }
  return q.exec();
};

/**
 * Finds a login document by its ID.
 * @param {string} id - The login's ID.
 * @param {string | object} [projection] - The fields to select or exclude.
 * @returns {Promise<Document|null>}
 */
export const findById = async (id, projection) => {
  const query = LoginModel.findById(id);
  return projection ? query.select(projection) : query;
};

/**
 * Finds a login document by its ID and updates it.
 * @param {string} id - The login's ID.
 * @param {object} update - The update object.
 * @param {object} options - Mongoose options for the update.
 * @returns {Promise<Document|null>}
 */
export const findByIdAndUpdate = async (id, update, options) => {
  return LoginModel.findByIdAndUpdate(id, update, options);
};

/**
 * Finds a single login document by a query and updates it.
 * @param {object} query - The Mongoose query object.
 * @param {object} update - The update object.
 * @param {object} options - Mongoose options for the update.
 * @returns {Promise<Document|null>}
 */
export const findOneAndUpdate = async (query, update, options) => {
  return LoginModel.findOneAndUpdate(query, update, options);
};

/**
 * Finds multiple login documents that match a query.
 * @param {object} filter - The Mongoose filter object.
 * @param {string|object} [projection] - The fields to select or exclude.
 * @param {object|Array} [populateOptions] - The options for populating referenced documents.
 * @returns {Promise<Array<Document>>}
 */
export const find = async (filter, projection, populateOptions) => {
  let query = LoginModel.find(filter);

  if (projection) {
    query = query.select(projection);
  }
  if (populateOptions) {
    query = query.populate(populateOptions);
  }

  return query.exec();
};

/**
 * Updates multiple login documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @param {object} update - The update object.
 * @returns {Promise<object>}
 */
export const updateMany = async (filter, update) => {
  return LoginModel.updateMany(filter, update);
};
