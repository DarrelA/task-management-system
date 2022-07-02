const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
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

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    const { id, name, isAdmin } = user;

    if (user && (await user.comparePassword(password))) {
      const accessToken = user.createAccessToken(user.id);
      const refreshToken = user.createRefreshToken(user.id);
      user.refreshToken = refreshToken;
      await user.save();
      user.sendRefreshToken(res, refreshToken);
      return res.send({ id, name, isAdmin, accessToken });
    }

    return next(new HttpError('Invalid credentials.', 401));
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 401));
  }
};

const checkRefreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new HttpError('Please authenticate!', 401));

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user || user.refreshToken !== token)
      return next(new HttpError('Please authenticate', 401));

    const accessToken = user.createAccessToken(user.id);
    const refreshToken = user.createRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();
    user.sendRefreshToken(res, refreshToken);

    return res.send({ accessToken });
  } catch (e) {
    console.log(e);
    res.send({ accessToken: '' });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'refreshToken', 'updatedAt'],
      },
    });
    res.send(users);
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateUser = async (req, res, next) => {
  const { userId, email, password } = req.body; // update fields for user
  const { name, userGroup, isAdmin, isActiveAcc } = req.body;

  // Comprise of alphabets , numbers, and special character
  // Minimum 8 characters and maximum 10 characters
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,10}$/;
  if (!password.match(regex))
    return next(new HttpError('Please provide a valid password.', 400));

  if (await User.findOne({ where: { email } }))
    return next(new HttpError('Email is taken.', 400));

  const user = await User.findByPk(userId);

  try {
    // Account with admin rights
    if (user.admin === 1) {
      if (name) user.name = name;
      if (userGroup) user.userGroup = userGroup;
      if (isAdmin) user.isAdmin = isAdmin;
      if (isActiveAcc) user.isActiveAcc = isActiveAcc;
    }

    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();

    res.send({
      name: user.name,
      userGroup: user.userGroup,
      isAdmin: user.isAdmin,
      isActiveAcc: user.isActiveAcc,
      message: 'success',
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

module.exports = { signup, login, checkRefreshToken, getAllUsers, updateUser };
