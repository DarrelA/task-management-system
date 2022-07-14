const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sequelize = require('../config/db');
const mockUsers = require('../config/mockUsers');
const mockGroups = require('../config/mockGroups');

const User = sequelize.define(
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
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
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

const Group = sequelize.define('group', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
});

const UserGroup = sequelize.define('usergroups', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

/******************************************************************************************************/

const Application = sequelize.define('application', {
  App_Acronym: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  App_Description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  App_Rnumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  App_startDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  App_endDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  App_permit_Open: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  App_permit_toDoList: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  App_permit_Doing: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  App_permit_Done: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

const Plan = sequelize.define('plan', {
  Plan_MVP_name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  Plan_startDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  Plan_endDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  Plan_app_Acronym: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Task = sequelize.define('task', {
  Task_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Task_description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Task_notes: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Task_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  Task_plan: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Task_app_Acronym: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Task_state: {
    type: Sequelize.ENUM(['Open', 'To-do-list', 'Doing', 'Done']),
    allowNull: false,
  },
  Task_creator: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Task_owner: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Application.hasMany(Plan);
Plan.belongsTo(Application);
Application.hasMany(Task);
Task.belongsTo(Application);
Plan.hasMany(Task);
Task.belongsTo(Plan);

sequelize
  .sync()
  .then(() => createData())
  .catch((e) => console.error(e));

const createData = async () => {
  const defaultAdmin = await User.findOne({ where: { isAdmin: 1 } });

  if (!defaultAdmin) {
    User.bulkCreate(
      [
        {
          name: process.env.DEFAULT_ADMIN_NAME,
          email: process.env.DEFAULT_ADMIN_EMAIL,
          password: process.env.DEFAULT_ADMIN_PASSWORD,
          isAdmin: true,
        },
        ...mockUsers,
      ],
      { individualHooks: true }
    );

    Group.bulkCreate([...mockGroups]);
  }
};

module.exports = { User, Group, UserGroup, Application, Plan, Task };
