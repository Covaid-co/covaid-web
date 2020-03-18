const Offer = require('../models/offer.model');

exports.test = function (req, res) {
    res.send('Greetings from the offer controller!');
};

exports.offer_create = function (req, res) {
    // const user = req.currentUser;
    // Hard-coded for now
    const user_id = 123
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

    offer.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Offer created successfully')
    })
};