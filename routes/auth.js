const express = require("express");

const authController = require("../controllers/auth");
const router = express.Router();
const { uploadImages } = require("../middleware/uploadImage");
const { uploadFiles } = require("../middleware/uploadFiles");

router.post("/forget-password", authController.forgetPassword);
router.post("/verify-forget-code", authController.verifyCode);
router.post("/change-password", authController.updatePassword);

router.post("/upload-image",uploadImages , authController.sendResponse);
router.post("/upload-file",uploadFiles , authController.sendResponse);

module.exports = router;
