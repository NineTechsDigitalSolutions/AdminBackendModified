const queryController = require("../controllers/query");

const express = require("express");

const router = express.Router();

router.get("/getAll", queryController.getAll);

router.post("/create", queryController.createQuery);
router.post("/reply", queryController.replyQuery);

module.exports = router;
