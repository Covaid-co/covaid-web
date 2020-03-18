const express = require('express');
const router = express.Router();

const offer_controller = require('../controllers/offer.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', offer_controller.test);

router.post('/create', offer_controller.offer_create)
router.get('/:id', offer_controller.offer_details);
router.get('/', offer_controller.all_offers);
router.put('/:id/update', offer_controller.offer_update);
router.delete('/:id/delete', offer_controller.offer_delete);
module.exports = router;