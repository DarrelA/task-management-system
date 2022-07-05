const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const {
  checkRefreshToken,
  login,
  logout,
  getAllUsers,
  createUser,
  resetUserPassword,
  updateUser,
  createGroup,
  addRemoveUserGroup,
  updateProfile,
} = require('../controllers/userController');

// Routes for /um/... is for User Management (Admin acc required)

router.post('/refresh_token', checkRefreshToken);
router.post('/login', login);
router.post('/logout', logout);
router.post('/um/createuser', authMiddleware, createUser);
router.post('/um/creategroup', authMiddleware, createGroup);
router.post('/um/addremoveusergroup', authMiddleware, addRemoveUserGroup);

router.get('/um/all', authMiddleware, getAllUsers);

router.patch('/um/resetuserpassword', authMiddleware, resetUserPassword);
router.patch('/um/updateuser', authMiddleware, updateUser);
router.patch('/updateprofile', authMiddleware, updateProfile);

module.exports = router;
