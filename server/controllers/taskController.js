const { Application, Plan, Task, Note } = require('../models/userTaskModel');
const HttpError = require('../models/http-error');

const createApplication = async (req, res, next) => {
  const { App_Acronym, App_Description, App_startDate, App_endDate } = req.body;

  if (!App_Acronym) return next(new HttpError('Application acronym is required.', 400));

  try {
    const application = await Application.findByPk(userGroup);
    const appCount = await Application.count();
    console.log('appCount', appCount);

    if (!application) {
      const newApplication = await Application.create({
        App_Acronym,
        App_Description,
        App_Rnumber: appCount,
        App_startDate,
        App_endDate,
      });
      await newApplication.save();
      res.send({ message: 'success' });
    } else return next(new HttpError('Application acronym is taken.', 400));
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

module.exports = {
  createApplication,
};
