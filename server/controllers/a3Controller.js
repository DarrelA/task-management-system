const HttpError = require('../models/http-error');
const { Application, Plan, Task, Note } = require('../models/userTaskModel');
const { checkGroup } = require('./userController');

const GetTaskbyState = async (req, res, next) => {
  const Task_state = req.body.Task_state.toLowerCase();

  if (!Task_state) return next(new HttpError('Empty Field', 4006));
  if (!['open', 'todolist', 'doing', 'done', 'close'].includes(Task_state))
    return next(new HttpError('Invalid Field', 4005));

  try {
    const tasks = await Task.findAll({
      where: { Task_state },
      attributes: { exclude: ['Kanban_index', 'updatedAt', 'Task_plan'] },
      include: [
        { model: Plan, attributes: ['Plan_MVP_name', 'Plan_color'] },
        { model: Note, attributes: ['state', 'description', 'createdAt'] },
      ],
    });

    res.send({ success: { code: 200, data: tasks } });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 5000));
  }
};

const CreateTask = async (req, res, next) => {
  const { App_Acronym, Task_name, Task_description } = req.body;
  if (!Task_name) return next(new HttpError('Empty Field', 4006));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Invalid Field', 4005));

    // App_Rnumber matches Task_id running number
    // App_Rnumber starts at 0, add 1 task = running number at 1
    const runningNum = application.App_Rnumber + 1;
    application.App_Rnumber = runningNum;
    application.save();

    const task_name = await Task.findByPk(Task_name);
    if (!!task_name) return next(new HttpError('Duplicated', 4003));

    const newTask = await Task.create({
      Task_name,
      Task_description: Task_description,
      Task_id: application.App_Acronym + '_' + runningNum,
      Task_state: 'open',
      Task_creator: username,
      Task_owner: username,
      Task_app_Acronym: App_Acronym,
    });
    await newTask.save();

    const newNote = await Note.create({
      username: username,
      state: 'open',
      description: 'Task has been created.',
      taskTaskName: Task_name,
    });
    await newNote.save();

    res.send({
      success: { code: 200, Task_id: application.App_Acronym + '_' + runningNum },
    });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 5000));
  }
};

const PromoteTask2Done = async (req, res, next) => {
  const { username, Task_name } = req.body;
  if (!Task_name) return next(new HttpError('Empty Field', 4006));

  try {
    const task = await Task.findByPk(Task_name, {
      include: { model: Application, attributes: ['App_permit_Doing'] },
    });

    if (!task) return next(new HttpError('Invalid Field', 4005));
    if (task.Task_state !== 'doing')
      return next(new HttpError('Incorrect Transition', 4007));

    const haveAccessRights = await checkGroup(
      username,
      task.application.App_permit_Doing
    );
    if (!haveAccessRights) return next(new HttpError('Forbidden', 4002));

    task.Task_state = 'done';
    await task.save();

    res.send({ success: { code: 200 } });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 5000));
  }
};

module.exports = {
  GetTaskbyState,
  CreateTask,
  PromoteTask2Done,
};
