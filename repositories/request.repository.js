const Request = require('../models/request.model');

exports.createRequest = async function (request) {
    try {
        let new_request = new Request(request);
        let save_request = await new_request.save();
        return save_request;
    } catch (e) {
        throw e;
    }
}

exports.readRequest = async function (query) {
    try {
        var requests = await Request.find(query);
        return requests;
    } catch (e) {
        console.log(e);
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