const asyncWrapper = require("../util/asyncWrapper");
require("dotenv").config();

const RequestService = require("../services/request.service");

/**
 * Handle requests to get all requests under an association
 */
exports.getAllRequestsOfAnAssoc = asyncWrapper(async (req, res) => {
  const assoc = req.query.association;
  const query = {
    association: assoc,
    $or: [{ delete: false }, { delete: { $exists: false } }],
  };
  var requests = await RequestService.getRequests(query);
  res.send(requests);
});

/**
 * Handle requests to get all requests tied to a user
 */
exports.handleGetVolunteerRequests = asyncWrapper(async (req, res) => {
  console.log("Token for requests: ", req.token);
  try {
    var requests = await RequestService.getVolunteerRequests(
      req.token.id,
      req.query.status
    );
    res.send(requests);
  } catch (e) {
    res.sendStatus(400);
  }
});

/**
 * Handle requests to get volunteer statistics given a volunteer's id
 */
exports.handleGetVolunteerStatistics = asyncWrapper(async (req, res) => {
  let id_list = req.query.id_list.split(",");
  try {
    var statistics = {};
    id_list.forEach(async (id) => {
      statistics[id] = await RequestService.getVolunteerStatistics(id);
      if (Object.keys(statistics).length == id_list.length) {
        res.send(statistics);
      }
    });
  } catch (e) {
    res.sendStatus(400);
  }
});

/**
 * Handle requests to create a request
 */
exports.createARequest = asyncWrapper(async (req, res) => {
  const {
    body: { request },
  } = req;
  // const request = req.body;
  try {
    const new_request = await RequestService.createRequest(request);
    return new_request._id === null
      ? res.sendStatus(500)
      : res.status(201).send({ _id: new_request._id });
  } catch (e) {
    return res.status(422).send(e);
  }
});

/**
 * Handle requests to match volunteers to a request
 */
exports.matchVolunteers = asyncWrapper(async (req, res) => {
  const {
    body: { volunteers, _id, adminMessage },
  } = req;
  try {
    let updated_request = await RequestService.matchVolunteers(
      _id,
      volunteers,
      adminMessage
    );
    return res.status(200).send(updated_request);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

/**
 * Handle requests to unmatch volunteers from a request
 */
exports.unmatchVolunteers = asyncWrapper(async (req, res) => {
  const {
    body: { volunteers, _id, adminMessage },
  } = req;
  try {
    let updated_request = await RequestService.unmatchVolunteers(
      _id,
      volunteers,
      adminMessage
    );
    return res.status(200).send(updated_request);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Handle requests to accept a request as a volunteer
 */
exports.acceptRequest = asyncWrapper(async (req, res) => {
  const requestID = req.query.ID;
  const volunteerID = req.token.id;
  try {
    let updated_request = await RequestService.acceptRequest(
      volunteerID,
      requestID
    );
    return res.status(200).send(updated_request);
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

/**
 * Handle requests to reject a request as a volunteer
 */
exports.rejectRequest = asyncWrapper(async (req, res) => {
  const requestID = req.query.ID;
  const volunteerID = req.token.id;
  try {
    let updated_request = await RequestService.rejectRequest(
      volunteerID,
      requestID
    );
    return res.status(200).send(updated_request);
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

/**
 * Handle requests to complete a request
 */
exports.completeARequest = asyncWrapper(async (req, res) => {
  const requestID = req.query.ID;
  const volunteerID = req.token.id;
  const {
    body: { reason, volunteer_comment, adminMode },
  } = req;

  try {
    let updated_request = await RequestService.completeRequest(
      volunteerID,
      requestID,
      reason,
      volunteer_comment,
      adminMode
    );
    return res.status(200).send(updated_request);
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

/**
 * Update request details
 */
exports.updateRequestDetails = asyncWrapper(async (req, res) => {
  try {
    const updates = req.body.updates;
    const requestID = req.body.requestID;
    let updated_request = await RequestService.updateRequestDetails(
      requestID,
      updates
    );
    return res.status(200).send(updated_request);
  } catch (e) {
    return res.status(400).send(e);
  }
});
