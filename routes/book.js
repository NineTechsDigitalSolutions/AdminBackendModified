const express = require("express");

const bookController = require("../controllers/book");
const { uploadImages } = require("../middleware/uploadImage");
const router = express.Router();

router.get("/get-all", bookController.getAll);
router.get("/get-all-admin", bookController.getAllAdmin);
router.get("/get-by-category/:id", bookController.getBookByCategory);
router.post("/get-by-library-admin", bookController.getAllByLibraryAdmin);
router.post("/get-by-library", bookController.getAllByLibrary);
router.get("/get-book/:id", bookController.getBook);
router.get("/toggle-view-library/:id", bookController.ToggleViewLibrary);

router.post("/create", uploadImages, bookController.createBook);
router.post("/update", uploadImages, bookController.editBook);
router.post("/search", bookController.search);
router.get("/increase-book-count/:id", bookController.increaseCount);

module.exports = router;
