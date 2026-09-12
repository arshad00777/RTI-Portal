const express = require("express");
const { Application, User, Department, Payment } = require("../models");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/stats", async (req, res) => {
  const [totalApplications, totalUsers, totalDepartments, applications, payments] =
    await Promise.all([
      Application.count(),
      User.count({ where: { role: "citizen" } }),
      Department.count(),
      Application.findAll({ attributes: ["status"] }),
      Payment.findAll({ attributes: ["amount", "status"] }),
    ]);

  const byStatus = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const revenue = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({
    totalApplications,
    totalUsers,
    totalDepartments,
    byStatus,
    revenue,
  });
});

module.exports = router;
