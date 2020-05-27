const asyncWrapper = require("../util/asyncWrapper");
const BeaconService = require("../services/beacon.service");

/**
 * Handle requests to create a beacon
 */
exports.handleCreateBeacon = asyncWrapper(async (req, res) => {
  const {
    body: { beacon },
  } = req;
  const auth_id = req.token.id;
  if (!beacon.beaconMessage) {
    return res.status(422).json({
      errors: {
        message: "is required",
      },
    });
  }

  if (!beacon.volunteers || beacon.volunteers.length === 0) {
    return res.status(422).json({
      errors: {
        volunteers: "are required",
      },
    });
  }

  if (!auth_id) {
    return res.status(404).json({
      errors: {
        authorization: "is required",
      },
    });
  }

  try {
    const newBeacon = await BeaconService.createBeacon(auth_id, beacon);
    return newBeacon._id === null
      ? res.sendStatus(500)
      : res.status(201).send({ beacon: newBeacon });
  } catch (e) {
    return res.status(422).send(e);
  }
});

/**
 * Get all beacons given a query
 */
exports.handleGetBeacons = asyncWrapper(async (req, res) => {
  const _id = req.token.id;
  const query = req.query;
  query["association_id"] = _id;
  try {
    let beacons = await BeaconService.getQueriedBeacons(query);
    return res.json(beacons);
  } catch (e) {
    return res.sendStatus(400);
  }
});

/**
 * Get all beacons assigned to a user
 */
exports.handleGetBeaconsByUser = asyncWrapper(async (req, res) => {
  const auth_id = req.token.id;
  if (!auth_id) {
    return res.status(404).json({
      errors: {
        authorization: "is required",
      },
    });
  }
  try {
    let beacons = await BeaconService.getBeaconsByUserID(auth_id);
    return res.json(beacons);
  } catch (e) {
    return res.sendStatus(400);
  }
});

/**
 * Update beacon information
 */
exports.handleUpdateBeacon = asyncWrapper(async (req, res) => {
  const {
    body: { beacon_id, updates },
  } = req;
  try {
    await BeaconService.updateBeacon(beacon_id, updates);
    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(400);
  }
});

/**
 * Update beacon information
 */
exports.handleUserAction = asyncWrapper(async (req, res) => {
  const {
    body: { beacon_id, updates },
  } = req;
  console.log(beacon_id);
  const auth_id = req.token.id;
  try {
    await BeaconService.userAction(auth_id, beacon_id, updates);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
});
