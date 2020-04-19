const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var associationResourcesSchema = require('./association-resources.model').schema;
var adminSchema = require('./association-admin.model').schema;

const Schema = mongoose.Schema;

var locationSchema = new Schema({ 
    city: {type: String, required: true},
    location: {
        type: { type: String, required: true },
        coordinates: {
            type: [Number],
            index: "2dsphere",
            required: true
        }
    },
    radius: {type: Number, required: true}
}, { noId: true });

let AssociationSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    homepage: {type: String, required: true},
    resources: {type: [String], required: true},
    links: {type: [associationResourcesSchema], required: true},
    locationInfo: { type: locationSchema, required: true},
    password: {
        hash: {type: String, required: true},
        salt: {type: String, required: true}
    },
    admins: {type: [adminSchema], required: true},
    created_on: {type: Date, required: true}
});

AssociationSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

AssociationSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

AssociationSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const secret = process.env.SECRET || "secret"
    return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, secret);
}

AssociationSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model('Association', AssociationSchema);