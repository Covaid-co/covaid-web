const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let RequestSchema = new Schema({
    requester_email: String,
    requester_phone: String,
    offerer_email: String,
    offerer_id: String,
    details: String,
    completed: Boolean,
});

module.exports = mongoose.model('Requests', RequestSchema);