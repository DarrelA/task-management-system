const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const {
  checkRefreshToken,
  login,
  logout,
  getUsersData,
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

router
  .route('/um/user')
  .post(authMiddleware, createUser)
  .patch(authMiddleware, updateUser);

router.post('/um/creategroup', authMiddleware, createGroup);
router.post('/um/addremoveusergroup', authMiddleware, addRemoveUserGroup);

router.get('/um/all', authMiddleware, getUsersData);

router.patch('/um/resetuserpassword', authMiddleware, resetUserPassword);
router.patch('/updateprofile', authMiddleware, updateProfile);

module.exports = router;
