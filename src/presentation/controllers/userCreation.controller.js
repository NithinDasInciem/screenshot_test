import { Types } from 'mongoose';
import * as userService from '../../application/services/user.service.js';
import ApiError from '../../application/utils/ApiError.js';
import ApiResponse from '../../application/utils/ApiResponse.js';
Types.ObjectId;

export const userCreation = async (req, res, next) => {
  const userId = req.payload;
  const image = req.file ? req.file.filename : null;

  if (!userId) {
    throw new ApiError(403, 'Unauthorized access');
  }

  try {
    // Delegate business logic to the user service
    const userData = await userService.createUserAndLogin(
      req.body,
      userId,
      image
    );

    ApiResponse.created(
      'User and user login created successfully',
      userData
    ).send(res);
  } catch (err) {
    next(err);
  }
};

export const allUsers = async (req, res, next) => {
  try {
    // Delegate business logic to the user service
    const responseData = await userService.getAllUsers(req.query);

    ApiResponse.success('Users retrieved successfully', responseData).send(res);
  } catch (error) {
    next(error);
  }
};

export const allUsersbyrole = async (req, res, next) => {
  try {
    const roleid = req.query.roleId;

    // Delegate business logic to the user service
    const logins = await userService.getUsersByRole(roleid);

    ApiResponse.success('Users retrieved successfully', logins).send(res);
  } catch (error) {
    next(error);
  }
};

export const allUsersbyrolePagination = async (req, res, next) => {
  try {
    const roleid = req.params.roleid;

    // Delegate business logic to the user service
    const responseData = await userService.getUsersByRolePaginated(
      roleid,
      req.query
    );

    ApiResponse.success('Users retrieved successfully', responseData).send(res);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const { id } = req.params; // This is the user_id from the 'users' collection
    const image = req.file ? req.file.filename : null;

    // Delegate business logic to the user service
    const { user } = await userService.editUser(
      id,
      req.body,
      image,
      req.user?._id // The ID of the admin/user performing the update
    );

    // Respond with the updated user data
    ApiResponse.success('User updated successfully', user).send(res);
  } catch (err) {
    next(err);
  }
};

// assign role
export const editUserRole = async (req, res, next) => {
  try {
    const { id } = req.params; // This is the loginId
    const { roleId } = req.body;

    // Delegate business logic to the user service
    const updatedLogin = await userService.editUserRole(
      id,
      roleId,
      req.user?._id
    );

    // Respond with the updated user data
    ApiResponse.success('User role updated successfully', updatedLogin).send(
      res
    );
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the user service
    const user = await userService.getUserById(id);

    ApiResponse.success('User retrieved successfully', user).send(res);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delegate business logic to the user service
    const responseData = await userService.deleteUser(id, req.user?._id);

    ApiResponse.success('User deleted successfully', responseData).send(res);
  } catch (err) {
    next(err);
  }
};

// .................................get User for micro sevice .......................

export const getUser = async (req, res, next) => {
  try {
    const { decodedUserId } = req.query;
    // Delegate business logic to the user service
    const user = await userService.getUserForMicroservice(decodedUserId);
    ApiResponse.success('User retrieved successfully', user).send(res);
  } catch (err) {
    next(err);
  }
};

// .................................. update User Collction ..................
export const updateUser = async (req, res, next) => {
  try {
    // The ID of the user to update is taken from the authenticated session (req.user)
    // to ensure users can only update their own profile.
    const userId = req.user?._id;
    const image = req.file ? req.file.filename : null;
    console.log("Updating user profile for userId:", userId, "with data:", req.body);
    // Delegate business logic to the user service
    const updatedUser = await userService.updateUserProfile(
      req.body._id,
      req.body,
      userId,
      image
    );

    // Respond with the updated user data
    ApiResponse.success('User updated successfully', updatedUser).send(res);
  } catch (err) {
    next(err);
  }
};
