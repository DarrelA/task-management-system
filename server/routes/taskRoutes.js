const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const { createApplication } = require('../controllers/taskController');

router.post('/createapplication', authMiddleware, createApplication);

module.exports = router;
