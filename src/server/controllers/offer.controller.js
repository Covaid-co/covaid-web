const Offer = require('../models/offer.model');
const Client = require("@googlemaps/google-maps-services-js").Client;
const client = new Client({});

exports.test = function (req, res) {
    res.send('Greetings from the offer controller!');
};

exports.offer_create = function (req, res) {
    // const user = req.currentUser;
    // Hard-coded for now
    const user_id = 123
    console.log(req.body)
    let offer = new Offer(
        {
            task: req.body.task,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            neighborhood_name: req.body.neighborhood_name,
            description: req.body.description,
            user_id: user_id
        }
    );

    const varLatLong = offer.latitude.toString() + ',' + offer.longitude.toString();

    client.geocode({
        params: {
        latlng: varLatLong,
          key: 'AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY'
        },
        timeout: 1000 // milliseconds
    })
    .then(r => {
        neighborhoods = [];
        for (var i = 0; i < r.data.results.length; i++) {
            results = r.data.results[i]['address_components'];
            for (var j = 0; j < results.length; j++) {
                types = results[j].types;
                if (types.includes('neighborhood')) {
                    currNeighborhoodName = results[j]['long_name'];
                    if (neighborhoods.includes(currNeighborhoodName) == false) {
                        neighborhoods.push(currNeighborhoodName);
                    }
                }
            }
        }
        console.log(neighborhoods);
    })
    .catch(e => {
        console.log(e);
    });

    // offer.save(function (err) {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         res.send('Offer created successfully')
    //     }
    // })
};

exports.all_offers = function (req , res) {
    Offer.find({}).then(function (offers) {
        res.send(offers);
    });
};

exports.offer_details = function (req, res) {
    Offer.findById(req.params.id, function (err, offer) {
        if (err) return next(err);
        res.send(offer);
    })
};

exports.offer_update = function (req, res) {
    Offer.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, offer) {
        if (err) return next(err);
        res.send('Offer udpated.');
    });
};

exports.offer_delete = function (req, res) {
    Offer.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};