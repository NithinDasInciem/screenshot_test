import express from 'express';
import { protect } from '../../application/middlewares/auth.js';
import {
  userCreation,
  allUsers,
  allUsersbyrole,
  editUser,
  editUserRole,
  getUserById,
  deleteUser,
  getUser,
  updateUser,
  allUsersbyrolePagination,
} from '../controllers/userCreation.controller.js';
import {
  checkEmailExists,
  createUser,
} from '../controllers/logins.controller.js';

const router = express.Router();

// Bridge middleware to map authenticated user id to req.payload expected by controllers
const withUserId = (req, res, next) => {
  if (req.user && req.user._id) {
    req.payload = req.user._id;
  }
  next();
};

// Create user (requires auth)
router.post('/', protect, userCreation);
router.post('/creatingByHR', protect, createUser);

router.get('/getUser', protect, getUser);
// List users (requires auth)
router.get('/', protect, allUsers);
router.get('/role/:roleid', protect, allUsersbyrolePagination);
router.get('/byrole', allUsersbyrole);

// User CRUD/admin operations (requires auth)
router.put('/update-user', protect, updateUser);
router.put('/:id', protect, editUser);
router.patch('/:id/role', protect, editUserRole);
router.get('/:id', protect, getUserById);
router.delete('/:id', protect, deleteUser);

export default router;
