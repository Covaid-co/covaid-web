const express = require('express');
const router = express.Router();
const auth = require('../auth');

const request_controller = require('../../controllers/request.controller');

// POST
router.post('/create_request', request_controller.createARequest);

// GET
router.get('/allRequestsInAssoc', request_controller.getAllRequestsOfAnAssoc);
router.get('/volunteerRequests', auth.required, request_controller.handleGetVolunteerRequests);

// PUT
router.put('/matchVolunteers', request_controller.matchVolunteers);
router.put('/unmatchVolunteers', request_controller.unmatchVolunteers);
router.put('/acceptRequest', auth.required, request_controller.acceptRequest);
router.put('/rejectRequest', auth.required, request_controller.rejectRequest);
router.put('/completeRequest', auth.required, request_controller.completeARequest);
router.put('/updateRequestDetails', request_controller.updateRequestDetails);


router.put('/attachVolunteerToRequest', request_controller.attachVolunteer);
router.put('/removeVolunteerFromRequest', request_controller.removeVolunteer);
router.put('/set_assignee', request_controller.setAssignee);
router.put('/set_notes', request_controller.setNotes);
router.put('/set_delete', request_controller.setDelete);

module.exports = router;