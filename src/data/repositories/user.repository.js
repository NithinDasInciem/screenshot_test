import UserModel from '../models/user.model.js';

/**
 * Finds a single user document by a query.
 * @param {object} query - The Mongoose query object.
 * @returns {Promise<Document|null>}
 */
export const findOne = async query => {
  return UserModel.findOne(query);
};

/**
 * Finds a user document by its ID.
 * @param {string} id - The user's ID.
 * @returns {Promise<Document|null>}
 */
export const findById = async id => {
  return UserModel.findById(id);
};

/**
 * Creates a new user document.
 * @param {object} data - The data for the new user.
 * @returns {Promise<Document>}
 */
export const create = async data => {
  return UserModel.create(data);
};

/**
 * Counts documents that match a filter.
 * @param {object} filter - The Mongoose filter object.
 * @returns {Promise<number>}
 */
export const countDocuments = async filter => {
  return UserModel.countDocuments(filter);
};
