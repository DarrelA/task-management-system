const { Application, Plan, Task, Note, Group } = require('../models/userTaskModel');
const HttpError = require('../models/http-error');

const getApplicationsData = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      attributes: { exclude: ['createdAt'] },
    });

    const groups = await Group.findAll({ attributes: ['name'] });

    return res.send({ applications, groups });
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

  if (!App_Acronym) return next(new HttpError('Application acronym is required.', 400));

  try {
    const application = await Application.findByPk(App_Acronym);
    if (!!application) return next(new HttpError('Application acronym is taken.', 400));

    const openGroup = await Group.findByPk(App_permit_Open);
    const toDoGroup = await Group.findByPk(App_permit_toDoList);
    const doingGroup = await Group.findByPk(App_permit_Doing);
    const doneGroup = await Group.findByPk(App_permit_Done);
    if (!openGroup || !toDoGroup || !doingGroup || !doneGroup)
      return next(new HttpError('Usergroup is unavailable.', 400));

    const appCount = await Application.count();

    const newApplication = await Application.create({
      App_Acronym,
      App_Description,
      App_Rnumber: appCount + 1,
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

    if (App_Description) application.App_Description = App_Description;
    if (App_startDate) application.App_startDate = App_startDate;
    if (App_endDate) application.App_endDate = App_endDate;
    if (App_permit_Open) application.App_permit_Open = App_permit_Open;
    if (App_permit_toDoList) application.App_permit_toDoList = App_permit_toDoList;
    if (App_permit_Doing) application.App_permit_Doing = App_permit_Doing;
    if (App_permit_Done) application.App_permit_Done = App_permit_Done;

    await application.save();
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
};
