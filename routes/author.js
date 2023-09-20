const express = require("express");

const authorController = require("../controllers/author");
const { uploadImages } = require("../middleware/uploadImage");
const userAuth = require("../middleware/userAuth")
const router = express.Router();

router.get("/get-all",userAuth, authorController.getAll);
// router.get("/get-by-library/:id", authorController.getAllByLibrary);
router.get("/get-author/:id",userAuth, authorController.getAuthor);

//router.post("/create",userAuth, uploadImages, authorController.createAuthor);
router.post("/create",userAuth, uploadImages, authorController.createAuthor);
router.post("/update",userAuth, uploadImages, authorController.editAuthor);
router.post("/search",userAuth, authorController.searchAuthors);

module.exports = router;
