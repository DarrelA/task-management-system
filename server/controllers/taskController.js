const { Application, Plan, Task, Note, Group } = require('../models/userTaskModel');
const HttpError = require('../models/http-error');

const getApplicationsData = async (req, res, next) => {
  try {
    const max_App_Rnumber = await Application.max('App_Rnumber');
    const applications = await Application.findAll({
      attributes: { exclude: ['createdAt'] },
    });

    const groups = await Group.findAll({ attributes: ['name'] });

    return res.send({ applications, max_App_Rnumber, groups });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createApplication = async (req, res, next) => {
  const {
    App_Acronym,
    App_Description,
    App_startDate,
    App_endDate,
    App_permit_Open,
    App_permit_toDoList,
    App_permit_Doing,
    App_permit_Done,
  } = req.body;

  let { App_Rnumber } = req.body;

  if (!App_Acronym) return next(new HttpError('Application acronym is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!!application) return next(new HttpError('Application acronym is taken.', 400));

    if (App_permit_Open) {
      const openGroup = await Group.findByPk(App_permit_Open);
      if (!openGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
    if (App_permit_toDoList) {
      const toDoGroup = await Group.findByPk(App_permit_toDoList);
      if (!toDoGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
    if (App_permit_Doing) {
      const doingGroup = await Group.findByPk(App_permit_Doing);
      if (!doingGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
    if (App_permit_Done) {
      const doneGroup = await Group.findByPk(App_permit_Done);
      if (!doneGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }

    // if at least 1 app exist in db, auto increment App_Rnumber
    const max_App_Rnumber = await Application.max('App_Rnumber');
    if (max_App_Rnumber) App_Rnumber = '';

    const newApplication = await Application.create({
      App_Acronym,
      App_Description,
      App_Rnumber: App_Rnumber || max_App_Rnumber + 1,
      App_startDate: App_startDate || null,
      App_endDate: App_endDate || null,
      App_permit_Open: App_permit_Open || null,
      App_permit_toDoList: App_permit_toDoList || null,
      App_permit_Doing: App_permit_Doing || null,
      App_permit_Done: App_permit_Done || null,
    });
    await newApplication.save();
    res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateApplication = async (req, res, next) => {
  const {
    App_Acronym,
    App_Description,
    App_startDate,
    App_endDate,
    App_permit_Open,
    App_permit_toDoList,
    App_permit_Doing,
    App_permit_Done,
  } = req.body;

  if (!App_Acronym) return next(new HttpError('Application acronym is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    if (App_permit_Open) {
      const openGroup = await Group.findByPk(App_permit_Open);
      if (!openGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
    if (App_permit_toDoList) {
      const toDoGroup = await Group.findByPk(App_permit_toDoList);
      if (!toDoGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
    if (App_permit_Doing) {
      const doingGroup = await Group.findByPk(App_permit_Doing);
      if (!doingGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
    if (App_permit_Done) {
      const doneGroup = await Group.findByPk(App_permit_Done);
      if (!doneGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }

    application.App_Description = App_Description || null;
    if (App_startDate) application.App_startDate = App_startDate;
    if (App_endDate) application.App_endDate = App_endDate;
    application.App_permit_Open = App_permit_Open || null;
    application.App_permit_toDoList = App_permit_toDoList || null;
    application.App_permit_Doing = App_permit_Doing || null;
    application.App_permit_Done = App_permit_Done || null;

    await application.save();
    res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const getTasksData = async (req, res, next) => {
  try {
    const hasAppInDB = await Application.findByPk(req.params.App_Acronym);
    if (!hasAppInDB) return next(new HttpError('Application is unavailable.', 400));

    let appTasks = await Task.findAll({
      where: { Task_app_Acronym: req.params.App_Acronym },
      attributes: { exclude: ['createdAt'] },
      order: [['Kanban_index', 'ASC']],
    });

    // Get only dataValues from Sequelize ORM
    appTasks = JSON.stringify(appTasks);
    appTasks = JSON.parse(appTasks);

    let tasks = {
      open: { name: 'Open', items: [] },
      todolist: { name: 'To Do List', items: [] },
      doing: { name: 'Doing', items: [] },
      done: { name: 'Done', items: [] },
      close: { name: 'Close', items: [] },
    };

    appTasks.forEach((task) => {
      switch (task.Task_state) {
        case 'open':
          tasks.open.items.push(task);
          break;
        case 'todolist':
          tasks.todolist.items.push(task);
          break;
        case 'doing':
          tasks.doing.items.push(task);
          break;
        case 'done':
          tasks.done.items.push(task);
          break;
        case 'close':
          tasks.close.items.push(task);
          break;
      }
    });

    return res.send({ tasks });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createTask = async (req, res, next) => {
  const { App_Acronym, Task_name, Task_description, Task_plan } = req.body;

  if (!Task_name) return next(new HttpError('Task name is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    const task_name = await Task.findByPk(Task_name);
    if (!!task_name) return next(new HttpError('Task name is taken.', 400));

    const newTask = await Task.create({
      Task_name,
      Task_description: Task_description || null,
      Task_id: application.App_Acronym + application.App_Rnumber,
      Task_state: 'open',
      Task_creator: req.user.username,
      Task_owner: req.user.username,
      Task_app_Acronym: App_Acronym,
      Task_plan: Task_plan || null,
    });
    await newTask.save();
    res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateTaskState = async (req, res, next) => {
  const { Task_name, Task_state } = req.body;
  const task = await Task.findByPk(Task_name);

  if (!task) return next(new HttpError('Task not found.', 400));
  if (
    Task_state !== 'open' &&
    Task_state !== 'todolist' &&
    Task_state !== 'doing' &&
    Task_state !== 'done' &&
    Task_state !== 'close'
  )
    return next(new HttpError('Invalid task state.', 400));

  if (
    (task.Task_state === 'open' && Task_state !== 'open' && Task_state !== 'todolist') ||
    (task.Task_state === 'todolist' &&
      Task_state !== 'todolist' &&
      Task_state !== 'doing') ||
    (task.Task_state === 'doing' &&
      Task_state !== 'doing' &&
      Task_state !== 'todolist' &&
      Task_state !== 'done') ||
    (task.Task_state === 'done' &&
      Task_state !== 'done' &&
      Task_state !== 'doing' &&
      Task_state !== 'close') ||
    (task.Task_state === 'close' && Task_state !== 'close')
  )
    return next(new HttpError('Not allowed.', 400));

  try {
    task.Task_state = Task_state;
    await task.save();
    return res.send({ success: true });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateKanbanIndex = async (req, res, next) => {
  const openItems = req.body.tasksList.open?.items;
  const todolistItems = req.body.tasksList.todolist?.items;
  const doingItems = req.body.tasksList.doing?.items;
  const doneItems = req.body.tasksList.done?.items;
  const closeItems = req.body.tasksList.close?.items;

  try {
    if (!!openItems)
      openItems.forEach(async (item, i) => {
        let task = await Task.findByPk(item.Task_name);
        if (!task) return next(new HttpError('Task not found.', 400));

        task.Kanban_index = i;
        task.Task_state = req.body.tasksList.name;

        await task.save();
      });

    if (!!todolistItems)
      todolistItems.forEach(async (item, i) => {
        let task = await Task.findByPk(item.Task_name);
        if (!task) return next(new HttpError('Task not found.', 400));

        task.Kanban_index = i;
        task.Task_state = req.body.tasksList.name;

        await task.save();
      });

    if (!!doingItems)
      doingItems.forEach(async (item, i) => {
        let task = await Task.findByPk(item.Task_name);
        if (!task) return next(new HttpError('Task not found.', 400));

        task.Kanban_index = i;
        task.Task_state = req.body.tasksList.name;

        await task.save();
      });

    if (!!doneItems)
      doneItems.forEach(async (item, i) => {
        let task = await Task.findByPk(item.Task_name);
        if (!task) return next(new HttpError('Task not found.', 400));

        task.Kanban_index = i;
        task.Task_state = req.body.tasksList.name;

        await task.save();
      });

    if (!!closeItems)
      closeItems.forEach(async (item, i) => {
        let task = await Task.findByPk(item.Task_name);
        if (!task) return next(new HttpError('Task not found.', 400));

        task.Kanban_index = i;
        task.Task_state = req.body.tasksList.name;

        await task.save();
      });

    return res.send({ success: true });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

module.exports = {
  getApplicationsData,
  createApplication,
  updateApplication,
  getTasksData,
  createTask,
  updateTaskState,
  updateKanbanIndex,
};
