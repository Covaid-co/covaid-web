const BeaconRepository = require('../repositories/beacon.repository');
const BeaconStatusEnum = {"active":1, "inactive":2, "complete":3, "delete": 4};

const UserService = require('./user.service');

const emailer = require('../util/emailer');


exports.getQueriedBeacons = async function(query) {
    try {
        return await BeaconRepository.readBeacon(query);
    } catch (e) {
        throw e;
    }
}

exports.getBeaconsByUserID = async function(_id) {
    try {
        return await BeaconRepository.getBeaconsForAVolunteer(_id);
    } catch (e) {
        throw e;
    }
}

exports.updateBeacon = async function(_id, updates) {
    try {
        await BeaconRepository.updateBeacon(_id, updates);
    } catch (e) {
        throw e;
    }
}

exports.userAction = async function(user_id, beacon_id, updates) {
    try {
        await BeaconRepository.updateBeaconWithVolunteer(user_id, beacon_id, updates);
    } catch (e) {
        throw e;
    }
}

exports.createBeacon = async function (auth_id, beacon) {
    try {
        var volunteerResponse = [];
        beacon.volunteers.forEach(volunteer => {
            volunteerResponse.push(
                {
                    volunteer_id: volunteer._id,
                    volunteer_first: volunteer.first_name,
                    volunteer_last: volunteer.last_name,
                    volunteer_email: volunteer.email,
                    volunteer_phone: volunteer.phone,
                    response: false
                }
            );
        });
        var constructedBeacon = {
            association_id: auth_id,
            volunteers: volunteerResponse,
            beaconName: beacon.beaconName,
            beaconMessage: beacon.beaconMessage,
            beaconStatus: BeaconStatusEnum.active,
            beaconStartDate: new Date(beacon.beaconStartDate),
            beaconEndDate: new Date(beacon.beaconEndDate)
        };
        let savedBeacon =  await BeaconRepository.createBeacon(constructedBeacon);

        const users = await UserService.getUsersByUserIDs(beacon.volunteers);
        users.forEach(user => {
            console.log("Sending beacon to " + user.email);
            var data = {
                //sender's and receiver's email
                sender: "Covaid@covaid.co",
                receiver: user.email,
                beacon: savedBeacon.beaconName,
                templateName: "beacon",
             };
            emailer.sendBeaconEmail(data);
        });
        return savedBeacon;
    } catch (e) {
        console.log(e);
        throw e;
    }
}
