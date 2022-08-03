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
  try {
    if (req.path === '/createapplication' && req.route.stack[0].method === 'post') {
      const haveAccessRights = await checkGroup(req.user.username, 'Project Lead');
      if ((req.admin && req.admin.isAdmin) || haveAccessRights) return next();
    }

    const application = await Application.findByPk(req.body.App_Acronym);
    if (!application) return next(new HttpError('Forbidden', 403));

    if (req.path === '/updateapplication' && req.route.stack[0].method === 'patch') {
      const haveAccessRights = await checkGroup(
        req.user.username,
        application.App_permit_Open
      );

      if (
        (req.admin && req.admin.isAdmin) ||
        application.App_permit_Open === null ||
        haveAccessRights
      )
        return next();
    }

    return next(new HttpError('Forbidden', 403));
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

module.exports = { authMiddleware, adminMiddleware, appAccessRightsMiddleware };
