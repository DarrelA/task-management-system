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

const createTask = async (req, res, next) => {
  const { App_Acronym, Task_name, Task_description, Task_plan } = req.body;

  console.log(App_Acronym, Task_name);

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
      Task_state: 'Open',
      Task_creator: req.user.username,
      Task_owner: req.user.username,
      applicationAppAcronym: App_Acronym, // Task_app_Acronym
      planPlanMVPName: Task_plan || null, // Task_plan
    });
    await newTask.save();
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
  createTask,
};
