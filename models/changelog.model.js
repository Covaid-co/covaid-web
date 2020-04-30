const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ChangeLogSchema = new Schema({
    date: String,
    features: [String],
    improvements: [String],
    fixes: [String]
});

module.exports = mongoose.model('ChangeLog', ChangeLogSchema);