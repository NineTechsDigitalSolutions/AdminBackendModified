const express = require("express");

const libraryController = require("../controllers/library");
const router = express.Router();

router.get("/get", libraryController.getLibraries);
router.post("/create", libraryController.createLibrary);

module.exports = router;
