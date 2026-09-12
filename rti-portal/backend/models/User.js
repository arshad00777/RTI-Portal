const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
    role: {
      type: DataTypes.ENUM("citizen", "admin", "pio"),
      defaultValue: "citizen",
    },
  },
  { tableName: "users", timestamps: true }
);

module.exports = User;
