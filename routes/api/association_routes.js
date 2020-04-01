const express = require('express');
const router = express.Router();
const auth = require('../auth')

const association_controller = require('../../controllers/association.controller');

router.get('/get_assoc', association_controller.association_details);
router.get('/', association_controller.all);
router.post('/create', association_controller.create_association);
router.post('/login', auth.optional, association_controller.login);
router.get('/get_assoc/lat_long', association_controller.assoc_by_lat_long);
router.put('/update', association_controller.update_association)

module.exports = router;