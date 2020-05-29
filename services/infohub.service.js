const InfoHubRepository = require("../repositories/infohub.repository");

/**
 *  Get requests given a query
 */
exports.getQueriedResources = async function (query) {
    try {
      return await InfoHubRepository.readResource(query);
    } catch (e) {
      throw e;
    }
  };

  exports.createResource = async function (resource) {
    try {
      var constructedResource = {
        url: resource.url,
        name: resource.name,
        description: resource.description,
        mediaType: resource.mediaType,
        sectionID: resource.sectionID,
      };
      let savedResource = await InfoHubRepository.createResource(constructedResource);
      return savedResource;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };