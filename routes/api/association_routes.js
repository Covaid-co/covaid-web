const express = require("express");
const router = express.Router();
const auth = require("../auth");

const association_controller = require("../../controllers/association.controller");

router.post("/create", association_controller.create_association);
router.post("/login", auth.optional, association_controller.login);
router.get("/get_assoc", association_controller.association_details);
router.get("/", association_controller.all);
router.get("/current", auth.required, association_controller.current);
router.get("/get_assoc/lat_long", association_controller.assoc_by_lat_long);
router.put("/update", association_controller.update_association);
router.put("/update_recruiting", association_controller.update_recruiting);
router.put("/update_geofences", association_controller.update_geofences);
router.put("/admins", association_controller.add_admin);

// Link related
router.put("/addLink", association_controller.add_resource_link);
router.delete("/:id/deletelink", association_controller.delete_resource_link);

// Password reset related
router.post(
  "/emailpasswordresetlink",
  association_controller.emailPasswordResetLink
);
router.get(
  "/verifyresetlink/:id/:token",
  association_controller.verifyPasswordResetLink
);
router.post("/resetpassword", association_controller.resetPassword);

module.exports = router;
