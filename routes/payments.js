const express = require("express");

const paymentsController = require("../controllers/payments");
const router = express.Router();

router.get("/get-all", paymentsController.getAll);
// router.get("/get-by-library/:id", salesController.getAuthor);

// router.post("/create", salesController.createPurchase);

module.exports = router;
