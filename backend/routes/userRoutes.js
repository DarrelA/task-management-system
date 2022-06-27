const express = require('express');

const router = express.Router();
const { register, updateUser } = require('../controllers/userController');

router.route('/').post(register);
router.route('/:id').patch(updateUser);

module.exports = router;
