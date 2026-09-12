const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const { Application, Department, User, Payment } = require("../models");
const { requireAuth, requireRole } = require("../middleware/auth");
const { notify } = require("../utils/notify");

const router = express.Router();

const uploadDir = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function generateReferenceNo() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RTI-${year}-${random}`;
}

// Create a new RTI application (status starts as payment_pending)
router.post(
  "/",
  requireAuth,
  upload.single("document"),
  [
    body("subject").trim().notEmpty().withMessage("Subject is required."),
    body("queryText").trim().notEmpty().withMessage("Please describe the information you are seeking."),
    body("departmentId").notEmpty().withMessage("Please select a department."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { subject, queryText, departmentId, applicantCategory } = req.body;

    const department = await Department.findByPk(departmentId);
    if (!department) return res.status(404).json({ message: "Selected department not found." });

    const application = await Application.create({
      referenceNo: generateReferenceNo(),
      subject,
      queryText,
      applicantCategory: applicantCategory || "general",
      status: "payment_pending",
      documentPath: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.id,
      departmentId,
    });

    const user = await User.findByPk(req.user.id);
    await notify({
      channel: "email",
      recipient: user.email,
      subject: "RTI Application Created",
      message: `Your RTI application ${application.referenceNo} has been created. Complete the fee payment to submit it.`,
      userId: user.id,
      applicationId: application.id,
    });

    res.status(201).json({ application });
  }
);

// List current user's applications
router.get("/mine", requireAuth, async (req, res) => {
  const applications = await Application.findAll({
    where: { userId: req.user.id },
    include: [{ model: Department, as: "department" }, { model: Payment, as: "payment" }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ applications });
});

// Track by reference number (public - no login required, matches "RTI Status Tracking")
router.get("/track/:referenceNo", async (req, res) => {
  const application = await Application.findOne({
    where: { referenceNo: req.params.referenceNo },
    include: [{ model: Department, as: "department" }],
    attributes: { exclude: ["queryText"] },
  });
  if (!application) return res.status(404).json({ message: "No application found with that reference number." });
  res.json({ application });
});

// Get single application (owner or admin)
router.get("/:id", requireAuth, async (req, res) => {
  const application = await Application.findByPk(req.params.id, {
    include: [
      { model: Department, as: "department" },
      { model: Payment, as: "payment" },
      { model: User, as: "applicant", attributes: ["id", "fullName", "email", "phone"] },
    ],
  });
  if (!application) return res.status(404).json({ message: "Application not found." });
  if (req.user.role === "citizen" && application.userId !== req.user.id) {
    return res.status(403).json({ message: "You do not have access to this application." });
  }
  res.json({ application });
});

// Admin/PIO: list all applications, optionally filtered by status/department
router.get("/", requireAuth, requireRole("admin", "pio"), async (req, res) => {
  const { status, departmentId } = req.query;
  const where = {};
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;

  const applications = await Application.findAll({
    where,
    include: [
      { model: Department, as: "department" },
      { model: User, as: "applicant", attributes: ["id", "fullName", "email"] },
      { model: Payment, as: "payment" },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json({ applications });
});

// Admin/PIO: update status
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin", "pio"),
  [body("status").notEmpty().withMessage("Status is required.")],
  async (req, res) => {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: User, as: "applicant" }],
    });
    if (!application) return res.status(404).json({ message: "Application not found." });

    const { status, remarks } = req.body;
    const wasResolved = ["info_provided", "rejected", "closed"].includes(status);

    await application.update({
      status,
      remarks: remarks ?? application.remarks,
      resolvedAt: wasResolved ? new Date() : application.resolvedAt,
    });

    if (application.applicant) {
      await notify({
        channel: "email",
        recipient: application.applicant.email,
        subject: `Update on RTI application ${application.referenceNo}`,
        message: `Your application status changed to "${status.replace("_", " ")}".${remarks ? ` Remarks: ${remarks}` : ""}`,
        userId: application.applicant.id,
        applicationId: application.id,
      });
      await notify({
        channel: "sms",
        recipient: application.applicant.phone,
        message: `RTI ${application.referenceNo}: status updated to ${status.replace("_", " ")}.`,
        userId: application.applicant.id,
        applicationId: application.id,
      });
    }

    res.json({ application });
  }
);

module.exports = router;
