const express = require("express");
const router = express.Router();

const infohub_controller = require("../../controllers/infohub.controller");

// POST
router.post("/create", infohub_controller.handleCreateResource);

// GET
router.get("/", infohub_controller.handleGetResources);

// DELETE
router.delete("/delete", infohub_controller.deleteResource);

module.exports = router;
