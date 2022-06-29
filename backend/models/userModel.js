const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userGroup: {
      type: Sequelize.ENUM('Project Lead', 'Project Manager', 'Team Member', 'None'),
      defaultValue: 'None',
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isActiveAcc: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    refreshToken: {
      type: Sequelize.STRING,
    },
  },

  {
    hooks: {
      beforeSave: async function (user) {
        if (!user.changed('password')) return;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

User.prototype.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

User.prototype.createAccessToken = function (userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

User.prototype.createRefreshToken = function (userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

User.prototype.sendRefreshToken = function (res, refreshToken) {
  return res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/api/users/refresh_token',
  });
};

User.sync().then(() => console.log('User table created.'));

(async () => {
  const defaultAdmin = await User.findOne({
    where: { email: process.env.DEFAULT_ADMIN_EMAIL },
  });
  if (!defaultAdmin)
    User.create({
      name: process.env.DEFAULT_ADMIN_NAME,
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      isAdmin: true,
    });
})();

module.exports = User;
