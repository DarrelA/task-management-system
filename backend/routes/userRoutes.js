const express = require('express');

const router = express.Router();
const { signup, updateUser } = require('../controllers/userController');

router.route('/signup').post(signup);
router.route('/:id').patch(updateUser);

module.exports = router;
