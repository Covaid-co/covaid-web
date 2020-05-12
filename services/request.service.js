const request_status = {
    UNMATCHED: 0,
    MATCHED: 1,
    COMPLETED: 2
}
    
const volunteer_status = {
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETE: 2,
    REJECTED: 3,
    DOES_NOT_EXIST: -1
}

const RequestRepository = require('../repositories/request.repository');
const AssociationService = require('./association.service');
const UserService = require('./user.service');
const emailer = require('../util/emailer');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
});

// Generic get requests given a query
exports.getRequests = async function(query) {
    try {
        return await RequestRepository.readRequest(query);
    } catch (e) {
        throw e;
    }
}

exports.getVolunteerRequests = async function(id, status) {
    const query = {
        "status.volunteers.volunteer":  id
    }
    try {
        var requests = await RequestRepository.readRequest(query);
        var volunteer_requests = [];
        requests.forEach(request => {
            request.status.volunteers.forEach(volunteer_obj => {
                if (volunteer_obj.volunteer === id && volunteer_obj.current_status === parseInt(status)) {
                    volunteer_requests.push(request);
                }
            });
        });

        return volunteer_requests;

    } catch (e) {
        throw e;
    }
}

exports.acceptRequest = async function(volunteerID, requestID) {
    try {
        await RequestRepository.updateRequestComplex({'_id': requestID, 'status.volunteers.volunteer': volunteerID}, { 
            $set: {
                "status.volunteers.$.current_status": volunteer_status.IN_PROGRESS,
                "status.volunteers.$.last_notified_time": new Date()
            }
        });
        let updatedRequest = (await RequestRepository.readRequest({_id: requestID}))[0];

        // TODO -> Notify admins
        return updatedRequest;
    } catch (e) {
        throw e;
    }
}

exports.rejectRequest = async function(volunteerID, requestID) {
    try {

        await exports.unmatchVolunteers(requestID, [volunteerID]);
        let updatedRequest = (await RequestRepository.readRequest({_id: requestID}))[0];

        // TODO -> Notify admins
        return updatedRequest;
    } catch (e) {
        throw e;
    }
}

exports.completeRequest = async function(volunteerID, requestID) {
    try {
        await RequestRepository.updateRequestComplex({'_id': requestID, 'status.volunteers.volunteer': volunteerID}, { 
            $set: {
                "status.volunteers.$.current_status": volunteer_status.IN_PROGRESS,
                "status.volunteers.$.last_notified_time": new Date()
            }
        });
        let updatedRequest = (await RequestRepository.readRequest({_id: requestID}))[0];

        // TODO -> Notify admins
        return updatedRequest;
    } catch (e) {
        throw e;
    }
}

exports.matchVolunteers = async function(requestID, volunteers, adminMessage) {
    try {
        let request = (await RequestRepository.readRequest({_id: requestID}))[0];
        let new_volunteers = volunteers.map(function (volunteer_id) {
            if (request.status.volunteers.filter(volunteer => volunteer.volunteer === volunteer_id).length === 0) {
                return {
                    current_status: volunteer_status.PENDING,
                    volunteer: volunteer_id,
                    volunteer_response: "",
                    last_notified_time: new Date(),
                    adminMessage: adminMessage
                }
            }
        });

        new_volunteers = new_volunteers.filter(function(volunteer) { 
            if (volunteer) return volunteer
        });

        if (new_volunteers.length > 0) {
            await RequestRepository.updateRequest(requestID, {
                $push: {
                    'status.volunteers': { $each: new_volunteers }
                }, 
                $set: {
                    'admin_info.last_modified_time': new Date()
                }
            });
        } else {
            return request;
        }

        let updatedRequest = (await RequestRepository.readRequest({_id: requestID}))[0];
        var matchedVolunteers = 0;
        updatedRequest.status.volunteers.forEach(volunteer => {
            if (volunteer.current_status === volunteer_status.IN_PROGRESS || volunteer_status.PENDING) {
                matchedVolunteers += 1;
            }
        });

        if (matchedVolunteers > 0) {
            await RequestRepository.updateRequest(requestID, {
                $set: {
                    'status.current_status': request_status.MATCHED
                }
            });
        }

        return updatedRequest;
        // TODO -> send emails

    } catch (e) {
        throw e;
    }
}

