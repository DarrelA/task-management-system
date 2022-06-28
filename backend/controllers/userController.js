const User = require('../models/userModel');
const HttpError = require('../models/http-error');

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email) return next(new HttpError('Please provide name and email.', 400));

  // Comprise of alphabets , numbers, and special character
  // Minimum 8 characters and maximum 10 characters
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/;
  if (!password.match(regex))
    return next(new HttpError('Please provide a valid password.', 400));

  if (await User.findOne({ where: { email } }))
    return next(new HttpError('Email is taken.', 400));

  try {
    const user = await User.create({ name, email, password });
    const accessToken = user.createAccessToken(user.id);
    const refreshToken = user.createRefreshToken(user.id);
    user.refreshToken = refreshToken;
    await user.save();
    user.sendRefreshToken(res, refreshToken);
    return res.status(201).send({ id: user.id, accessToken });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Failed to signup.', 400));
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

module.exports = { signup, updateUser };
