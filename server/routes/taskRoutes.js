const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const {
  getApplicationsData,
  createApplication,
  updateApplication,
} = require('../controllers/taskController');

router.get('/all', authMiddleware, getApplicationsData);
router.post('/createapplication', authMiddleware, createApplication);
router.patch('/updateapplication', authMiddleware, updateApplication);

module.exports = router;
