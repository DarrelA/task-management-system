const User = require('../models/userModel');
const HttpError = require('../models/http-error');

const register = async (req, res, next) => {
  try {
    res.send('Hi');
  } catch (error) {
    console.log(error);
    return next(new HttpError('Failed to register.', 404));
  }
};

const updateUser = async (req, res, next) => {
  try {
    res.send('Hi');
  } catch (error) {
    console.log(error);
    return next(new HttpError('Failed to update user.', 404));
  }
};

module.exports = { register, updateUser };
