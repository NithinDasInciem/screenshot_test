import MenuModel from '../models/menu.model.js';

/**
 * Creates a new menu document.
 * @param {object} data - The data for the new menu.
 * @returns {Promise<Document>}
 */
export const create = async data => {
  return MenuModel.create(data);
};

/**
 * Finds multiple menu documents that match a query.
 * @param {object} filter - The Mongoose filter object.
 * @param {string|object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query (e.g., sort, skip, limit, populate).
 * @returns {Promise<Array<Document>>}
 */
export const find = async (filter, projection, options) => {
  let query = MenuModel.find(filter, projection, options);
  if (options?.sort) {
    query = query.sort(options.sort);
  }
  if (options?.skip) {
    query = query.skip(options.skip);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.populate) {
    query = query.populate(options.populate);
  }
  return query.exec();
};

/**
 * Finds a single menu document by a query.
 * @param {object} query - The Mongoose query object.
 * @param {string | object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query (e.g., lean).
 * @returns {Promise<Document|object|null>}
 */
export const findOne = async (query, projection, options) => {
  let q = MenuModel.findOne(query, projection, options);
  return q.exec();
};

/**
 * Finds a menu document by its ID.
 * @param {string} id - The menu's ID.
 * @returns {Promise<Document|null>}
 */
export const findById = async id => {
  return MenuModel.findById(id);
};

/**
 * Finds a menu by ID and updates it.
 * @param {string} id - The menu's ID.
 * @param {object} update - The update object.
 * @param {object} options - Mongoose options for the update.
 * @returns {Promise<Document|null>}
 */
export const findByIdAndUpdate = async (
  id,
  update,
  options,
  populateOptions
) => {
  const doc = await MenuModel.findByIdAndUpdate(id, update, options);
  if (doc && populateOptions) {
    return doc.populate(populateOptions);
  }
  return doc;
};

/**
 * Counts documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<number>}
 */
export const countDocuments = async filter => {
  return MenuModel.countDocuments(filter);
};

/**
 * Updates multiple documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @param {object} update - The update object.
 * @returns {Promise<object>}
 */
export const updateMany = async (filter, update) => {
  return MenuModel.updateMany(filter, update);
};

/**
 * Finds the distinct values for a specified field.
 * @param {string} field - The field for which to find distinct values.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<Array<any>>}
 */
export const distinct = async (field, filter) => {
  return MenuModel.distinct(field, filter);
};
