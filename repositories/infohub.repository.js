const InfoHub = require("../models/infohub.model");

exports.createResource = async function (resource) {
  try {
    let newResource = new InfoHub(resource);
    await newResource.save();
    return newResource;
  } catch (e) {
    throw e;
  }
};

exports.readResource = async function (query) {
  try {
    var resources = await InfoHub.find(query);
    return resources;
  } catch (e) {
    throw Error("Error while querying resources");
  }
};