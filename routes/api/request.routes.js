const express = require('express');
const router = express.Router();

const request_controller = require('../../controllers/request.controller');

router.post('/handle_request', request_controller.handleRequest)

module.exports = router;