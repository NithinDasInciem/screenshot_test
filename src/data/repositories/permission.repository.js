import PermissionModel from '../models/permission.model.js';

/**
 * Creates a new permission document.
 * @param {object} data - The data for the new permission.
 * @returns {Promise<Document>}
 */
export const create = async data => {
  return PermissionModel.create(data);
};

/**
 * Finds multiple permission documents that match a query.
 * @param {object} filter - The Mongoose filter object.
 * @param {string|object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query (e.g., sort, skip, limit, lean).
 * @returns {Promise<Array<Document>>}
 */
export const find = async (filter, projection, options) => {
  let query = PermissionModel.find(filter, projection);
  if (options?.sort) {
    query = query.sort(options.sort);
  }
  if (options?.skip) {
    query = query.skip(options.skip);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.lean) {
    query = query.lean();
  }
  return query.exec();
};

/**
 * Finds a single permission document by a query.
 * @param {object} query - The Mongoose query object.
 * @returns {Promise<Document|null>}
 */
export const findOne = async query => {
  return PermissionModel.findOne(query);
};

/**
 * Finds a permission document by its ID and updates it.
 * @param {object} filter - The Mongoose filter object.
 * @param {object} update - The update object.
 * @param {object} options - Mongoose options for the update.
 * @returns {Promise<Document|null>}
 */
export const findOneAndUpdate = async (filter, update, options) => {
  return PermissionModel.findOneAndUpdate(filter, update, options);
};

/**
 * Counts documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<number>}
 */
export const countDocuments = async filter => {
  return PermissionModel.countDocuments(filter);
};
