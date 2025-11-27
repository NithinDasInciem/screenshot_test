import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import UserModel from '../../data/models/user.model.js';
import ApiError from '../utils/ApiError.js';
import * as roleRepository from '../../data/repositories/role.repository.js';
import * as loginRepository from '../../data/repositories/login.repository.js';


/**
 * Creates a new user and their corresponding login credentials.
 * @param {object} userData - The user's data from the request body.
 * @param {string} creatorId - The ID of the user creating this new user.
 * @param {string|null} image - The filename of the uploaded profile image.
 * @returns {Promise<{newUser: object, newLogin: object}>} The created user and login documents.
 */
export const createUserAndLogin = async (userData, creatorId, image) => {
  const { f_name, l_name, email, phone, password, roleId, address, post_code } =
    userData;

  if (!email || !password || !f_name || !roleId) {
    throw new ApiError(
      400,
      'First name, email, password, and role are required.'
    );
  }

  const existingUser = await UserModel.findOne({ email, isDeleted: false });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // NOTE: For maximum data integrity, creating the user and login should be wrapped in a database transaction.
  const newUser = await UserModel.create({
    f_name,
    l_name,
    profile_img: image,
    email,
    phone,
    role_id: roleId,
    address,
    post_code,
    created_by: creatorId,
    updated_by: creatorId,
  });

  const newLogin = await loginRepository.create({
    username: `${f_name} ${l_name}`,
    email,
    password: hashedPassword,
    user_id: newUser._id,
    role_id: roleId,
    created_by: creatorId,
    updated_by: creatorId,
    passwordResetRequired: true, // Mark for initial reset
  });

  return { newUser, newLogin };
};

/**
 * Retrieves a paginated and searchable list of all users.
 * @param {object} queryParams - The query parameters for filtering and pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @param {string} [queryParams.search=''] - A search term.
 * @returns {Promise<object>} An object with users and pagination info.
 */
