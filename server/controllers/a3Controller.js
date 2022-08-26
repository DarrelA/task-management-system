const HttpError = require('../models/http-error');
const { Application, Plan, Task, Note } = require('../models/userTaskModel');
const { checkGroup } = require('./userController');
const { sendMailTrapEmail } = require('./taskController');

const GetTaskbyState = async (req, res, next) => {
  // Check for JSON key is invalid or misspelt
  const correctKeys = ['task_state'];
  const isCorrect = correctKeys.every((correctKey) =>
    res.inputKeys.hasOwnProperty(correctKey)
  );
  if (!isCorrect) return next(new HttpError('Invalid JSON Key.', 4008));

  const task_state = res.inputKeys.task_state.toLowerCase();

  if (!task_state) return next(new HttpError('Empty Field', 4006));
  if (!['open', 'todolist', 'doing', 'done', 'close'].includes(task_state))
    return next(new HttpError('Invalid Field', 4005));

  try {
    const tasks = await Task.findAll({
      where: { task_state },
      attributes: { exclude: ['Kanban_index', 'updatedAt', 'Task_plan'] },
      include: [
        { model: Plan, attributes: ['Plan_MVP_name', 'Plan_color'] },
        { model: Note, attributes: ['state', 'description', 'createdAt'] },
      ],
    });

    res.send({ code: 200, data: tasks });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 5000));
  }
};

const CreateTask = async (req, res, next) => {
  // Check for JSON key is invalid or misspelt
  const correctKeys = ['app_acronym', 'task_name', 'task_description'];
  const isCorrect = correctKeys.every((correctKey) =>
    res.inputKeys.hasOwnProperty(correctKey)
  );
  if (!isCorrect) return next(new HttpError('Invalid JSON Key.', 4008));

  const { username, app_acronym, task_name, task_description } = res.inputKeys;
  if (!app_acronym || !task_name) return next(new HttpError('Empty Field', 4006));

  try {
    const application = await Application.findByPk(app_acronym);
    if (!application) return next(new HttpError('Invalid Field', 4005));

    const haveAccessRights = await checkGroup(username, application.App_permit_Create);
    if (!haveAccessRights) return next(new HttpError('Forbidden', 4002));

    // App_Rnumber matches Task_id running number
    // App_Rnumber starts at 0, add 1 task = running number at 1
    const runningNum = application.App_Rnumber + 1;
    application.App_Rnumber = runningNum;
    application.save();

    const duplicateTask = await Task.findByPk(task_name);
    if (!!duplicateTask) return next(new HttpError('Duplicated', 4003));

    const newTask = await Task.create({
      Task_name: task_name,
      Task_description: task_description,
      Task_id: application.App_Acronym + '_' + runningNum,
      Task_state: 'open',
      Task_creator: username,
      Task_owner: username,
      Task_app_Acronym: app_acronym,
    });
    await newTask.save();

    const newNote = await Note.create({
      username: username,
      state: 'open',
      description: 'Task has been created.',
      taskTaskName: task_name,
    });
    await newNote.save();

    res.send({
      code: 200,
      Task_id: application.App_Acronym + '_' + runningNum,
    });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 5000));
  }
};

const PromoteTask2Done = async (req, res, next) => {
  // Check for JSON key is invalid or misspelt
  const correctKeys = ['task_name'];
  const isCorrect = correctKeys.every((correctKey) =>
    res.inputKeys.hasOwnProperty(correctKey)
  );
  if (!isCorrect) return next(new HttpError('Invalid JSON Key.', 4008));

  const { username, task_name } = res.inputKeys;

  if (!task_name) return next(new HttpError('Empty Field', 4006));

  try {
    const task = await Task.findByPk(task_name, {
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

    sendMailTrapEmail(username, task_name, task.Task_state, 'done');

    task.Task_state = 'done';
    await task.save();

    res.send({ code: 200 });
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
