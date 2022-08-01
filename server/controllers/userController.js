const { User, Group, UserGroup } = require('../models/userTaskModel');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkRefreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new HttpError('Please authenticate!', 401));

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(payload.username);
    if (!user || user.refreshToken !== token)
      return next(new HttpError('Please authenticate', 401));

    const accessToken = user.createAccessToken(user.username);
    const refreshToken = user.createRefreshToken(user.username);

    user.refreshToken = refreshToken;
    await user.save();
    user.sendRefreshToken(res, refreshToken);

    return res.send({ accessToken, isAdmin: user.isAdmin });
  } catch (e) {
    console.error(e);
    res.send({ accessToken: '' });
  }
};

const login = async (req, res, next) => {
  let { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (user && user.isActiveAcc === false)
      return next(
        new HttpError('Something went wrong, please contact your administrator.', 404)
      );

    if (user && (await user.comparePassword(password))) {
      const { isAdmin } = user;
      const accessToken = user.createAccessToken(user.username);
      const refreshToken = user.createRefreshToken(user.username);
      user.refreshToken = refreshToken;
      await user.save();
      user.sendRefreshToken(res, refreshToken);
      return res.send({ email: user.email, isAdmin, accessToken, message: 'success' });
    }

    return next(new HttpError('Invalid credentials.', 401));
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 401));
  }
};

const logout = async (req, res, next) => {
  res.clearCookie('refreshToken', { path: '/api/users/refresh_token' });
  return res.send({ message: 'success' });
};

