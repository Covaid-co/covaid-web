const Users = require("../models/user.model");
const passport = require("passport");
const jwtMobile = require("jsonwebtoken");
const asyncWrapper = require("../util/asyncWrapper");
var jwtDecode = require("jwt-decode");
require("dotenv").config();
const RefreshTokens = require("../models/mobile.models");
const RequestService = require("../services/request.service");
/**
 * Handle requests to login a user (MOBILE)
 */
exports.loginMobile = function (req, res, next) {
  const {
    body: { user },
  } = req;
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }

  return passport.authenticate(
    "userLocal",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }
      if (passportUser) {
        const user = passportUser;
        if (passportUser.preVerified) {
          user.token = generateJWTMobile(user);
          console.log("AUTH TOKEN: ", user.token);
          console.log(
            "EXPIRY: ",
            jwtDecode(user.token).exp * 1000 - Date.now()
          );
          user.refresh = generateRefresh(user);
          console.log("REFRESH TOKEN: ", user.refresh);
          RefreshTokens.create({ user_id: user._id, key: user.refresh })
            .then(() => {
              return res.json({
                user: {
                  _id: user._id,
                  token: user.token,
                  refresh: user.refresh,
                },
              });
            })
            .catch((err) => {
              console.log("Err: " + err);
              res.sendStatus(500);
            });
        } else {
          return res.status(403).json({
            errors: {
              verifed: "unverifed",
            },
          });
        }
      } else {
        return res.status(401).json({
          errors: {
            password: "incorrect",
          },
        });
      }
    }
  )(req, res, next);
};

exports.refresh = function (req, res) {
  console.log("HII");
  const refresh = req.body.refresh;
  if (refresh === null) {
    return res.sendStatus(401);
  }
  return RefreshTokens.findOne({ key: refresh })
    .then(function (result) {
      if (result === null) {
        console.log("Doesn't include " + refresh + " in refreshTokens array");
        return res.sendStatus(403);
      }
      jwtMobile.verify(refresh, process.env.REFRESH_SECRET, (err) => {
        if (err) {
          res.sendStatus(400);
        }
        Users.findById(result.user_id)
          .then((user) => {
            if (!user) {
              console.log("NO USER FOUND W ID");
              res.sendStatus(400);
            }
            const token = generateJWTMobile(user);
            return res.json({ accessToken: token });
          })
          .catch((err) => {
            throw err;
          });
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.logoutMobile = function (req, res) {
  // remove refresh token from database
  console.log("REFRESH: ", req.body.refresh);
  RefreshTokens.deleteOne({ key: req.body.refresh })
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
  // RefreshTokens = RefreshTokens.filter((token) => token !== req.body.token);
};
/**
 * Handle requests to get the current logged in user
 */

exports.currentMobile = function (req, res) {
  const id = req.authUser.id;
  return Users.findById(id).then((user) => {
    if (!user) {
      res.sendStatus(400);
    }
    return res.json(user.toJSON());
  });
};

const generateJWTMobile = (user) => {
  const secret = process.env.ACCESS_SECRET || "secret";
  return jwtMobile.sign(
    {
      email: user.email,
      id: user._id,
    },
    secret,
    { expiresIn: "2m" }
  );
};

exports.handleGetVolunteerRequestsMobile = asyncWrapper(async (req, res) => {
  try {
    var requests = await RequestService.getVolunteerRequests(
      req.authUser.id,
      req.query.status
    );
    res.send(requests);
  } catch (e) {
    res.sendStatus(400);
  }
});

const generateRefresh = (user) => {
  const secret = process.env.REFRESH_SECRET || "secret";
  return jwtMobile.sign(
    {
      email: user.email,
      id: user._id,
    },
    secret
  );
};
