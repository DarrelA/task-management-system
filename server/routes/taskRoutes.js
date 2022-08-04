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
  getTasksData,
  createTask,
} = require('../controllers/taskController');

router.get('/applications/all', authMiddleware, getApplicationsData);

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

router.get('/:App_Acronym/all', authMiddleware, getTasksData);
router.post('/createtask', authMiddleware, appAccessRightsMiddleware, createTask);

module.exports = router;
