const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var personalInfoSchema = new Schema({ 
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    pronouns: {type: String, required: false},
    phone: {type: String, required: false},
    car: {type: Boolean, requried: true},
    timesAvailable: {type: [String], required: true},
    languages: {type: [String], required: true}
}, { noId: true });

var offerSchema = new Schema({ 
    tasks: {type: [String], required: true},
    availability: {type: Boolean, required: true},
    details: {type: String, required: true}
}, { noId: true });

var passwordSchema = new Schema({ 
    hash: {type: String, required: true},
    salt: {type: String, required: true},
}, { noId: true });

var locationSchema = new Schema({ 
    location: {
        type: { type: String },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
    },
    neighborhoods: {type: [String], required: false},
    state: {type: [String], required: false},
    association: {type: String, required: false},
    association_name: {type: String, required: false},
}, { noId: true });

var logisticsSchema = new Schema({ 
    verified: {type: Boolean},
    agreedToTerms: {type: Boolean},
    note: {type: String},
}, { noId: true });

let UserSchema = new Schema({
    email: {type: String, required: true},
    personal_info: {type: personalInfoSchema, required: true},
    offer: {type: offerSchema, required: true},
    password_components: {type: passwordSchema, required: true},
    location_info: {type: locationSchema, required: true},
    logistics: {type: logisticsSchema, required: true}
});


// UserSchema.methods.setPassword = function(password) {
//     this.salt = crypto.randomBytes(16).toString('hex');
//     this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
// };

// UserSchema.methods.validatePassword = function(password) {
//     const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//     return this.hash === hash;
// };

// UserSchema.methods.generateJWT = function() {
//     const today = new Date();
//     const expirationDate = new Date(today);
//     expirationDate.setDate(today.getDate() + 60);
//     const secret = process.env.SECRET || "secret"
//     return jwt.sign({
//     email: this.email,
//     id: this._id,
//     exp: parseInt(expirationDate.getTime() / 1000, 10),
//     }, secret);
// }

// UserSchema.methods.toAuthJSON = function() {
//     return {
//         _id: this._id,
//         email: this.email,
//         token: this.generateJWT(),
//     };
// };

// UserSchema.methods.toJSON = function() {
//     return {
//         _id: this._id,
//         email: this.email,
//         phone: this.phone,
//         first_name: this.first_name,
//         last_name: this.last_name,
//         availability: this.availability,
//         latlong: this.location.coordinates,
//         offer: {
//             neighborhoods: this.offer.neighborhoods,
//             tasks: this.offer.tasks,
//             details: this.offer.details,
//             car: this.offer.car,
//             timesAvailable: this.offer.timesAvailable,
//             state: this.state
//         },
//         association: this.association,
//         association_name: this.association_name,
//         languages: this.languages,
//         preVerified: this.preVerified,
//         note: this.note,
//         pronouns: this.pronouns,
//     };
// };

module.exports = mongoose.model('User', UserSchema);