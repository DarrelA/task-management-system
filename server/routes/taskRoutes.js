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
  updateTask,
  updateTaskState,
  updateKanbanIndex,
  getPlansData,
  createPlan,
  updatePlan,
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
  .patch(authMiddleware, appAccessRightsMiddleware, updateTask);

router.patch('/taskstate', authMiddleware, appAccessRightsMiddleware, updateTaskState);
router.patch(
  '/kanbanindex',
  authMiddleware,
  appAccessRightsMiddleware,
  updateKanbanIndex
);

router.get('/:App_Acronym/plans', authMiddleware, getPlansData);

router.route('/plan').post(authMiddleware, appAccessRightsMiddleware, createPlan);
// .patch(authMiddleware, updatePlan);

module.exports = router;
