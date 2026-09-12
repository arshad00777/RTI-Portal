require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Department } = require("./models");

async function seed() {
  await sequelize.sync({ force: true });

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const citizenPassword = await bcrypt.hash("Citizen@123", 10);

  await User.bulkCreate([
    {
      fullName: "Portal Administrator",
      email: "admin@rtiportal.gov.in",
      phone: "9999999999",
      passwordHash: adminPassword,
      role: "admin",
      address: "State Information Commission HQ",
    },
    {
      fullName: "Asha Verma",
      email: "asha.verma@example.com",
      phone: "9876543210",
      passwordHash: citizenPassword,
      role: "citizen",
      address: "12 MG Road, Ranchi, Jharkhand",
    },
  ]);

  await Department.bulkCreate([
    {
      state: "Jharkhand",
      name: "Department of Rural Development",
      pioName: "R. K. Mishra",
      pioDesignation: "Public Information Officer",
      address: "Nepal House, Doranda, Ranchi",
      email: "pio.rd@jharkhand.gov.in",
      phone: "0651-2481234",
    },
    {
      state: "Jharkhand",
      name: "Department of Health, Medical Education & Family Welfare",
      pioName: "S. Kumari",
      pioDesignation: "Assistant Public Information Officer",
      address: "FFP Building, Dhurwa, Ranchi",
      email: "pio.health@jharkhand.gov.in",
      phone: "0651-2400567",
    },
    {
      state: "Delhi",
      name: "Public Works Department",
      pioName: "A. Sharma",
      pioDesignation: "Public Information Officer",
      address: "MSO Building, ITO, New Delhi",
      email: "pio.pwd@delhi.gov.in",
      phone: "011-23378899",
    },
    {
      state: "Maharashtra",
      name: "Department of Education",
      pioName: "V. Deshmukh",
      pioDesignation: "Public Information Officer",
      address: "Mantralaya, Mumbai",
      email: "pio.edu@maharashtra.gov.in",
      phone: "022-22029999",
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login   -> admin@rtiportal.gov.in / Admin@123");
  console.log("Citizen login -> asha.verma@example.com / Citizen@123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
