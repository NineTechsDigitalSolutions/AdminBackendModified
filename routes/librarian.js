const express = require("express");

const librarianController = require("../controllers/librarian");
const router = express.Router();

router.get("/get-all", librarianController.getLibrarians);
router.post("/get-by-library", librarianController.getLibrariansByLibrary);
router.get("/get/:id", librarianController.getLibrarianById);
router.get("/toggle-status/:id", librarianController.changeStatus);

router.post("/get-by-status", librarianController.getLibrariansByStatus);
router.post("/create", librarianController.createLibrarian);
router.post("/login", librarianController.login);
router.post("/update", librarianController.updateLibrarian);
router.post("/update-password", librarianController.updatePassword);
router.post("/verify-otp", librarianController.verifyOtp);
router.post("/verify-email", librarianController.verifyEmail);
router.post("/search", librarianController.searchLibrarians);

module.exports = router;
