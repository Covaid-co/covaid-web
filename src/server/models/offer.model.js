const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OfferSchema = new Schema({
    task: {type: String, required: true, max: 100},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    neighborhood_name: {type: String, required: true, max: 100},
    description: {type: String, max: 500},
    user_id: {type: String, required: true}
});


// Export the model
module.exports = mongoose.model('Offer', OfferSchema);