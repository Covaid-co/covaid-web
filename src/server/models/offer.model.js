const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OfferSchema = new Schema({
    task: {type: [String], required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    neighborhoods: {type: [String], required: true},
    description: {type: String, max: 500},
    user_id: {type: String, required: true}
});


// Export the model
module.exports = mongoose.model('Offer', OfferSchema);