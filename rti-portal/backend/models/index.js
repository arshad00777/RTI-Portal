const sequelize = require("../config/database");
const User = require("./User");
const Department = require("./Department");
const Application = require("./Application");
const Payment = require("./Payment");
const Notification = require("./Notification");

// User <-> Application
User.hasMany(Application, { foreignKey: "userId", as: "applications" });
Application.belongsTo(User, { foreignKey: "userId", as: "applicant" });

// Department <-> Application
Department.hasMany(Application, { foreignKey: "departmentId", as: "applications" });
Application.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

// Application <-> Payment
Application.hasOne(Payment, { foreignKey: "applicationId", as: "payment" });
Payment.belongsTo(Application, { foreignKey: "applicationId", as: "application" });

// User <-> Notification
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// Application <-> Notification
Application.hasMany(Notification, { foreignKey: "applicationId", as: "notifications" });
Notification.belongsTo(Application, { foreignKey: "applicationId", as: "application" });

module.exports = {
  sequelize,
  User,
  Department,
  Application,
  Payment,
  Notification,
};
