const RequestRepository = require('../repositories/request.repository');

exports.getRequests  = async function(query) {
    try {
        return await RequestRepository.readRequest(query);
    } catch (e) {
        throw e;
    }
}

// TODO