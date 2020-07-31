const router = require("express").Router();
const auth = require("../auth");

const AssociationAdminController = require("../../controllers/association.admin.controller");

// Authentication
router.post(
  "/register",
  auth.optional,
  AssociationAdminController.handleRegisterRequest
);
router.post(
  "/login",
  auth.optional,
  AssociationAdminController.handleLoginRequest
);

// Get current user
router.get(
  "/current",
  auth.required,
  AssociationAdminController.handleGetCurrentAdmin
);

// Password reset related
router.post(
  "/emailpasswordresetlink",
  AssociationAdminController.emailPasswordResetLink
);
router.get(
  "/verifyresetlink/:id/:token",
  AssociationAdminController.verifyPasswordResetLink
);
router.post("/resetpassword", AssociationAdminController.resetPassword);

module.exports = router;
