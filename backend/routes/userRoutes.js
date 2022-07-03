const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const {
  checkRefreshToken,
  login,
  getAllUsers,
  createUser,
  updateUser,
} = require('../controllers/userController');

router.post('/refresh_token', checkRefreshToken);
router.post('/login', login);
router.post('/createuser', authMiddleware, createUser);

router.get('/all', authMiddleware, getAllUsers);

router.patch('/updateuser', authMiddleware, updateUser);

module.exports = router;
