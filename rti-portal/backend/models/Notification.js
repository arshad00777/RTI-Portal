const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    channel: { type: DataTypes.ENUM("email", "sms"), allowNull: false },
    recipient: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("sent", "failed"),
      defaultValue: "sent",
    },
  },
  { tableName: "notifications", timestamps: true }
);

module.exports = Notification;
