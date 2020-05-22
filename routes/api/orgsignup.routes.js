const express = require("express");
const router = express.Router();
const orgsignup_controller = require("../../controllers/orgsignup.controller");

router.post("/signup", orgsignup_controller.SignUp);

module.exports = router;
