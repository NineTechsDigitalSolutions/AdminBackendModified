const express = require("express");

const authorController = require("../controllers/author");
const { uploadImages } = require("../middleware/uploadImage");
const router = express.Router();

router.get("/get-all", authorController.getAll);
// router.get("/get-by-library/:id", authorController.getAllByLibrary);
router.get("/get-author/:id", authorController.getAuthor);

router.post("/create", uploadImages, authorController.createAuthor);
router.post("/update", uploadImages, authorController.editAuthor);
router.post("/search", authorController.searchAuthors);

module.exports = router;
