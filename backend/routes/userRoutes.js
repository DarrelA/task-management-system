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
} = require('../controllers/userController');

router.post('/refresh_token', checkRefreshToken);
router.post('/login', login);
router.post('/logout', logout);
router.post('/createuser', authMiddleware, createUser);

router.get('/all', authMiddleware, getAllUsers);

router.patch('/updateuser', authMiddleware, updateUser);
router.patch('/resetuserpassword', authMiddleware, resetUserPassword);

module.exports = router;
