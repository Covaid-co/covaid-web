const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var requesterInfoSchema = new Schema({ 
    requester_name: {type: String, required: true},
    requester_phone: {type: String, required: false},
    requester_email: {type: String, required: false},
    languages: {type: [String], required: true}
}, { noId: true });

var locationSchema = new Schema({ 
    location: {
        type: { type: String },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
    },
    association: {type: String, required: true},
}, { noId: true });

var requestInfoSchema = new Schema({
    payment: {type: Number, required: true},
    details: {type: String, required: true},
    time: {type: String, required: true},
    date: {type: String, required: true},
    resource_request: {type: [String], required: true},
}, {noId: true });

var adminInfoSchema = new Schema({
    assignee: {type: String, required: false},
    note: {type: String, required: false},
    delete: {type: Boolean, required: false}
}, {noId: true });

var requestStatusSchema = new Schema({
    currentStatus: {type: String, required: true},
    volunteer_id: {type: String, required: false},
    completion_reason: {type: String, required: false},
    statusTimestamp: {type: Date, required: false}
}, {noId: true });

let RequestSchema = new Schema({
    requesterInfo: {type: requesterInfoSchema, required: true},
    locationInfo: {type: locationSchema, required: true},
    requestInfo: {type: requestInfoSchema, required: true},
    adminInfo: {type: adminInfoSchema, required: false},
    requestStatus: {type: requestStatusSchema, required: true},
    time_posted: Date,
    last_modified: Date
});

module.exports = mongoose.model('Requests', RequestSchema);