const Users = require('../models/user.model');
const Offers = require('../models/offer.model');
const passport = require('passport');
var nodemailer = require('nodemailer');
const {GoogleSpreadsheet }= require('google-spreadsheet')
const creds = require('../client_secret.json')
const association_controller = require('./association.controller'); 


function validateEmailAccessibility(email){
  return Users.findOne({email: email}).then(function(result){
       return result === null;
  });
}

async function updateUserInSpreadsheet(id, updates, spreadsheetID) {
  console.log(updates)
  const doc = new GoogleSpreadsheet(spreadsheetID);
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets

  // create a sheet and set the header row
  const volunterSheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

  const rows = await volunterSheet.getRows();
  var updateRow;
  for (i = 0; i < rows.length; i++) {
    if (rows[i].ID == id) {
      updateRow = rows[i];
    }
  }
  updateRow.Neighborhood = updates.offer.neighborhoods.join(", ")
  updateRow.Details = updates.offer.details
  updateRow.Resource = updates.offer.tasks.join(", ")
  updateRow.Car = updates.offer.car.toString()
  updateRow.TimeOfAvailability = updates.offer.timesAvailable.join(", ")
  updateRow.Languages = updates.languages.join(", ")
  updateRow.Phone = updates.phone
  updateRow.AvailabilityStatus = updates.availability.toString()

  // console.log(updateRow)
  await updateRow.save()
}

async function addUserToSpreadsheet(user, ID, spreadsheetID) {
  const doc = new GoogleSpreadsheet(spreadsheetID);
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets

  // create a sheet and set the header row
  const volunterSheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
  
  // append rows 
  await volunterSheet.addRow({ 
    ID: ID,
    Timestamp: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
    AvailabilityStatus: user.availability.toString(),
    Name: user.first_name + " " + user.last_name,
    Email: user.email, 
    Phone: user.phone,
    Languages: user.languages.join(", "),
    Agreement: true
  });

}

exports.verify = function(req, res) {
  Users.findByIdAndUpdate(req.query.ID, 
      {"preVerified": true}, function(err, result){
    if(err){
        console.log("ERROR");
        res.sendStatus(500);
    }
    else{
        console.log("Success");
        res.sendStatus(200);
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
        finalUser.agreedToTerms = true;

        finalUser.save(function(err, result) {
          if (err) {    
            return res.status(422).send(err);
          } 

          var userID = result._id;
          if (user.association == "5e8414970f41a53dae08de51") {
            // PITT
            addUserToSpreadsheet(finalUser, userID, '1l2kVGLjnk-XDywbhqCut8xkGjaGccwK8netaP3cyJR0')
          } else if (user.association == "5e8414e40f41a53dae08de52") {
            addUserToSpreadsheet(finalUser, userID, '1N1uWTVLRbmuVIjpFACSK-8JsHJxewcyjqUssZWgRna4') 
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

          // if user association is baltimore, send google forms link
          if (user.association == '5e8414e40f41a53dae08de52') {
            message = "Verify your account here: https://forms.gle/aTxAbGVC49ff18R1A . You will be contacted within 24 hours once your account account is verified!"
          }
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
      } else {
        return res.status(403).json({
          errors: {
              email: 'Already Exists',
          },
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
  
    return passport.authenticate('userLocal', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        const user = passportUser;
        if (passportUser.preVerified) {
          user.token = passportUser.generateJWT();
          return res.json({ user: user.toAuthJSON() });
        } else {
          return res.status(400).json({
            errors: {
              verifed: "unverifed",
            },
          });
        }
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

async function updatePreVerified() {
  await Users.updateMany({}, 
    {'$set': {
      'languages': ['English'],
      'offer.car': false,
      'offer.timesAvailable': [],
      'association': '',
      'association_name': '',
      'agreedToTerms': true,
      'verified': false
      }
    })
}

exports.all_users_of_an_association = function (req, res) {
  var assoc = req.query.association;
  Users.find({
      'association': assoc
    }).then(function (users) {
    
    res.send(users);
  });
}

exports.all_users = function (req, res) {
  Users.find({'availability': true,
              'preVerified': true,
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
  Users.find({'preVerified': true}).count(function(err, count) {
    res.send({'count': count});
  })
}

exports.update = function (req, res) {
  const id = req.token.id;

  if (req.body.association == "5e8414970f41a53dae08de51") {
    // PITT
    updateUserInSpreadsheet(id, req.body, '1l2kVGLjnk-XDywbhqCut8xkGjaGccwK8netaP3cyJR0')
  } else if (req.body.association == "5e8414e40f41a53dae08de52") {
    // BALTI
    updateUserInSpreadsheet(id, req.body, '1N1uWTVLRbmuVIjpFACSK-8JsHJxewcyjqUssZWgRna4') 
  }
  
  Users.findByIdAndUpdate(id, {$set: req.body}, function (err, offer) {
    if (err) return next(err);
    
    res.send('User updated.');
  });
};
