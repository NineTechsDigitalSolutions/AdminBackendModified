const orderController = require("../controllers/order");

const express = require("express");

const router = express.Router();

router.get("/getAll", orderController.getAll);
router.get("/get/:id", orderController.getOrder);
router.get("/change-status/:id", orderController.changeStatus);

router.post("/create", orderController.create);

module.exports = router;
