const BeaconRepository = require('../repositories/beacon.repository');
const BeaconStatusEnum = {"active":1, "inactive":2, "delete":3}

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
                    volunteer_id: volunteer,
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
        return await BeaconRepository.createBeacon(constructedBeacon);

    } catch (e) {
        throw e;
    }
}
