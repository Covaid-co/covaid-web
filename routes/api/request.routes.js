const express = require('express');
const router = express.Router();
const auth = require('../auth');

const request_controller = require('../../controllers/request.controller');

router.post('/create_request', request_controller.createARequest)
router.get('/:id/update_completed', request_controller.update_completed);
router.get('/allRequestsInAssoc', request_controller.getAllRequestsOfAnAssoc);
router.post('/handle_request', request_controller.handle_old_request);
router.get('/allRequestsInVolunteer', request_controller.getAllRequestsInVolunteer);
router.get('/allPendingRequestsInVolunteer', request_controller.getAllPendingRequestsInVolunteer);
router.get('/allAcceptedRequestsInVolunteer', request_controller.getAllAcceptedRequestsInVolunteer);
router.get('/allCompletedRequestsInVolunteer', request_controller.getAllCompletedRequestsInVolunteer);

router.put('/attachVolunteerToRequest', request_controller.attachVolunteer);
router.put('/removeVolunteerFromRequest', request_controller.removeVolunteer);
router.get('/acceptRequest', auth.required, request_controller.acceptRequest)
router.put('/completeRequest', request_controller.completeARequest);
router.put('/set_assignee', request_controller.setAssignee);
router.put('/manual_volunteer', request_controller.setManualVolunteer);
router.put('/set_notes', request_controller.setNotes);
router.put('/set_delete', request_controller.setDelete);

module.exports = router;