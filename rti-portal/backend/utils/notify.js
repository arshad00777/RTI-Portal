const { Notification } = require("../models");

/**
 * Sends (or simulates sending) an email/SMS notification and always
 * logs it to the database so the admin dashboard and the user's
 * activity feed can display a record of it.
 */
async function notify({ channel, recipient, subject, message, userId, applicationId }) {
  // In production, plug in a real provider (SendGrid, Twilio, etc.)
  // based on process.env.EMAIL_PROVIDER / process.env.SMS_PROVIDER.
  // For this project, notifications are logged so the flow is fully
  // demonstrable without external credentials.
  console.log(`[${channel.toUpperCase()}] -> ${recipient}: ${subject || ""} ${message}`);

  return Notification.create({
    channel,
    recipient,
    subject,
    message,
    status: "sent",
    userId,
    applicationId,
  });
}

module.exports = { notify };
