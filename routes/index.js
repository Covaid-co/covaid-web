const express = require("express");
const router = express.Router();
const path = require("path");

// placeholder endpoint for testing purposes
router.get("/name", (req, res) => {
  res.send({ name: "Covaid --- via Express backend" });
});

const user_routes = require("./api/user.routes.js");
const request_routes = require("./api/request.routes.js");
const association_routes = require("./api/association_routes");
const beacon_routes = require("./api/beacon.routes");
const admin_routes = require("./api/association.admin.routes");
const orgsignup_routes = require("./api/orgsignup.routes.js");
const changelog_routes = require("./api/changelog.routes.js");
const apikey_routes = require("./api/apikey_routes.js");
const livenews_routes = require("./api/livenews.routes");
const infohub_routes = require("./api/infohub.routes.js");

router.use("/users", user_routes);
router.use("/request", request_routes);
router.use("/association", association_routes);
router.use("/beacon", beacon_routes);
router.use("/association-admin", admin_routes);
router.use("/orgsignup", orgsignup_routes);
router.use("/changelog", changelog_routes);
router.use("/apikey", apikey_routes);
router.use("/news", livenews_routes);
router.use("/infohub", infohub_routes);

module.exports = (app) => {
  app.use("/api", router);

  // set up React build files to be served from Express
  app.use(express.static(path.join(__dirname, "/../client/build")));

  // default to serving React files at all other endpoints
  // (this should always be the last routed endpoint)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../client/build/index.html"));
  });
};
