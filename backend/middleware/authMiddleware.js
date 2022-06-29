const { verify } = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new HttpError('Please authenticate.', 401));
  const token = authHeader.split(' ')[1];
  try {
    const { userId } = verify(token, process.env.JWT_SECRET);
    req.user = { userId };
    next();
  } catch (e) {
    console.log(e);
    return next(new HttpError('Please refresh and login again.', 401));
  }
};

module.exports = authMiddleware;
