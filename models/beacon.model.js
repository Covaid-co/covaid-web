const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let VolunteerResponse = new Schema({
    volunteer_id: {type: String, required: true},
    volunteer_first: {type: String, required: true},
    volunteer_last: {type: String, required: true},
    volunteer_email: {type: String, required: true},
    volunteer_phone: {type: String, required: false},
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