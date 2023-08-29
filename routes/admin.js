const express = require("express");

const adminController = require("../controllers/admin");
const { uploadImages } = require("../middleware/uploadImage");
const router = express.Router();

router.post(
    "/create",
    adminController.create
);
// router.post("/update", uploadImages, authorController.editAuthor);

module.exports = router;
