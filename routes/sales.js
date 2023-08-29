const express = require("express");

const salesController = require("../controllers/sales");
const router = express.Router();

router.get("/get-all", salesController.getAll);
router.post("/get-by-library", salesController.getAllByLibrary);

// router.post("/create", salesController.createPurchase);

module.exports = router;
