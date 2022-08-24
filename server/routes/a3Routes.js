const express = require('express');
const HttpError = require('../models/http-error.js');

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

/* *************************************************************************** */

// Testing for a4
router.post('/a4test', async (req, res, next) => {
  try {
    res.send({
      code: 200,
      data: 'Connection to a4test route without communicating with mysql',
      body: req.body,
    });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
});

/* *************************************************************************** */

module.exports = router;
