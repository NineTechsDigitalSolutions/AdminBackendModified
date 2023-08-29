const notificationController = require("../controllers/notification");

const express = require("express");

const router = express.Router();

router.get("/getAll", notificationController.getAll);

router.post("/create/sms-notification", notificationController.createSmsNotification);
router.post("/create/email-notification", notificationController.createEmailNotification);
router.post("/create/push-notification", notificationController.createPushNotification);

module.exports = router;
