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
  updateTaskState,
} = require('../controllers/taskController');

router.get('/applications/all', authMiddleware, getApplicationsData);

router
  .route('/application')
  .post(authMiddleware, appAccessRightsMiddleware, createApplication)
  .patch(authMiddleware, appAccessRightsMiddleware, updateApplication);

router.get('/:App_Acronym/all', authMiddleware, getTasksData);

router
  .route('/task')
  .post(authMiddleware, appAccessRightsMiddleware, createTask)
  .patch(authMiddleware, appAccessRightsMiddleware, updateTaskState);

module.exports = router;
