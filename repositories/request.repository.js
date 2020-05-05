const Request = '../models/request.model';

exports.createRequest = async function (request) {
    try {
        let new_request = new Request(request);
        let save_request = await new_request.save();
        return save_request;
    } catch (e) {
        throw e;
    }
}

exports.readRequest = async function (query, limit) {
    try {
        var requests = await Request.find(query).limit(limit);
        return requests;
    } catch (e) {
        throw Error('Error while querying requests');
    }
}

exports.updateRequest = async function(_id, updates) {
    try {
        await Request.updateOne({_id: _id}, {
            $set: updates
        });
    } catch (e) {
        throw Error('Error while updating requests')
    }
}

exports.deleteRequest = async function(request_id) {
    try {

        
    } catch (e) {
        throw Error('Error while deleting AssociationAdmin')
    }
}