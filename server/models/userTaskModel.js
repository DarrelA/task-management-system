const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sequelize = require('../config/db');
const mockUsers = require('../config/mockUsers');
const mockGroups = require('../config/mockGroups');

const User = sequelize.define(
  'user',
  {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
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

User.prototype.createAccessToken = function (username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

User.prototype.createRefreshToken = function (username) {
  return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
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

const UserGroup = sequelize.define('usergroups');

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

/******************************************************************************************************/

const Application = sequelize.define('application', {
  App_Acronym: {
    type: Sequelize.STRING(45),
    primaryKey: true,
  },
  App_Description: {
    type: Sequelize.TEXT('long'),
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
  App_permit_Create: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  App_permit_Open: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  App_permit_toDoList: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  App_permit_Doing: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  App_permit_Done: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

const Plan = sequelize.define('plan', {
  Plan_MVP_name: {
    type: Sequelize.STRING(45),
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
  Plan_color: {
    type: Sequelize.STRING(45),
    allowNull: true,
  },
});

const Task = sequelize.define('task', {
  Task_name: {
    type: Sequelize.STRING(45),
    primaryKey: true,
  },
  Task_description: {
    type: Sequelize.TEXT('long'),
    allowNull: true,
  },
  Task_id: {
    type: Sequelize.STRING(45),
    allowNull: true,
  },
  Task_state: {
    type: Sequelize.ENUM(['open', 'todolist', 'doing', 'done', 'close']),
  },
  Kanban_index: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  Task_creator: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Task_owner: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

const Note = sequelize.define('note', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.ENUM(['open', 'todolist', 'doing', 'done', 'close']),
  },
  description: {
    type: Sequelize.TEXT('long'),
    allowNull: true,
  },
});

Application.hasMany(Plan, { foreignKey: 'Plan_app_Acronym' });
Plan.belongsTo(Application, { foreignKey: 'Plan_app_Acronym' });
Application.hasMany(Task, { foreignKey: 'Task_app_Acronym' });
Task.belongsTo(Application, { foreignKey: 'Task_app_Acronym' });
Plan.hasMany(Task, { foreignKey: 'Task_plan' });
Task.belongsTo(Plan, { foreignKey: 'Task_plan' });
Task.hasMany(Note);
Note.belongsTo(Task);

sequelize
  .sync()
  .then(() => createData())
  .catch((e) => console.error(e));

const createData = async () => {
  const defaultAdmin = await User.findOne({ where: { isAdmin: 1 } });

  if (!defaultAdmin) {
    await User.bulkCreate(
      [
        {
          username: process.env.DEFAULT_ADMIN_NAME,
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

  const pl = await User.findByPk('pl');
  await pl.addGroup('Project Lead');

  const pm = await User.findByPk('pm');
  await pm.addGroup('Project Manager');

  const tm = await User.findByPk('tm');
  await tm.addGroup('Team Member');

  const plpm = await User.findByPk('plpm');
  await plpm.addGroup('Project Lead');
  await plpm.addGroup('Project Manager');
};

module.exports = { User, Group, UserGroup, Application, Plan, Task, Note };
