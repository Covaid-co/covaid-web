const jwt = require("express-jwt");
const jwtMobile = require("jsonwebtoken");
var jwtDecode = require("jwt-decode");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwtMobile.verify(token, process.env.ACCESS_SECRET, (err, authUser) => {
    if (err) {
      console.log(
        "Yeah verify failed, why? Maybe because your token expired " +
          (jwtDecode(token).exp * 1000 - Date.now()) / 60000 +
          " minutes ago"
      );
      return res.sendStatus(403);
    }
    req.authUser = authUser;
    next();
  });
};

const authenticateRefresh = (req, res, next) => {
  console.log("HII");
  const authHeader = req.headers["Authorization"];
  const refresh = authHeader && authHeader.split(" ")[1];
  if (refresh == null) {
    return res.sendStatus(401);
  }
  jwtMobile.verify(refresh, process.env.REFRESH_SECRET, (err, authUser) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.authUser = authUser;
    next();
  });
};

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Token") {
    return authorization.split(" ")[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.SECRET || "secret",
    userProperty: "token",
    getToken: getTokenFromHeaders,
  }),
  authenticate: authenticate,
  authenticateRefresh: authenticateRefresh,
  optional: jwt({
    secret: process.env.SECRET || "secret",
    userProperty: "token",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
