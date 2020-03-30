const Association = require('../models/association.model');
var geocoding = new require('reverse-geocoding');

exports.association_details = function (req, res) {
    Association.findById(req.query.associationID, function (err, association) {
        if (err) return res.send(err);
        res.send(association);
    })
};

exports.all = function (req, res) {
    Association.find({}).then(function (offers) {
        res.send(offers);
    });
};

exports.update_association = function (req, res) {
  const id = req.query.associationID;
  const { body: { association } } = req
  Association.findByIdAndUpdate(id, {$set: association}, function (err, offer) {
    if (err) return next(err);
    res.send('Association updated.');
  });
};

exports.create_association = function (req, res) {
    const { body: { association } } = req;

    let newAssociation = new Association(association)
    newAssociation.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Association created successfully')
        }
    })
};

exports.assoc_by_lat_long = function (req, res) {
    var latitude = req.query.latitude
    var longitude = req.query.longitude

    Association.find({
              'location': 
                { $geoWithin: 
                  { $centerSphere: 
                    [[ latitude, longitude], 
                      20 / 3963.2] 
                  }
                }
    }).then(function (associations) {
        res.send(associations)
        }
    )
};