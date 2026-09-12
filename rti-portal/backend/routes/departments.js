const express = require("express");
const { Op } = require("sequelize");
const { Department } = require("../models");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public directory listing, with optional search by state/name
router.get("/", async (req, res) => {
  const { q, state } = req.query;
  const where = {};
  if (state) where.state = state;
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { pioName: { [Op.like]: `%${q}%` } },
    ];
  }
  const departments = await Department.findAll({ where, order: [["state", "ASC"], ["name", "ASC"]] });
  res.json({ departments });
});

router.get("/states", async (req, res) => {
  const departments = await Department.findAll({ attributes: ["state"], group: ["state"] });
  res.json({ states: departments.map((d) => d.state) });
});

router.get("/:id", async (req, res) => {
  const department = await Department.findByPk(req.params.id);
  if (!department) return res.status(404).json({ message: "Department not found." });
  res.json({ department });
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ department });
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const department = await Department.findByPk(req.params.id);
  if (!department) return res.status(404).json({ message: "Department not found." });
  await department.update(req.body);
  res.json({ department });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const department = await Department.findByPk(req.params.id);
  if (!department) return res.status(404).json({ message: "Department not found." });
  await department.destroy();
  res.json({ message: "Department removed." });
});

module.exports = router;
