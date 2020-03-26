const Users = require('../models/user.model');
const Offers = require('../models/offer.model');
const passport = require('passport');
var nodemailer = require('nodemailer');

function validateEmailAccessibility(email){
  return Users.findOne({email: email}).then(function(result){
       return result === null;
  });
}

exports.verify = function(req, res) {
  Users.findByIdAndUpdate(req.query.ID, 
      {"preVerified": true}, function(err, result){
    if(err){
        console.log("ERROR")
        res.sendStatus(500)
    }
    else{
        console.log("Success")
        res.sendStatus(200)
    }
  })
}

exports.register = function (req, res) {

    const { body: { user } } = req;
    if(!user.email) {
        return res.status(422).json({
        errors: {
            email: 'is required',
        },
        });
    }

    validateEmailAccessibility(user.email).then(function(valid) {
      if (valid) {
        if(!user.password) {
          return res.status(422).json({
            errors: {
                password: 'is required',
            },
          });
        }
      const finalUser = new Users(user);
  
      finalUser.setPassword(user.password);
      finalUser.preVerified = false;
      finalUser.verified = false;

      finalUser.save(function(err, result) {
        if (err) {    
          // Some other error
          return res.status(422).send(err);
        } 
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                 user: 'covaidco@gmail.com',
                 pass: 'supportyourcity_covaid_1?'
          }
        });
        var userID = result._id;
  
        var mode = "localhost:3000";
          if (process.env.PROD) {
              mode = "covaid.co"
          }
  
        var message = "Click here to verify: " + "http://" + mode + "/verify?ID=" + userID;
  
        var mailOptions = {
          from: 'covaidco@gmail.com',
          to: user.email,
          subject: 'Covaid -- Verify your email',
          text: message
      };
  
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
  
      return (userID === null) ? res.sendStatus(500) : res.status(201).send({'id': userID});
      });
      }
    });
};

exports.login = function (req, res, next) {
    const { body: { user } } = req;
    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(400).json({
          errors: {
            password: "incorrect",
          },
        });
      }
    })(req, res, next);
};

exports.current = function (req, res) {
  const id = req.token.id;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json(user.toJSON());
    });
};

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
  return d; // returns the distance in meter
}

exports.all_users = function (req, res) {
  Users.find({'availability': true,
              'location': 
                { $geoWithin: 
                  { $centerSphere: 
                    [[ req.query.longitude, req.query.latitude], 
                      20 / 3963.2] 
                  }
                }
    }).then(function (users) {
    // console.log(users);
    for (var i = 0; i < users.length; i++) {
      const coords = users[i].location.coordinates;
      const distance = calcDistance(req.query.latitude, req.query.longitude, coords[1], coords[0]);
      users[i]['distance'] = distance;
    }
    users.sort(function(a, b){return a['distance'] - b['distance']});
    res.send(users);
  });
}

exports.total_users = function (req, res) {
  Users.find({}).count(function(err, count) {
    res.send({'count': count});
  })
}

exports.update = function (req, res) {
  const id = req.token.id;
  Users.findByIdAndUpdate(id, {$set: req.body}, function (err, offer) {
    if (err) return next(err);
    res.send('User updated.');
  });
};
