const {
  Application,
  Plan,
  Task,
  Note,
  Group,
  UserGroup,
} = require('../models/userTaskModel');
const HttpError = require('../models/http-error');
const { checkGroup } = require('./userController');

const getApplicationsData = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      attributes: { exclude: ['createdAt'] },
    });

    const groups = await Group.findAll({ attributes: ['name'] });
    let isProjectLead = await checkGroup(req.user.username, 'Project Lead');
    if (!isProjectLead && req?.admin.isAdmin) isProjectLead = true;

    return res.send({ applications, groups, isProjectLead });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createApplication = async (req, res, next) => {
  const {
    App_Acronym,
    App_Description,
    App_Rnumber,
    App_startDate,
    App_endDate,
    App_permit_Create,
    App_permit_Open,
    App_permit_toDoList,
    App_permit_Doing,
    App_permit_Done,
  } = req.body;

  if (!App_Acronym) return next(new HttpError('Application acronym is required.', 400));
  if (!App_Description)
    return next(new HttpError('Application description is required.', 400));

  if (!App_Rnumber) return next(new HttpError('Application Rnumber is required.', 400));
  if (typeof +App_Rnumber !== 'number' || +App_Rnumber < 0)
    return next(new HttpError('Application Rnumber needs to be a valid number.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!!application) return next(new HttpError('Application acronym is taken.', 400));

    if (App_permit_Create) {
      const openGroup = await Group.findByPk(App_permit_Create);
      if (!openGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
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

    const newApplication = await Application.create({
      App_Acronym,
      App_Description,
      App_Rnumber: +App_Rnumber,
      App_startDate: App_startDate || null,
      App_endDate: App_endDate || null,
      App_permit_Create: App_permit_Create || null,
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
    App_permit_Create,
    App_permit_Open,
    App_permit_toDoList,
    App_permit_Doing,
    App_permit_Done,
  } = req.body;

  if (!App_Acronym) return next(new HttpError('Application acronym is required.', 400));
  if (!App_Description)
    return next(new HttpError('Application description is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    if (App_permit_Create) {
      const openGroup = await Group.findByPk(App_permit_Create);
      if (!openGroup) return next(new HttpError('Usergroup is unavailable.', 400));
    }
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

    application.App_Description = App_Description;
    if (App_startDate) application.App_startDate = App_startDate;
    if (App_endDate) application.App_endDate = App_endDate;
    application.App_permit_Create = App_permit_Create || null;
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
    let application = await Application.findByPk(req.params.App_Acronym);
    if (!application) return next(new HttpError('Application is unavailable.', 400));

    // Find the usergroups that user belongs to
    let usergroups = [
      ...(await UserGroup.findAll({
        where: { userUsername: req.user.username },
        attributes: ['groupName'],
      })),
    ].map((usergroup) => usergroup.groupName);

    // Set T/F permissions in respective App_permit states
    const {
      App_permit_Create,
      App_permit_Open,
      App_permit_toDoList,
      App_permit_Doing,
      App_permit_Done,
    } = application;
    const appPermits = {};

    appPermits.App_permit_Create =
      req?.admin.isAdmin ||
      !!usergroups.find((usergroup) => usergroup === App_permit_Create);
    appPermits.App_permit_Open =
      req?.admin.isAdmin ||
      !!usergroups.find((usergroup) => usergroup === App_permit_Open);
    appPermits.App_permit_toDoList =
      req?.admin.isAdmin ||
      !!usergroups.find((usergroup) => usergroup === App_permit_toDoList);
    appPermits.App_permit_Doing =
      req?.admin.isAdmin ||
      !!usergroups.find((usergroup) => usergroup === App_permit_Doing);
    appPermits.App_permit_Done =
      req?.admin.isAdmin ||
      !!usergroups.find((usergroup) => usergroup === App_permit_Done);

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

    return res.send({ appPermits, tasks });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createTask = async (req, res, next) => {
  const { App_Acronym, Task_name, Task_description, Task_plan } = req.body;

  if (!Task_name) return next(new HttpError('Task name is required.', 400));
  if (!Task_description) return next(new HttpError('Task description is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    const hasTask = await Task.findOne({ where: { Task_app_Acronym: App_Acronym } });
    let runningNum = application.App_Rnumber;
    if (!!hasTask) runningNum += 1;
    application.App_Rnumber = runningNum;
    application.save();

    const task_name = await Task.findByPk(Task_name);
    if (!!task_name) return next(new HttpError('Task name is taken.', 400));

    const newTask = await Task.create({
      Task_name,
      Task_description: Task_description,
      Task_id: application.App_Acronym + '_' + runningNum,
      Task_state: 'open',
      Task_creator: req.user.username,
      Task_owner: req.user.username,
      Task_app_Acronym: App_Acronym,
      Task_plan: Task_plan || null,
    });
    await newTask.save();

    const newNote = await Note.create({
      username: req.user.username,
      state: 'open',
      description: 'Task has been created.',
      taskTaskName: Task_name,
    });
    await newNote.save();

    res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateTask = async (req, res, next) => {
  const { App_Acronym, Task_name, Task_description, Task_state, Task_plan, Task_note } =
    req.body;

  if (!Task_description) return next(new HttpError('Task description is required.', 400));
  if (!Task_state) return next(new HttpError('Task state is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    const task = await Task.findByPk(Task_name);
    if (!task) return next(new HttpError('Task not found.', 400));

    if (Task_state === 'open' || Task_state === 'todolist' || Task_state === 'doing')
      task.Task_description = Task_description;

    task.Task_owner = req.user.username;
    Task_plan = Task_plan || null;

    await newTask.save();

    const newNote = await Note.create({
      username: req.user.username,
      state: Task_state,
      description: Task_note,
      taskTaskName: Task_name,
    });
    await newNote.save();

    res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateTaskState = async (req, res, next) => {
  const { Task_name, Task_state_source: from, Task_state_destination: to } = req.body;
  const task = await Task.findByPk(Task_name);

  if (!task) return next(new HttpError('Task not found.', 400));

  const validAppPermitStates = ['open', 'todolist', 'doing', 'done', 'close'];
  const validFrom = validAppPermitStates.includes(from);
  const validTo = validAppPermitStates.includes(to);
  if (!validFrom || !validTo) return next(new HttpError('Invalid task state.', 400));

  // Validation for promoting and demoting state
  if (
    (from === 'open' && to !== 'open' && to !== 'todolist') ||
    (from === 'todolist' && to !== 'todolist' && to !== 'doing') ||
    (from === 'doing' && to !== 'doing' && to !== 'todolist' && to !== 'done') ||
    (from === 'done' && to !== 'done' && to !== 'doing' && to !== 'close') ||
    (from === 'close' && to !== 'close')
  )
    return next(new HttpError('Forbidden', 400));

  try {
    task.Task_state = to;
    await task.save();

    const newNote = await Note.create({
      username: req.user.username,
      state: to,
      description: `Task state has been changed to ${to}.`,
      taskTaskName: Task_name,
    });
    await newNote.save();

    return res.send({ success: true });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateKanbanIndex = async (req, res, next) => {
  const { tasksList, Task_name } = req.body;

  const openItems = tasksList.open?.items;
  const todolistItems = tasksList.todolist?.items;
  const doingItems = tasksList.doing?.items;
  const doneItems = tasksList.done?.items;
  const closeItems = tasksList.close?.items;

  try {
    const taskSource = await Task.findOne({ where: { Task_name } });
    taskSource.Task_owner = req.user.username;
    await taskSource.save();

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

const getPlansData = async (req, res, next) => {
  try {
    const plans = await Plan.findAll({
      where: { Plan_app_Acronym: req.params.App_Acronym },
    });

    if (!plans) return next(new HttpError('Plan is unavailable.', 400));
    return res.send({ plans });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createPlan = async (req, res, next) => {
  const { App_Acronym, Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_color } =
    req.body;

  if (!Plan_MVP_name) return next(new HttpError('Plan name is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    const plan_MVP_name = await Plan.findByPk(Plan_MVP_name);
    if (!!plan_MVP_name) return next(new HttpError('Plan name is taken.', 400));

    const newPlan = await Plan.create({
      Plan_MVP_name,
      Plan_startDate: Plan_startDate || null,
      Plan_endDate: Plan_endDate || null,
      Plan_app_Acronym: App_Acronym,
      Plan_color: Plan_color || '#3f51b5',
    });
    await newPlan.save();
    res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updatePlan = async (req, res, next) => {
  const { App_Acronym, Plan_startDate, Plan_endDate, Plan_color } = req.body;

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!application) return next(new HttpError('Application not found.', 400));

    const plan = await Plan.findByPk(Plan_MVP_name);
    if (!plan) return next(new HttpError('Plan not found.', 400));

    if (Plan_startDate) plan.Plan_startDate = Plan_startDate;
    if (Plan.Plan_endDate) plan.Plan_endDate = Plan_endDate;
    if (Plan.Plan_color) plan.Plan_color = Plan_color;

    await plan.save();
    res.send({ message: 'success' });
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
  updateTask,
  updateTaskState,
  updateKanbanIndex,
  getPlansData,
  createPlan,
  updatePlan,
};
