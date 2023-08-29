const express = require("express");

const homeController = require("../controllers/home");
const { uploadImages } = require("../middleware/uploadImage");
const router = express.Router();

//for dashboard

router.post("/get", homeController.getAll);
router.post("/get-monthly-users", homeController.getMonthlyUsers);
router.get("/get-daily-sales", homeController.getSalesValues);

//for statistics
router.post("/get-statistics", homeController.getUserStats);
router.post("/get-monthly-authors", homeController.getMonthlyAuthors);
router.get("/get-monthly-orders", homeController.getMonthlyOrders);
router.get("/get-daily-products", homeController.getProductValues);

module.exports = router;
