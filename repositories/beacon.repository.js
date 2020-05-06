const Beacon = require('../models/beacon.model'); 
const BeaconStatusEnum = {"active":1, "inactive":2, "complete":3, "delete": 4};

exports.createBeacon = async function (beacon) {
    try {
        let newBeacon = new Beacon(beacon);
        await newBeacon.save();
        return newBeacon;
    } catch (e) {
        throw e;
    }
}

exports.readBeacon = async function (query) {
    try {
        var beacons = await Beacon.find(query);
        return beacons;
    } catch (e) {
        throw Error('Error while querying requests');
    }
}

exports.getBeaconsForAVolunteer = async function (_id) {
    try {
        var beacons = await Beacon.find(
            { 
                beaconStatus: BeaconStatusEnum.active,
                volunteers: 
                    { $elemMatch: 
                        { 
                            volunteer_id: _id 
                        } 
                    } 
                }
        );
        return beacons;
    } catch (e) {
        throw Error('Error while querying requests');
    }
}

exports.updateBeacon = async function(_id, updates) {
    try {
        await Beacon.updateOne({_id: _id}, {
            $set: updates 
        });
    } catch (e) {
        throw Error('Error while updating requests');
    }
}

exports.updateBeaconWithVolunteer = async function(user_id, beacon_id, updates) {
    try {
        var beacon = await Beacon.findByIdAndUpdate({_id: beacon_id}, updates);
        var foundIndex = beacon.volunteers.findIndex(volunteer => volunteer.volunteer_id == user_id);
        beacon.volunteers[foundIndex].response =  updates.response;
        beacon.volunteers[foundIndex].responseMessage =  updates.responseMessage;
        await beacon.save();
        if (!beacon) {
            throw Error('No beacon found'); 
        }
    } catch (e) {
        console.log(e);
        throw Error('Error while updating requests');
    }
}

exports.deleteBeacon = async function(_id) {
    try {
        await Beacon.findByIdAndRemove(_id);
    } catch (e) {
        throw Error('Error while deleting request')
    }
}