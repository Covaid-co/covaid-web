const express = require('express');
const router = express.Router();

const offer_controller = require('../controllers/offer.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', offer_controller.test);

router.post('/create', offer_controller.offer_create)
module.exports = router;