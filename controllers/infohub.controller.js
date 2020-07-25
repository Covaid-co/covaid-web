const asyncWrapper = require("../util/asyncWrapper");
const InfoHubService = require("../services/infohub.service");
const Resources = require("../models/infohub.model");

/**
 * Handle requests to create a resource
 */
exports.handleCreateResource = asyncWrapper(async (req, res) => {
  const {
    body: { resource },
  } = req;

  try {

    const newResource = await InfoHubService.createResource(resource);
    return newResource._id === null
      ? res.sendStatus(500)
      : res.status(201).send({ resource: newResource }); //Where is it sending
  } catch (e) {
    return res.status(422).send(e);
  }
});

/**
 * Get all resources given a query
 */
exports.handleGetResources = asyncWrapper(async (req, res) => {
  const query = req.query;
  try {
    let resources = await InfoHubService.getQueriedResources(query);
    return res.json(resources);
  } catch (e) {
    return res.sendStatus(400);
  }
});

/**
 * Handle requests to delete a resource
 */
exports.deleteResource = function (req, res) {
  const resourceID = req.query;
  Resources.findByIdAndRemove(resourceID, function (err) {
    if (err) return err;
    res.send("Successfully deleted resource! Come again!");
  });
};

/**
 * Update resource
 */
exports.updateResource = function (req, res) {
  const id = req.body.resourceID;
  Resources.findByIdAndUpdate(id, { $set: req.body.updates }, { new: true }, function (
    err,
    resource
  ) {
    if (err) return next(err);
    res.send(resource);
  });
};