export const getAllUsers = async queryParams => {
  // Pagination
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Search
  const searchTerm = queryParams.search?.trim() || '';

  // Fetch roles to exclude "Admin"
  const excludedRoles = await roleRepository.find(
    { role_name: { $in: ['Admin'] }, isDeleted: false },
    '_id'
  );
  const excludedRoleIds = excludedRoles.map(role => role._id);

  // Base match stage for the pipeline
  const matchStage = {
    isDeleted: false,
    role_id: { $nin: excludedRoleIds },
  };

  if (searchTerm) {
    matchStage.$or = [
      { 'userData.f_name': { $regex: searchTerm, $options: 'i' } },
      { 'userData.l_name': { $regex: searchTerm, $options: 'i' } },
      { 'userData.email': { $regex: searchTerm, $options: 'i' } },
      { 'userData.phone': { $regex: searchTerm, $options: 'i' } },
      { 'userData.address': { $regex: searchTerm, $options: 'i' } },
      { username: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Aggregation pipeline to fetch user details
  const pipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role_id',
        foreignField: '_id',
        as: 'roleData',
      },
    },
    { $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
    { $match: matchStage },
  ];

  // Run queries concurrently for better performance
  const [logins, totalItemsResult] = await Promise.all([
    loginRepository.aggregate([
      ...pipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]),
    loginRepository.aggregate([...pipeline, { $count: 'total' }]),
  ]);

  const totalItems = totalItemsResult[0]?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const responseData = {
    users: logins,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  };

  return responseData;
};

/**
 * Retrieves all users belonging to a specific role.
 * @param {string} roleId - The ID of the role to filter users by.
 * @returns {Promise<Array>} A list of user/login documents.
 */
export const getUsersByRole = async roleId => {
  if (!roleId) {
    throw new ApiError(400, 'Role ID is required.');
  }

  // Aggregation pipeline to fetch user details from users collection
  const pipeline = [
    {
      $lookup: {
        from: 'roles',
        localField: 'role_id',
        foreignField: '_id',
        as: 'roleData',
      },
    },
    { $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true } },
    {
      $match: {
        isDeleted: false,
        role_id: new mongoose.Types.ObjectId(roleId),
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const logins = await loginRepository.aggregate(pipeline);
  return logins;
};

/**
 * Retrieves a paginated and searchable list of users for a specific role.
 * @param {string} roleId - The ID of the role to filter users by.
 * @param {object} queryParams - The query parameters for filtering and pagination.
 * @param {number} [queryParams.page=1] - The current page.
 * @param {number} [queryParams.limit=10] - The number of items per page.
 * @param {string} [queryParams.search=''] - A search term.
 * @returns {Promise<object>} An object with users and pagination info.
 */
export const getUsersByRolePaginated = async (roleId, queryParams) => {
  if (!roleId) {
    throw new ApiError(400, 'Role ID is required.');
  }

  // Pagination
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Search
  const searchTerm = queryParams.search?.trim() || '';

  // Base match stage for the pipeline
  const matchStage = {
    isDeleted: false,
    role_id: new mongoose.Types.ObjectId(roleId),
  };

  if (searchTerm) {
    matchStage.$or = [
      { 'userData.f_name': { $regex: searchTerm, $options: 'i' } },
      { 'userData.l_name': { $regex: searchTerm, $options: 'i' } },
      { 'userData.email': { $regex: searchTerm, $options: 'i' } },
      { 'userData.phone': { $regex: searchTerm, $options: 'i' } },
      { 'userData.address': { $regex: searchTerm, $options: 'i' } },
      { username: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Aggregation pipeline to fetch user details
  const pipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role_id',
        foreignField: '_id',
        as: 'roleData',
      },
    },
    { $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
    { $match: matchStage },
  ];

  // Run queries concurrently for better performance
  const [logins, totalItemsResult] = await Promise.all([
    loginRepository.aggregate([
      ...pipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]),
    loginRepository.aggregate([...pipeline, { $count: 'total' }]),
  ]);

  const totalItems = totalItemsResult[0]?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    users: logins,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  };
};

/**
 * Updates a user's profile and login information.
 * @param {string} userId - The ID of the user to update (from the 'users' collection).
 * @param {object} updateData - The data to update.
 * @param {string|null} image - The filename of the new profile image, if any.
 * @param {string} updaterId - The ID of the user performing the update.
 * @returns {Promise<{user: object, login: object}>} The updated user and login documents.
 */
export const editUser = async (userId, updateData, image, updaterId) => {
  const { f_name, l_name, email, phone, password, roleId, address, post_code } =
    updateData;

  if (!f_name || !email || !roleId) {
    throw new ApiError(400, 'First name, email, and roleId are required.');
  }

  // NOTE: For maximum data integrity, these operations should be wrapped in a database transaction.
  const [user, login] = await Promise.all([
    UserModel.findById(userId),
    loginRepository.findOne({ user_id: userId }),
  ]);

  if (!user || !login) {
    throw new ApiError(404, 'User or associated login not found.');
  }

  // Check for email conflicts if the email is being changed
  if (email && email !== user.email) {
    const existing = await loginRepository.findOne({
      email,
      _id: { $ne: login._id },
    });
    if (existing) {
      throw new ApiError(
        409,
        'This email address is already in use by another account.'
      );
    }
    user.email = email;
    login.email = email;
  }

  // Update user profile fields
  user.f_name = f_name;
  user.l_name = l_name;
  user.phone = phone;
  user.address = address;
  user.post_code = post_code;
  user.role_id = roleId;
  user.updated_by = updaterId;
  if (image) {
    user.profile_img = image;
  }

  // Update login fields
  login.username = `${f_name} ${l_name}`;
  login.role_id = roleId;
  login.updated_by = updaterId;

  // Update password if a new one is provided
  if (password) {
    login.password = await bcrypt.hash(password, 10);
  }

  await Promise.all([user.save(), login.save()]);

  return { user, login };
};

/**
 * Updates a user's role and invalidates their existing tokens.
 * @param {string} loginId - The ID of the login document to update.
 * @param {string} newRoleId - The ID of the new role.
 * @param {string} updaterId - The ID of the user performing the update.
 * @returns {Promise<object>} The updated login document.
 */
export const editUserRole = async (loginId, newRoleId, updaterId) => {
  if (!loginId || !newRoleId) {
    throw new ApiError(400, 'User ID and Role ID are required.');
  }

  // Check if the target role exists
  const roleExists = await roleRepository.findById(newRoleId);
  if (!roleExists) {
    throw new ApiError(404, 'The specified role was not found.');
  }

  // NOTE: For maximum data integrity, these operations should be wrapped in a database transaction.
  const [user, login] = await Promise.all([
    UserModel.findOne({ 'logins._id': loginId }), // Assuming a reference if needed, or find by another key
    loginRepository.findById(loginId),
  ]);

  if (!login) {
    throw new ApiError(404, 'User login record not found.');
  }

  // Update role in both collections for consistency
  login.role_id = newRoleId;
  login.updated_by = updaterId;
  // Invalidate existing tokens by updating the permissions timestamp.
  // This forces the user to log in again to get a new token with updated permissions.
  login.permissionsUpdatedAt = new Date();

  if (user) {
    user.role_id = newRoleId;
    user.updated_by = updaterId;
    await user.save();
  }

  await login.save();
  return login;
};

/**
 * Retrieves a single user by their ID.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<object>} The user document.
 */
export const getUserById = async userId => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required.');
  }

  // Find the user, ensuring they are not soft-deleted.
  const user = await UserModel.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

/**
 * Soft deletes a user and their associated login credentials.
 * @param {string} userId - The ID of the user to delete (from the 'users' collection).
 * @param {string} deleterId - The ID of the user performing the deletion.
 * @returns {Promise<{deletedUser: string, id: string}>} An object with details of the deleted user.
 */
export const deleteUser = async (userId, deleterId) => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required for deletion.');
  }

  // NOTE: For maximum data integrity, these operations should be wrapped in a database transaction.
  const [user, login] = await Promise.all([
    UserModel.findOne({ _id: userId, isDeleted: false }),
    loginRepository.findOne({ user_id: userId, isDeleted: false }),
  ]);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Soft delete both the user profile and the login record
  user.isDeleted = true;
  user.updated_by = deleterId;

  if (login) {
    login.isDeleted = true;
    login.updated_by = deleterId;
    await login.save();
  }

  await user.save();

  return {
    deletedUser: `${user.f_name} ${user.l_name}` || user.email,
    id: user._id,
  };
};

