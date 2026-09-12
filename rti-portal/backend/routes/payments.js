const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Payment, Application, User } = require("../models");
const { requireAuth } = require("../middleware/auth");
const { notify } = require("../utils/notify");

const router = express.Router();

const FEE = Number(process.env.RTI_APPLICATION_FEE || 10);

// Get the fee amount + currency (fee is waived for BPL category, per RTI Act rules)
router.get("/fee/:applicationId", requireAuth, async (req, res) => {
  const application = await Application.findByPk(req.params.applicationId);
  if (!application) return res.status(404).json({ message: "Application not found." });
  const amount = application.applicantCategory === "bpl" ? 0 : FEE;
  res.json({ amount, currency: "INR" });
});

// Simulate a payment gateway transaction (card / UPI / net-banking)
router.post("/checkout", requireAuth, async (req, res) => {
  const { applicationId, method } = req.body;

  const application = await Application.findByPk(applicationId, {
    include: [{ model: User, as: "applicant" }],
  });
  if (!application) return res.status(404).json({ message: "Application not found." });
  if (application.userId !== req.user.id) {
    return res.status(403).json({ message: "You do not have access to this application." });
  }

  const amount = application.applicantCategory === "bpl" ? 0 : FEE;
  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const receiptNo = `RCPT-${Date.now().toString().slice(-8)}`;

  const payment = await Payment.create({
    transactionId,
    amount,
    method: amount === 0 ? "waived" : method || "upi",
    status: "success", // simulated gateway always confirms instantly in this demo
    receiptNo,
    applicationId: application.id,
  });

  await application.update({
    status: "submitted",
    submittedAt: new Date(),
  });

  if (application.applicant) {
    await notify({
      channel: "email",
      recipient: application.applicant.email,
      subject: `Payment receipt for ${application.referenceNo}`,
      message: `Payment of ₹${amount} confirmed (receipt ${receiptNo}). Your RTI application has been submitted to the department.`,
      userId: application.applicant.id,
      applicationId: application.id,
    });
  }

  res.status(201).json({ payment, application });
});

// Refund (admin action, e.g. application rejected on a technicality)
router.post("/:id/refund", requireAuth, async (req, res) => {
  const payment = await Payment.findByPk(req.params.id);
  if (!payment) return res.status(404).json({ message: "Payment not found." });
  await payment.update({ status: "refunded" });
  res.json({ payment });
});

module.exports = router;
