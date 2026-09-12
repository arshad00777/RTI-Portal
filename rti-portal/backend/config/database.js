const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "sqlite";

let sequelize;

if (dialect === "postgres") {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(
      __dirname,
      "..",
      process.env.SQLITE_STORAGE || "./data/rti.sqlite"
    ),
    logging: false,
  });
}

module.exports = sequelize;