/**
 * Retrieves a single user by their ID, intended for microservice communication.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<object>} The user document without the password.
 */
export const getUserForMicroservice = async userId => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required.');
  }

  // Find the user by ID and exclude the password field.
  const user = await UserModel.findById(userId).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found for the given ID.');
  }

  return user;
};

/**
 * Allows a user to update their own profile information.
 * @param {string} userId - The ID of the user performing the update (from the auth token).
 * @param {object} updateData - The data to update.
 * @param {string|null} image - The filename of the new profile image, if any.
 * @returns {Promise<object>} The updated user document.
 */
export const updateUserProfile = async ( id,updateData,userId,image) => {
  
  if (!userId) {
    throw new ApiError(401, 'User not authenticated for this action.');
  }

  const user = await UserModel.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Destructure only the fields that are allowed to be updated by the user.
  const { f_name, l_name, phone, address, city, state, zip_code , role_id} = updateData;
  
  // Build the update object with the provided data.
  const fieldsToUpdate = {
    f_name,
    l_name,
    phone,
    address,
    city,
    state,
    zip_code,
    role_id,
    updated_by: userId,
  };

  // If a new image is uploaded, add it to the update object.
  if (image) {
    fieldsToUpdate.profile_img = image;
  }

  // Find the user by their own ID and update the fields.
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true } // Return the updated document and run schema validators
  );
  console.log("Updated user document:", updatedUser);

  if (!updatedUser) {
    throw new ApiError(404, 'User not found.');
  }


  return updatedUser;
};
