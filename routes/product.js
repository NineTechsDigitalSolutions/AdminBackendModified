const productController = require("../controllers/product");

const express = require("express");
const { uploadImages } = require("../middleware/uploadImage");

const router = express.Router();

router.get("/getAll", productController.getAll);
router.get("/get/:id", productController.getProduct);
router.get("/change-status/:id", productController.changeStatus);

router.post("/create", uploadImages, productController.create);
router.post("/update", uploadImages, productController.update);
router.post("/search", productController.search);

// router.post("/test-image", uploadImages, productController.test);

module.exports = router;
