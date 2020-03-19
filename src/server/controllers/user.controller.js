const Users = require('../models/user.model');
const passport = require('passport');

exports.register = function (req, res) {
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
    
    const finalUser = new Users(user);
    
    finalUser.setPassword(user.password);
    
    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
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

      return res.json({ user: user.toJSON() });
    });
};

exports.updateAvailability = function (req, res) {
  const id = req.token.id;
  Users.findByIdAndUpdate(id, {$set: req.body}, function (err, offer) {
    if (err) return next(err);
    res.send('User udpated.');
  });
};
