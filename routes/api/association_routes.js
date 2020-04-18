const express = require('express');
const router = express.Router();
const auth = require('../auth');

const AssociationController = require('../../controllers/association.controller');

// Authentication
router.post('/register', auth.optional, AssociationController.handleCreateAssociation);
router.post('/login', auth.optional, AssociationController.handleLoginAssociation);

// Get associations
router.get('/current', auth.required, AssociationController.handleGetCurrentAssociation);
router.get('/', AssociationController.handleGetAssociations);
router.get('/byLatitudeLongitude', AssociationController.handleGetAssociationsGivenLatitudeLongitude);

// Updates
router.put('/update', auth.required, AssociationController.handleUpdateInfo);
router.put('/update/addLink', auth.required, AssociationController.handleAddLink);
router.put('/update/addAdmin', auth.required, AssociationController.handleAddAdmin);

// Delete
router.delete('/delete/:id/deleteLink', auth.required, AssociationController.handleDeleteLink);


// To-do
// Password reset





// router.get('/get_assoc', association_controller.association_details);
// router.get('/', association_controller.all);
// router.get('/current', auth.required, association_controller.current);
// router.post('/create', association_controller.create_association);
// router.post('/login', auth.optional, association_controller.login);
// router.get('/get_assoc/lat_long', association_controller.assoc_by_lat_long);
// router.put('/update', association_controller.update_association);
// router.put('/admins', association_controller.add_admin);

// router.put('/addLink', association_controller.add_resource_link)
// router.delete('/:id/deletelink', association_controller.delete_resource_link)

// router.post('/emailpasswordresetlink', association_controller.emailPasswordResetLink)
// router.get('/verifyresetlink/:id/:token', association_controller.verifyPasswordResetLink)
// router.post('/resetpassword', association_controller.resetPassword)

module.exports = router;