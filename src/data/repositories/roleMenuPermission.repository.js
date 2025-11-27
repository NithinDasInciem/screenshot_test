import roleMenuPermissionsModel from '../models/roleMenuPermissions.model.js';

/**
 * Finds multiple documents.
 * @param {object} filter - The Mongoose filter object.
 * @param {string|object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query (e.g., sort, skip, limit, populate, lean).
 * @returns {Promise<Array<Document>>}
 */
export const find = async (filter, projection, options) => {
  let query = roleMenuPermissionsModel.find(filter, projection);
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
  if (options?.lean) {
    query = query.lean();
  }
  return query.exec();
};

/**
 * Finds a single document.
 * @param {object} query - The Mongoose query object.
 * @returns {Promise<Document|null>}
 */
export const findOne = async query => {
  return roleMenuPermissionsModel.findOne(query);
};

/**
 * Finds a document by its ID.
 * @param {string} id - The document's ID.
 * @returns {Promise<Document|null>}
 */
export const findById = async id => {
  return roleMenuPermissionsModel.findById(id);
};

/**
 * Creates a new document.
 * @param {object} data - The data for the new document.
 * @returns {Promise<Document>}
 */
export const create = async data => {
  return roleMenuPermissionsModel.create(data);
};

/**
 * Updates multiple documents.
 * @param {object} filter - The Mongoose filter object.
 * @param {object} update - The update object.
 * @returns {Promise<object>}
 */
export const updateMany = async (filter, update) => {
  return roleMenuPermissionsModel.updateMany(filter, update);
};

/**
 * Performs a bulk write operation.
 * @param {Array<object>} operations - The array of bulk write operations.
 * @returns {Promise<object>}
 */
export const bulkWrite = async operations => {
  return roleMenuPermissionsModel.bulkWrite(operations);
};

/**
 * Counts documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<number>}
 */
export const countDocuments = async filter => {
  return roleMenuPermissionsModel.countDocuments(filter);
};

/**
 * Inserts multiple documents.
 * @param {Array<object>} docs - An array of documents to insert.
 * @returns {Promise<object>}
 */
export const insertMany = async docs => {
  return roleMenuPermissionsModel.insertMany(docs);
};
