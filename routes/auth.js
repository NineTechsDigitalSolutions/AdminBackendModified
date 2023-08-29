const express = require("express");

const authController = require("../controllers/auth");
const router = express.Router();

router.post("/forget-password", authController.forgetPassword);
router.post("/verify-forget-code", authController.verifyCode);
router.post("/change-password", authController.updatePassword);

module.exports = router;
