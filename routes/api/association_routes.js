const express = require('express');
const router = express.Router();

const association_controller = require('../../controllers/association.controller');

router.get('/:id', association_controller.association_details);
router.get('/', association_controller.all);
router.post('/create', association_controller.create_association);
router.get('/get_assoc/lat_long', association_controller.assoc_by_lat_long);

module.exports = router;