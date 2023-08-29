const express = require("express");

const materialController = require("../controllers/material");
const router = express.Router();

router.get("/get", materialController.getAll);

router.post("/create", materialController.createMaterial);

module.exports = router;