const getUsersData = async (req, res, next) => {
  try {
    const data = await Group.findAll({ attributes: ['name'] });
    const groups = [];
    data.forEach((group) => groups.push(group.name));

    let users = await User.findAll({
      include: [
        {
          model: Group,
          through: { attributes: [] },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['password', 'isAdmin', 'refreshToken', 'createdAt'] },
    });

    // Get only dataValues from Sequelize ORM
    users = JSON.stringify(users);
    users = JSON.parse(users);

    users.forEach((user, i) => {
      (user.password = ''), (user.confirmPassword = ''), (user.inGroups = []);
      user.groups.forEach((group) => {
        users[i].inGroups.push(group.name);
      });
      user.inGroups.sort();
      delete users[i].groups;
    });

    users.forEach((user) => {
      user.notInGroups = [...groups];
      user.notInGroups = user.notInGroups
        .filter((group) => !user.inGroups.includes(group))
        .sort();
    });

    return res.send({
      users,
      groups,
      username: req.admin.username,
      email: req.admin.email,
    });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createUser = async (req, res, next) => {
  const { username, email, password, confirmPassword, inGroups } = req.body;
  if (!username || !email || !password)
    return next(new HttpError('Please provide username, email and password.', 400));

  if (await User.findOne({ where: { username } }))
    return next(new HttpError('Username is taken.', 400));

  if (await User.findOne({ where: { email } }))
    return next(new HttpError('Email is taken.', 400));

  if (password !== confirmPassword)
    return next(new HttpError('Password is different from Confirm Password.', 400));

  // Comprise of alphabets, numbers, and special character
  // Minimum 8 characters and maximum 10 characters
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/;
  if (!password.match(regex))
    return next(new HttpError('Please provide a valid password.', 400));

  try {
    const user = await User.create({
      username: username.trim().replace(/\s+/g, ''), // Remove all whitespaces

      email: email
        .trim()
        .replace(/\s+/g, '') // Remove all whitespaces
        .replace(/[&\/\\#,+()!$~%^'":*?<>{}]/g, '') // Remove symbols
        .toLowerCase(),

      password: password,
    });

    await user.save();

    // Usergroups management
    inGroups.forEach(async (group) => {
      const groupInSQL = await Group.findByPk(group);
      if (!groupInSQL) return next(new HttpError('Something went wrong!', 400));
    });

    const count = await UserGroup.destroy({ where: { userUsername: username } });
    // console.info(`${count} usergroup(s) are removed under username: ${username}.`);
    inGroups.forEach(async (group) => await user.addGroup(group));

    user.changed('updatedAt', true);
    user.updatedAt = new Date();
    await user.save();

    return res.status(201).send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Failed to create user.', 400));
  }
};

const updateUser = async (req, res, next) => {
  const { username, password, confirmPassword, email, isActiveAcc } = req.body;
  const user = await User.findByPk(username);

  if (!user) return next(new HttpError('Something went wrong!', 400));
  if (email !== user.email && (await User.findOne({ where: { email } })))
    return next(new HttpError('Email is taken.', 400));

  try {
    if (password) {
      if (password !== confirmPassword)
        return next(new HttpError('Password is different from Confirm Password.', 400));

      // Comprise of alphabets, numbers, and special character
      // Minimum 8 characters and maximum 10 characters
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/;
      if (!password.match(regex))
        return next(new HttpError('Please provide a valid password.', 400));

      user.password = password;
    }

    if (email)
      user.email = email
        .trim()
        .replace(/\s+/g, '') // Remove all whitespaces
        .replace(/[&\/\\#,+()!$~%^'":*?<>{}]/g, '') // Remove symbols
        .toLowerCase();

    // admin cannot deactivate their own account
    if (isActiveAcc && username !== req.user.username) user.isActiveAcc = isActiveAcc;
    if (isActiveAcc === 'false' && username === req.user.username)
      return next(
        new HttpError('Cannot remove admin rights of your own admin account.', 404)
      );

    await user.save();

    // Usergroups management
    const { inGroups, notInGroups } = req.body;

    inGroups.forEach(async (group) => {
      const groupInSQL = await Group.findByPk(group);
      if (!groupInSQL) return next(new HttpError('Something went wrong!', 400));
    });

    const count = await UserGroup.destroy({ where: { userUsername: username } });
    // console.info(`${count} usergroup(s) are removed under username: ${username}.`);
    inGroups.forEach(async (group) => await user.addGroup(group));

    user.changed('updatedAt', true);
    user.updatedAt = new Date();
    await user.save();

    return res.send({ message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const createGroup = async (req, res, next) => {
  const userGroup = req.body.userGroup.trim().replace(/\s+/g, ''); // Remove all whitespaces

  if (!userGroup) return next(new HttpError('Group username is required.', 400));

  try {
    const group = await Group.findByPk(userGroup);

    if (!group) {
      const newGroup = await Group.create({ name: userGroup });
      await newGroup.save();
      res.send({ message: 'success' });
    } else return next(new HttpError('Group username is taken.', 400));
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const checkGroup = async (req, res, next) => {
  const { username, userGroup } = req.body;
  try {
    const group = await UserGroup.findAll({
      where: { username, groupName: userGroup },
    });

    res.send(!!group[0]?.username); // Check user in user group? Return T/F
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateProfile = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = await User.findByPk(req.user.username);

  if (email && email !== user.email && (await User.findOne({ where: { email } })))
    return next(new HttpError('Email is taken.', 400));

  if (password) {
    if (password !== confirmPassword)
      return next(new HttpError('Password is different from Confirm Password.', 400));

    // Comprise of alphabets, numbers, and special character
    // Minimum 8 characters and maximum 10 characters
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/;
    if (!password.match(regex))
      return next(new HttpError('Please provide a valid password.', 400));

    user.password = password;
  }

  try {
    if (email)
      user.email = email
        .trim()
        .replace(/\s+/g, '') // Remove all whitespaces
        .replace(/[&\/\\#,+()!$~%^'":*?<>{}]/g, '') // Remove symbols
        .toLowerCase();

    await user.save();
    res.send({ username: user.username, email: user.email, message: 'success' });
  } catch (e) {
    console.error(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

module.exports = {
  checkRefreshToken,
  login,
  logout,
  getUsersData,
  createUser,
  updateUser,
  createGroup,
  checkGroup,
  updateProfile,
};
