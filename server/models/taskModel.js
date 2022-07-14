const Sequelize = require('sequelize');
const sequelize = require('../config/db');

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
  .then(() => console.log('Creating tables for taskModel.'))
  .catch((e) => console.error(e));

const createTaskData = async () => {};

module.exports = { Application, Plan, Task };
