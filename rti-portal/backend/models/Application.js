const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    referenceNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    subject: { type: DataTypes.STRING, allowNull: false },
    queryText: { type: DataTypes.TEXT, allowNull: false },
    applicantCategory: {
      type: DataTypes.ENUM("general", "bpl"),
      defaultValue: "general",
    },
    status: {
      type: DataTypes.ENUM(
        "draft",
        "submitted",
        "payment_pending",
        "under_review",
        "info_provided",
        "rejected",
        "transferred",
        "closed"
      ),
      defaultValue: "draft",
    },
    documentPath: { type: DataTypes.STRING },
    remarks: { type: DataTypes.TEXT },
    submittedAt: { type: DataTypes.DATE },
    resolvedAt: { type: DataTypes.DATE },
  },
  { tableName: "applications", timestamps: true }
);

module.exports = Application;
