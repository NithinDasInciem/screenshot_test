import RoleModel from '../models/roles.model.js';

/**
 * Creates a new role document.
 * @param {object} data - The data for the new role.
 * @returns {Promise<Document>}
 */
export const create = async data => {
  return RoleModel.create(data);
};

/**
 * Finds multiple role documents that match a query.
 * @param {object} filter - The Mongoose filter object.
 * @param {string|object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query.
 * @returns {Promise<Array<Document>>}
 */
export const find = async (filter, projection, options) => {
  let query = RoleModel.find(filter, projection, options);
  return query.exec();
};

/**
 * Finds a single role document by a query.
 * @param {object} query - The Mongoose query object.
 * @param {string | object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query (e.g., lean).
 * @returns {Promise<Document|object|null>}
 */
export const findOne = async (query, projection, options) => {
  let q = RoleModel.findOne(query, projection, options);
  return q.exec();
};

/**
 * Finds a role document by its ID.
 * @param {string} id - The role's ID.
 * @param {string | object} [projection] - The fields to select or exclude.
 * @param {object} [options] - Mongoose options for the query.
 * @returns {Promise<Document|null>}
 */
export const findById = async (id, projection, options) => {
  return RoleModel.findById(id, projection, options);
};

/**
 * Finds a role by ID and updates it.
 * @param {string} id - The role's ID.
 * @param {object} update - The update object.
 * @param {object} options - Mongoose options for the update.
 * @returns {Promise<Document|null>}
 */
export const findByIdAndUpdate = async (id, update, options) => {
  return RoleModel.findByIdAndUpdate(id, update, options);
};

/**
 * Counts documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<number>}
 */
export const countDocuments = async filter => {
  return RoleModel.countDocuments(filter);
};

/**
 * Executes an aggregation pipeline.
 * @param {Array<object>} pipeline - The aggregation pipeline stages.
 * @returns {Promise<Array<any>>}
 */
export const aggregate = async pipeline => {
  return RoleModel.aggregate(pipeline);
};

/**
 * Finds the distinct values for a specified field.
 * @param {string} field - The field for which to find distinct values.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<Array<any>>}
 */
export const distinct = async (field, filter) => {
  return RoleModel.distinct(field, filter);
};
