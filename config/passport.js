const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('User');
const Association = mongoose.model('Association');

passport.use('userLocal', new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));

passport.use('associationLocal', new LocalStrategy({
  usernameField: 'association[email]',
  passwordField: 'association[password]',
}, (email, password, done) => {
  Association.findOne({ email })
    .then((association) => {
      if(!association || !association.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, association);
    }).catch(done);
}));