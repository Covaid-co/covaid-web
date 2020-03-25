const Users = require('../models/user.model');
const Offers = require('../models/offer.model');
const passport = require('passport');

function validateEmailAccessibility(email){
  return Users.findOne({email: email}).then(function(result){
       return result === null;
  });
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
      
      return finalUser.save()
          .then(() => res.json({ user: finalUser.toAuthJSON() }));
      } else {
        return res.status(422).json({
          errors: {
            email: 'already exists',
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
    res.send(users);
  });
}

exports.total_users = function (req, res) {
  Users.find({}).count(function(err, count) {
    console.log(count);
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
