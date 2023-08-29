const {
  get,
  post,
  update,
  getAll,
} = require("../controllers/content");

// const adminIsAuth = require("../../../../middleware/adminIsAuth");

const express = require("express");

const router = express.Router();

// @USER ROUTES
router.get("/user/get", get);
router.get("/user/get-all", getAll);

// @ADMIN ROUTES
router.post("/admin/post", post);

router.post("/admin/update", update);

module.exports = router;
