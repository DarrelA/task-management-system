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
  getAllTasksData,
  getTaskData,
  createTask,
  updateTask,
  updateTaskState,
  updateKanbanIndex,
  getPlansData,
  createPlan,
} = require('../controllers/taskController');

router.get('/applications/all', authMiddleware, getApplicationsData);

router
  .route('/application')
  .post(authMiddleware, appAccessRightsMiddleware, createApplication)
  .patch(authMiddleware, appAccessRightsMiddleware, updateApplication);

router.get('/:App_Acronym/all', authMiddleware, getAllTasksData);
router.get('/:App_Acronym/task/:Task_name', authMiddleware, getTaskData);

router
  .route('/task')
  .post(authMiddleware, appAccessRightsMiddleware, createTask)
  .patch(authMiddleware, appAccessRightsMiddleware, updateTask);

router.patch('/taskstate', authMiddleware, appAccessRightsMiddleware, updateTaskState);
router.patch('/kanbanindex', authMiddleware, updateKanbanIndex);

router.get('/:App_Acronym/plans', authMiddleware, getPlansData);

router.route('/plan').post(authMiddleware, appAccessRightsMiddleware, createPlan);

module.exports = router;
