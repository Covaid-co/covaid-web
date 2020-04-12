const Association = require('../models/association.model');
const AssociationResources = require('../models/association-resources.modal');
const passport = require('passport');
const asyncWrapper = require('../util/asyncWrapper');
var jwt = require('jwt-simple');
const emailer =  require("../util/emailer");

exports.add_resource_link = function (req, res) {
  const id = req.body.associationID;
  var link = req.body.link;
  var name = req.body.name;
  console.log(req.body);
  let newResources = new AssociationResources({'link': link, 'name': name});
  console.log(newResources)
  Association.findByIdAndUpdate(id, {$push: {'links': newResources}}, {safe: true, upsert: true},
    function (err, doc) {
      if (err) {
        console.log(err);
        return;
      }
      res.send('Resource added');
    }
  )
}

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

exports.add_admin = function (req, res) {
  const id = req.body.associationID;
  const email = req.body.email;
  const name = req.body.name;
  Association.findByIdAndUpdate(id, 
    {$push: {'admins': {'email': email, 'name': name}}}, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send('Admin added');
      }
    }
  );
};

function validateEmailAccessibility(email){
  return Association.findOne({email: email}).then(function(result){
    return result === null;
  });
}

exports.create_association = function (req, res) {
    const { body: { association } } = req;
    console.log(req.body);

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

exports.emailPasswordResetLink = asyncWrapper(async (req, res) => {
  if (req.body.email !== undefined) {
    var emailAddress = req.body.email;
    Association.findOne({email: emailAddress}, function (err, association) {
      if (err) {
        return res.sendStatus(403)
      }
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setMinutes(today.getMinutes() + 5);
      if (association) {
        var payload = {
          id: association._id,        // User ID from database
          email: emailAddress,
        };
        var secret = association.hash;
        var token = jwt.encode(payload, secret);
        emailer.sendAssocPasswordLink(emailAddress, payload.id, token);
        res.sendStatus(200)
      } else {
        return res.status(403).send('No accounts with that email')
      }
    })
  } else {
    return res.status(422).send('Email address is missing.')
  }
});

exports.verifyPasswordResetLink = asyncWrapper(async (req, res) => {
  const association = await Association.findById(req.params.id)
  var secret = association.hash;
  try{
    var payload = jwt.decode(req.params.token, secret);   
    res.sendStatus(200)      
  }catch(error){
    console.log(error.message);
    res.sendStatus(403);
  }
});

exports.resetPassword = asyncWrapper(async (req, res) => {
  var newPassword = req.body.newPassword
  // update password
  const association = await Association.findById(req.body.id)
  association.setPassword(newPassword)
  association.save(function(err, result) {
    if (err) {    
      return res.status(422).send(err);
    } 
    res.sendStatus(200)
  })
});

var rad = function(x) {
  return x * Math.PI / 180;
};

function calcDistance(latA, longA, latB, longB) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(latB - latA);
  var dLong = rad(longB - longA);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(latA)) * Math.cos(rad(latB)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

exports.assoc_by_lat_long = asyncWrapper(async (req, res) => {
    var latitude = req.query.latitude
    var longitude = req.query.longitude

    var associations = await Association.find({});
    var relevantAssociations = []

    for (var i = 0; i < associations.length; i++) {
        var currentAssociation = associations[i]
        if (currentAssociation.name !== "Covaid") {
          var rad = currentAssociation.radius
          var currentAssociationLat = currentAssociation.location.coordinates[0]
          var currentAssociationLong = currentAssociation.location.coordinates[1]
          var distance = calcDistance(latitude, longitude, currentAssociationLat, currentAssociationLong) / 1609.34
          if (distance <= rad) {
            relevantAssociations.push(currentAssociation)
          }
        }
    }
    res.send(relevantAssociations)
});

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