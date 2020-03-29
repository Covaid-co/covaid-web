const express = require('express');
const router = express.Router();

const request_controller = require('../../controllers/request.controller');

router.post('/create_request', request_controller.createARequest)
router.get('/:id/update_completed', request_controller.update_completed);
router.get('/allRequestsInAssoc', request_controller.getAllRequestsOfAnAssoc);
router.put('/attachVolunteerToRequest', request_controller.attachVolunteer)
router.put('/completeRequest', request_controller.completeARequest)

module.exports = router;