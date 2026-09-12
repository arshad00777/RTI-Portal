const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transactionId: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: "INR" },
    method: {
      type: DataTypes.ENUM("card", "upi", "netbanking", "waived"),
      defaultValue: "upi",
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },
    receiptNo: { type: DataTypes.STRING },
  },
  { tableName: "payments", timestamps: true }
);

module.exports = Payment;
