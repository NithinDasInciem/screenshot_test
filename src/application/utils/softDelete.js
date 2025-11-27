/**
 * Soft Delete Utilities
 * Provides helper functions for implementing consistent soft delete functionality
 */

/**
 * Default filter to exclude soft deleted records
 * @returns {Object} Filter object to exclude soft deleted records
 */
export const getActiveFilter = () => ({ isDeleted: false });

/**
 * Combine user filter with soft delete filter
 * @param {Object} userFilter - User provided filter
 * @returns {Object} Combined filter including soft delete exclusion
 */
export const combineWithActiveFilter = (userFilter = {}) => ({
  ...userFilter,
  isDeleted: false,
});

/**
 * Soft delete a single document
 * @param {Object} model - Mongoose model
 * @param {String} id - Document ID
 * @param {String} updatedBy - ID of user performing the delete (optional)
 * @returns {Promise} Updated document
 */
export const softDeleteById = async (model, id, updatedBy = null) => {
  const updateData = {
    isDeleted: true,
    ...(updatedBy && { updated_by: updatedBy })
  };
  
  return await model.findByIdAndUpdate(id, updateData, { new: true });
};

/**
 * Soft delete multiple documents by filter
 * @param {Object} model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @param {String} updatedBy - ID of user performing the delete (optional)
 * @returns {Promise} Update result
 */
export const softDeleteMany = async (model, filter, updatedBy = null) => {
  const updateData = {
    isDeleted: true,
    ...(updatedBy && { updated_by: updatedBy })
  };
  
  return await model.updateMany(
    combineWithActiveFilter(filter),
    updateData
  );
};

/**
 * Restore a soft deleted document
 * @param {Object} model - Mongoose model
 * @param {String} id - Document ID
 * @param {String} updatedBy - ID of user performing the restore (optional)
 * @returns {Promise} Updated document
 */
export const restoreById = async (model, id, updatedBy = null) => {
  const updateData = {
    isDeleted: false,
    ...(updatedBy && { updated_by: updatedBy })
  };
  
  return await model.findByIdAndUpdate(id, updateData, { new: true });
};

/**
 * Find active (non-deleted) documents
 * @param {Object} model - Mongoose model
 * @param {Object} filter - Additional filter criteria
 * @param {Object} options - Query options (projection, sort, etc.)
 * @returns {Promise} Query result
 */
export const findActive = async (model, filter = {}, options = {}) => {
  return await model.find(combineWithActiveFilter(filter), options.projection, options);
};

/**
 * Find one active (non-deleted) document
 * @param {Object} model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (projection, etc.)
 * @returns {Promise} Document or null
 */
export const findOneActive = async (model, filter = {}, options = {}) => {
  return await model.findOne(combineWithActiveFilter(filter), options.projection, options);
};

/**
 * Find active document by ID
 * @param {Object} model - Mongoose model
 * @param {String} id - Document ID
 * @param {Object} options - Query options (projection, etc.)
 * @returns {Promise} Document or null
 */
export const findActiveById = async (model, id, options = {}) => {
  return await model.findOne(
    combineWithActiveFilter({ _id: id }), 
    options.projection, 
    options
  );
};

/**
 * Count active (non-deleted) documents
 * @param {Object} model - Mongoose model
 * @param {Object} filter - Additional filter criteria
 * @returns {Promise} Count
 */
export const countActive = async (model, filter = {}) => {
  return await model.countDocuments(combineWithActiveFilter(filter));
};

/**
 * Get aggregation pipeline stage to exclude soft deleted records
 * @returns {Object} Aggregation match stage
 */
export const getActiveMatchStage = () => ({
  $match: { isDeleted: false }
});

/**
 * Paginate active documents
 * @param {Object} model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Pagination options { page, limit, sort, projection }
 * @returns {Promise} Paginated result with data and pagination info
 */
export const paginateActive = async (model, filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = {}, projection } = options;
  const skip = (page - 1) * limit;
  
  const activeFilter = combineWithActiveFilter(filter);
  
  const [data, totalCount] = await Promise.all([
    model
      .find(activeFilter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    model.countDocuments(activeFilter)
  ]);
  
  return {
    data,
    pagination: {
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    }
  };
};

/**
 * Middleware to automatically add isDeleted filter to find operations
 * Add this to your schema as a pre-hook for find operations
 */
export const addSoftDeleteMiddleware = (schema) => {
  // Add pre hooks for find operations
  schema.pre(['find', 'findOne', 'findOneAndUpdate', 'count', 'countDocuments'], function() {
    if (!this.getQuery().hasOwnProperty('isDeleted')) {
      this.where({ isDeleted: { $ne: true } });
    }
  });
  
  // Add method to include deleted records
  schema.methods.withDeleted = function() {
    return this.model.find().setOptions({ includeDeleted: true });
  };
  
  // Add method to find only deleted records
  schema.methods.onlyDeleted = function() {
    return this.model.find({ isDeleted: true });
  };
};

export default {
  getActiveFilter,
  combineWithActiveFilter,
  softDeleteById,
  softDeleteMany,
  restoreById,
  findActive,
  findOneActive,
  findActiveById,
  countActive,
  getActiveMatchStage,
  paginateActive,
  addSoftDeleteMiddleware
};
