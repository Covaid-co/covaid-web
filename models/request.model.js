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
    time_posted: Date,
    date: String,
    note: String,
    adminMessage: String,
    assignee: String,
    delete: Boolean,
    last_modified: Date,
    manual_match: {
        name: String,
        email: String,
        phone: String,
        details: String
    },
    status: {
        current_status: String,
        volunteer: String,
        reason: String
    },
    prev_matched: [String],
    volunteer_status: String,
    volunteer_comment: String,
    pending_time: Date,
    completed_date: Date
});

module.exports = mongoose.model('Requests', RequestSchema);