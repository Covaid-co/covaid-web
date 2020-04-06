const express = require('express');
const router = express.Router();

const request_controller = require('../../controllers/request.controller');

router.post('/create_request', request_controller.createARequest)
router.get('/:id/update_completed', request_controller.update_completed);
router.get('/allRequestsInAssoc', request_controller.getAllRequestsOfAnAssoc);
router.post('/handle_request', request_controller.handle_old_request);
router.get('/allRequestsInVolunteer', request_controller.getAllRequestsInVolunteer);

router.put('/attachVolunteerToRequest', request_controller.attachVolunteer);
router.put('/removeVolunteerFromRequest', request_controller.removeVolunteer);
router.put('/completeRequest', request_controller.completeARequest);
router.put('/set_assignee', request_controller.setAssignee);
router.put('/manual_volunteer', request_controller.setManualVolunteer);
router.put('/set_notes', request_controller.setNotes);

module.exports = router;