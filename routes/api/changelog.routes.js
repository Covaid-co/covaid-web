const express = require("express");
const router = express.Router();
const changelog_controller = require("../../controllers/changelog.controller");

router.post("/add_log", changelog_controller.add_log);
router.get("/", changelog_controller.all);

module.exports = router;
