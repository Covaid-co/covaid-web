const Association = require('../models/association.model');
var geocoding = new require('reverse-geocoding');
const passport = require('passport');

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

function validateEmailAccessibility(email){
    return Association.findOne({email: email}).then(function(result){
         return result === null;
    });
  }

exports.create_association = function (req, res) {
    const { body: { association } } = req;

    if(!association.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    validateEmailAccessibility(association.email).then(function(valid) {
      if (valid) {
          if(!association.password) {
            return res.status(422).json({
              errors: {
                  password: 'is required',
              },
          });
        }

        let newAssociation = new Association(association)
        newAssociation.setPassword(association.password);
        newAssociation.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Association created successfully')
            }
        })
      } else {
        return res.status(403).json({
          errors: {
              email: 'Already Exists',
          },
        });
      }
    });
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

exports.current = function (req, res) {
  const id = req.token.id;

  return Association.findById(id)
    .then((association) => {
      if(!association) {
        return res.sendStatus(400);
      }
      return res.json(association);
  });
};

exports.login = function (req, res, next) {
    const { body: { association } } = req;
    if(!association.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!association.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('associationLocal', { session: false }, (err, passportAssociation, info) => {
      if(err) {
        return next(err);
      }
      if(passportAssociation) {
        const association = passportAssociation;
        association.token = passportAssociation.generateJWT();
        return res.json({ user: association.toAuthJSON() });
      } else {
        return res.status(400).json({
          errors: {
            password: "incorrect",
          },
        });
      }
    })(req, res, next);
};