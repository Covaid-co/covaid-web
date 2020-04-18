const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var adminSchema = new Schema({ 
    name: {type: String, required: true},
    email: {type: String, required: true},
    hash: {type: String, required: false},
    salt: {type: String, required: false},
});

module.exports = mongoose.model('AssociationAdmin', adminSchema);