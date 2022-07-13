const express = require('express');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

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
  checkGroup,
  updateProfile,
} = require('../controllers/userController');

// Routes for /um/... is for User Management (Admin acc required)

router.post('/refresh_token', checkRefreshToken);
router.post('/login', login);
router.post('/logout', logout);

router
  .route('/um/user')
  .post(authMiddleware, adminMiddleware, createUser)
  .patch(authMiddleware, adminMiddleware, updateUser);

router.post('/um/creategroup', authMiddleware, adminMiddleware, createGroup);
router.post('/um/checkgroup', authMiddleware, adminMiddleware, checkGroup);

router.get('/um/all', authMiddleware, adminMiddleware, getUsersData);

router.patch('/um/resetuserpassword', authMiddleware, adminMiddleware, resetUserPassword);
router.patch('/updateprofile', authMiddleware, updateProfile);

module.exports = router;
