const RequestRepository = require('../repositories/request.repository');

// notification logic:
// unmatched request -> if admin notify admin, else notify assoc
// matchedPending request -> notify volunteer
// matchedInProgress request -> if admin notify admin, else notify assoc
// completed request -> notify assoc, if admin notify admin


exports.getQueriedRequests = async function(query, limit) {
    try {
        return await RequestRepository.readRequest(query, limit);
    } catch (e) {
        throw e;
    }
}

exports.updateGeneralRequestInfo = async function(_id, updates) {
    try {
        updates.last_modified = Date.now();
        if (updates.requestStatus) {
            throw new Error('Cannot update request status through general update')
        }
        await RequestRepository.updateRequest(_id, updates);
    } catch (e) {
        throw e;
    }
}

exports.updateRequestStatusInfo = async function(_id, updates) {
        try {
            updates.last_modified = Date.now();
            updates.requestStatus.statusTimestamp = Date.now();
            await RequestRepository.updateRequest(_id, updates);

        } catch (e) {
            throw e;
        }
}

exports.createRequest = async function (request) {
    try {
        switch(request.requestStatus.currentStatus) {
            case "unmatched":
              return await createUnmatchedRequest(request);
            case "matchedPending":
            case "matchedInProgress":
              return await createMatchedRequest(request);
            default:
              throw new Error('Unrecognized request type')
          }
    } catch (e) {
        throw e;
    }
}

const createUnmatchedRequest = async (request) => {
    try {
        request.time_posted = Date.now();
        request.last_modified = Date.now();
        request.requestStatus.statusTimestamp = Date.now();
        var new_request = await RequestRepository.createRequest(request);
        return new_request;
    } catch (e) {
        throw e;
    }
}

const createMatchedRequest = async (request) => {
    try {
        if (!request.requestStatus.volunteer_id) {
            throw new Error('Matched requests need a volunteer');
        }
        request.time_posted = Date.now();
        request.last_modified = Date.now();
        request.requestStatus.statusTimestamp = Date.now();
        var new_request = await RequestRepository.createRequest(request);

        return new_request;
    } catch (e) {
        throw e;
    }
}

const handleUnmatchedRequestNotifications = () => {

}

const handleMatchedPendingRequestNotifications= () => {

}

const handleMatchedInProgressRequestNotifications = () => {

}

const handleCompletedRequestNotifications = () => {

}