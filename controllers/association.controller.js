const Association = require('../models/association.model');
var geocoding = new require('reverse-geocoding');

exports.association_details = function (req, res) {
    Association.findById(req.params.id, function (err, association) {
        if (err) return res.send(err);
        res.send(association);
    })
};

exports.all = function (req, res) {
    Association.find({}).then(function (offers) {
        res.send(offers);
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
    const { body: { location } } = req;
    var config = {
        'latitude': location.latitude,
        'longitude': location.longitude, 
        'key': "AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY"
    };
    geocoding(config, function (err, data){
        if(err){
            res.send(err)
        } else{
            var prevLocality = '';
            var locality = '';
            for (var i = 0; i < Math.min(4, data.results.length); i++) {
                const results = data.results[i]['address_components'];
                for (var j = 0; j < results.length; j++) {
                  const types = results[j].types;
                  // find neighborhood from current location
                  for (var k = 0; k < types.length; k++) {
                    const type = types[k];
                    if (type.includes('administrative_area_level')) {
                      if (locality === '') {
                        locality = prevLocality;
                      }
                    }
                  }
                  prevLocality = results[j]['long_name'];
                }
            }
            console.log(locality)
            Association.find({'city': locality}).then(function (associations) {
                res.send(associations)
            })       
        }
    });
};