const express = require('express');

const {
  authMiddleware,
  appAccessRightsMiddleware,
} = require('../middleware/authMiddleware');

const router = express.Router();
const {
  getApplicationsData,
  createApplication,
  updateApplication,
} = require('../controllers/taskController');

router.get('/all', authMiddleware, getApplicationsData);

router.post(
  '/createapplication',
  authMiddleware,
  appAccessRightsMiddleware,
  createApplication
);

router.patch(
  '/updateapplication',
  authMiddleware,
  appAccessRightsMiddleware,
  updateApplication
);

module.exports = router;
