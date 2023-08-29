const express = require("express");

const userController = require("../controllers/user");
const router = express.Router();

router.get("/get-all", userController.getUsers);
router.post("/get-by-library", userController.getUsersByLibrary);
router.get("/get/:id", userController.getUserById);
router.get("/toggle-status/:id", userController.changeStatus);

router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.post("/update", userController.updateUser);
router.post("/update-password", userController.updatePassword);
router.post("/verify-otp", userController.verifyOtp);
router.post("/verify-email", userController.verifyEmail);
router.post("/update-plan", userController.updatePlan);
router.post("/search", userController.searchUsers);

module.exports = router;
