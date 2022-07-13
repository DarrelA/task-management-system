const { verify } = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const { User } = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new HttpError('Please authenticate.', 401));
  const token = authHeader.split(' ')[1];
  try {
    const { userId } = verify(token, process.env.JWT_SECRET);
    req.admin = await User.findByPk(userId);
    req.user = { userId };
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

module.exports = { authMiddleware, adminMiddleware };
