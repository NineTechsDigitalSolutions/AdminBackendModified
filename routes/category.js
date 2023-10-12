const express = require("express");

const categoryController = require("../controllers/category");
const userAuth = require("../middleware/userAuth")
const router = express.Router();

router.get("/get-all", categoryController.getAll);
router.get("/get-all-subcategories/:id", categoryController.getSubcategories);
router.get("/get-all-categories", categoryController.getAllCategories);

router.post("/create", categoryController.createCategory);
router.post("/update", categoryController.editCategory);
router.post("/add-subCategory", categoryController.addSubCategoryToCategory);
router.post("/search", categoryController.search);

module.exports = router;
