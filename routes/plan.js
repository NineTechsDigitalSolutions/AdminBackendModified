const express = require("express");

const planController = require("../controllers/plan");
const router = express.Router();

router.get("/get-all", planController.getAllPlans);
router.post("/get-by-library", planController.getPlansByLibrary);
router.get("/get/:id", planController.getPlan);
router.get("/change-status/:id", planController.changeStatus);

router.post("/create", planController.createPlan);
router.post("/update", planController.updatePlan);
router.post("/search", planController.search);

module.exports = router;
