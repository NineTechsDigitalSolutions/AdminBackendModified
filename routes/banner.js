const express = require("express");

const bannerController = require("../controllers/banner");
const { uploadImages } = require("../middleware/uploadImage");
const router = express.Router();

router.get("/get-all", bannerController.getAll);
router.get("/delete/:id", bannerController.delete);

router.post("/create", uploadImages, bannerController.create);
router.post("/update", uploadImages, bannerController.update);

module.exports = router;
