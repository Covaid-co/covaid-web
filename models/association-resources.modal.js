const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var AssociationResources = new Schema({
    name: {type: String, required: true},
    link: {type: String, required: true}
})

module.exports = mongoose.model('AssociationResources', AssociationResources);