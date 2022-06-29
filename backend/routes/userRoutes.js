const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const {
  signup,
  login,
  checkRefreshToken,
  getAllUsers,
  updateUser,
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh_token', checkRefreshToken);

router.get('/all', authMiddleware, getAllUsers);

router.patch('/updateuser', authMiddleware, updateUser);

module.exports = router;
