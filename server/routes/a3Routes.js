const express = require('express');

const { a3LoginMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

const {
  GetTaskbyState,
  CreateTask,
  PromoteTask2Done,
} = require('../controllers/a3Controller');

router.get('/get-task-by-state', a3LoginMiddleware, GetTaskbyState);
router.post('/create-new-task', a3LoginMiddleware, CreateTask);
router.post('/promote-task-to-done', a3LoginMiddleware, PromoteTask2Done);

module.exports = router;