exports.unmatchVolunteers = async function(requestID, volunteers) {
    try {
        let request = (await RequestRepository.readRequest({_id: requestID}))[0];
        let removing_volunteers = volunteers.map(function (volunteer_id) {
            if (request.status.volunteers.filter(volunteer => volunteer.volunteer === volunteer_id && volunteer.current_status !== volunteer_status.REJECTED).length !== 0) {
                return volunteer_id
            }
        });

        removing_volunteers = removing_volunteers.filter(function(volunteer) { 
            if (volunteer) return volunteer
        });

        if (removing_volunteers.length > 0) {
            var current_request = (await RequestRepository.readRequest({_id: requestID}))[0];
            current_request.admin_info.last_modified_time = new Date();
            current_request.status.volunteers.forEach(function(v, index, array) {
                if (removing_volunteers.filter(volunteer_id => volunteer_id === v.volunteer).length !== 0) {
                    array[index] = {
                        current_status: volunteer_status.REJECTED,
                        volunteer: v.volunteer,
                        last_notified_time: new Date()
                    }
                }
            });
            await RequestRepository.updateRequest(requestID, current_request);
        }

        let updatedRequest = (await RequestRepository.readRequest({_id: requestID}))[0];
        var matchedVolunteers = 0;
        updatedRequest.status.volunteers.forEach(volunteer => {
            if (volunteer.current_status === volunteer_status.IN_PROGRESS || volunteer_status.PENDING) {
                matchedVolunteers += 1;
            }
        });

        if (matchedVolunteers === 0) {
            await RequestRepository.updateRequest(requestID, {
                $set: {
                    'status.current_status': request_status.UNMATCHED
                }
            });
        }

        return updatedRequest;
        // TODO -> send emails

    } catch (e) {
        throw e;
    }
}

exports.createRequest = async function(request) {
    try {
        let new_request = request.status.volunteer ? await handleDirectMatch(request) : await handleGeneral(request);
        new_request.time_posted = new Date();
        new_request['admin_info'] = {
            last_modified_time: new Date()
        }
        new_request.volunteer_quota = request.status.volunteer_quota ? request.status.volunteer_quota : 1;
        return await RequestRepository.createRequest(new_request);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function handleDirectMatch(request) {
    // Construct a direct match request
    let volunteer_status_obj = {
        current_status: volunteer_status.PENDING,
        volunteer: request.status.volunteer._id,
        volunteer_response: "",
        adminMessage: "",
        last_notified_time: new Date()
    }
    let volunteer_statuses = [
        volunteer_status_obj
    ]
    var volunteer = request.status.volunteer;
    request['status'] = {
        current_status: request_status.MATCHED,
        volunteers: volunteer_statuses,
        completed_reason: "",
    }

    // Prepare email/pusher notifications
    var associationEmail = 'covaidco@gmail.com'
    if (request.association) {
        let association = await AssociationService.getAssociation({'_id': request.association});
        associationEmail = association.email;
    }
    var first_name = volunteer.first_name;
    first_name = first_name.toLowerCase();
    first_name = first_name[0].toUpperCase() + first_name.slice(1);
    var data = {
        sender: "Covaid@covaid.co",
        receiver: volunteer.email,
        name: first_name,
        assoc: associationEmail,
        templateName: "volunteer_notification",
    };
    emailer.sendNotificationEmail(data);
    pusher.trigger(volunteer._id, 'direct-match', 'You have a new pending request!');
    return request;
}

async function handleGeneral(request) {
    // Construct a general request
    request['status'] = {
        current_status: request_status.UNMATCHED,
        volunteers: [],
        completed_reason: "",
    }

    // Prepare email/pusher notifications
    var associationEmail = 'covaidco@gmail.com';
    var associationName = 'Covaid';
    if (request.association) {
        let association = (await AssociationService.getAssociation({'_id': request.association}))[0];
        associationEmail = association.email;
        associationName = association.name;
    }
    var data = {
        sender: "Covaid@covaid.co",
        receiver: associationEmail,
        name: request.personal_info.requester_name,
        assoc: associationName,
        templateName: "org_notification",
    };
    emailer.sendNotificationEmail(data);
    pusher.trigger(request.association, 'general', "You have a new unmatched request!");

    return request;
}

// TODO