const { verify } = require('jsonwebtoken');
const { checkGroup } = require('../controllers/userController');
const HttpError = require('../models/http-error');
const { User, Application } = require('../models/userTaskModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new HttpError('Please authenticate.', 401));
  const token = authHeader.split(' ')[1];
  try {
    const { username } = verify(token, process.env.JWT_SECRET);
    req.admin = await User.findByPk(username);
    req.user = { username };
    next();
  } catch (e) {
    console.error(e);
    return next(new HttpError('Refresh page', 401));
  }
};

const adminMiddleware = (req, res, next) => {
  try {
    if (req.admin && req.admin.isAdmin) return next();
    return next(new HttpError('Forbidden', 403));
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const appAccessRightsMiddleware = async (req, res, next) => {
  // From TaskUpdate page & PlanTask draggable respectively
  const taskState = req.body.Task_state_source || req.body.Task_state;

  try {
    if (req.path === '/application' && req.method === 'POST') {
      const haveAccessRights = await checkGroup(req.user.username, 'Project Lead');
      if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
    }

    if (req.path === '/application' && req.method === 'PATCH') {
      const haveAccessRights = await checkGroup(req.user.username, 'Project Lead');
      if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
    }
    if (req.path === '/plan' && req.method === 'POST') {
      const haveAccessRights = await checkGroup(req.user.username, 'Project Manager');
      if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
    }

    const application = await Application.findByPk(req.body.App_Acronym);
    if (!application) return next(new HttpError('Forbidden', 403));

    if (req.path === '/task' && req.method === 'POST') {
      const haveAccessRights = await checkGroup(
        req.user.username,
        application.App_permit_Create
      );
      if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
    }

    if (req.path === '/task' && req.method === 'PATCH') {
      const haveAccessRights = await checkGroup(
        req.user.username,
        application.App_permit_Create
      );
      if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
    }

    if (req.path === '/task' || req.path === '/taskstate')
      if (req.method === 'PATCH' && taskState === 'open') {
        const haveAccessRights = await checkGroup(
          req.user.username,
          application.App_permit_Open
        );
        if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
      }

    if (req.path === '/task' || req.path === '/taskstate')
      if (req.method === 'PATCH' && taskState === 'todolist') {
        const haveAccessRights = await checkGroup(
          req.user.username,
          application.App_permit_toDoList
        );
        if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
      }

    if (req.path === '/task' || req.path === '/taskstate')
      if (req.method === 'PATCH' && taskState === 'doing') {
        const haveAccessRights = await checkGroup(
          req.user.username,
          application.App_permit_Doing
        );
        if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
      }

    if (req.path === '/task' || req.path === '/taskstate')
      if (req.method === 'PATCH' && taskState === 'done') {
        const haveAccessRights = await checkGroup(
          req.user.username,
          application.App_permit_Done
        );
        if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
      }

    return next(new HttpError('Forbidden!', 403));
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

module.exports = { authMiddleware, adminMiddleware, appAccessRightsMiddleware };
