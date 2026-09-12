const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    state: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    pioName: { type: DataTypes.STRING, allowNull: false },
    pioDesignation: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    rtiFormUrl: { type: DataTypes.STRING },
  },
  { tableName: "departments", timestamps: true }
);

module.exports = Department;
