const express = require("express");
const router = express.Router();
const auth = require("../auth");

const request_controller = require("../../controllers/request.controller");

// POST
router.post("/create_request", request_controller.createARequest);

// GET
router.get("/allRequestsInAssoc", request_controller.getAllRequestsOfAnAssoc);
router.get(
  "/volunteerRequests",
  auth.required,
  request_controller.handleGetVolunteerRequests
);
router.get(
  "/volunteerStatistics",
  request_controller.handleGetVolunteerStatistics
);

// PUT
router.put("/matchVolunteers", request_controller.matchVolunteers);
router.put("/unmatchVolunteers", request_controller.unmatchVolunteers);
router.put("/acceptRequest", auth.required, request_controller.acceptRequest);
router.put("/rejectRequest", auth.required, request_controller.rejectRequest);
router.put(
  "/completeRequest",
  auth.required,
  request_controller.completeARequest
);
router.put("/updateRequestDetails", request_controller.updateRequestDetails);

module.exports = router;
