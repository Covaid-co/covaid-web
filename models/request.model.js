const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let RequestSchema = new Schema({
    requester_first: String,
    requester_last: String,
    requester_email: String,
    requester_phone: String,
    resource_request: [String],
    languages: [String],
    association: String,
    latitude: Number,
    longitude: Number,
    payment: Number,
    details: String,
    time: String,
    date: String,
    status: String,
    volunteer: String
});

module.exports = mongoose.model('Requests', RequestSchema);