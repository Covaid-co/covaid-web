const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let VolunteerResponse = new Schema({
    volunteer_id: {type: String, required: true},
    response: {type: Boolean, required: false},
    responseMessage: {type: String, required: false}
}, {noId: true});

let BeaconSchema = new Schema({
    association_id: {type: String, require: true},
    volunteers: {type: [VolunteerResponse], required: true},
    beaconName: {type: String, required: true},
    beaconMessage: {type: String, required: true},
    beaconStatus: {type: Number, required: true},
    beaconStartDate: {type: Date, required: true},
    beaconEndDate: {type: Date, required: true}
});

module.exports = mongoose.model('Beacons', BeaconSchema);