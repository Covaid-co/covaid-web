const router = require("express").Router();
const auth = require("../auth");

const BeaconController = require("../../controllers/beacon.controller");

// POST a new beacon (authorized orgs)
router.post("/create", auth.required, BeaconController.handleCreateBeacon);

// GET all beacons given a query
router.get("/", auth.required, BeaconController.handleGetBeacons);
router.get("/user", auth.required, BeaconController.handleGetBeaconsByUser);

// PUT changes to any beacon (authorized orgs)
router.put("/update", auth.required, BeaconController.handleUpdateBeacon);
router.put("/userAction", auth.required, BeaconController.handleUserAction);

// DELETE any beacon (permanent)
// TODO -> add delete routes
module.exports = router;
