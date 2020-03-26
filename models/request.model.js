const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let RequestSchema = new Schema({
    requester_first: String,
    requester_last: String,
    requester_email: String,
    requester_phone: String,
    payment: Number,
    offerer_email: String,
    offerer_id: String,
    details: String,
    completed: Boolean,
});

module.exports = mongoose.model('Requests', RequestSchema);