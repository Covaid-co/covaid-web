const asyncWrapper = require("../util/asyncWrapper");
const AssociationAdminService = require("../services/association.admin.service");
const AssociationAdmin = require("../models/association.admin.model");
const emailer = require("../util/emailer");
var jwt = require("jwt-simple");

/**
 * Handle requests to register an admin
 */
exports.handleRegisterRequest = asyncWrapper(async (req, res) => {
  const {
    body: { admin },
  } = req;
  if (!admin.association_id) {
    return res.status(422).json({
      errors: {
        association: "is required",
      },
    });
  }

  if (!admin.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }
  admin.email = admin.email.toLowerCase();

  if (!admin.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }

  try {
    const new_admin = await AssociationAdminService.registerAdmin(admin);
    return new_admin._id === null
      ? res.sendStatus(500)
      : res.status(201).send({ _id: new_admin._id });
  } catch (e) {
    return res.status(422).send(e);
  }
});

/**
 * Handle requests to login
 */
exports.handleLoginRequest = asyncWrapper(async (req, res) => {
  const {
    body: { admin },
  } = req;
  if (!admin.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!admin.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }

  try {
    let result = await AssociationAdminService.login_admin(admin);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(422).send({
      error: e.message,
    });
  }
});

/**
 * Get current admin who is logged in
 */
exports.handleGetCurrentAdmin = function (req, res) {
  const id = req.token.id;
  return AssociationAdminService.get_admin_by_id(id).then((admin) => {
    if (admin.length === 0) {
      return res.sendStatus(400);
    }
    return res.json(admin[0]);
  });
};

exports.emailPasswordResetLink = asyncWrapper(async (req, res) => {
  if (req.body.email !== undefined) {
    var emailAddress = req.body.email;
    AssociationAdmin.findOne(
      { email: { $regex: new RegExp(emailAddress, "i") } },
      function (err, associationadmin) {
        if (err) {
          return res.sendStatus(403);
        }
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setMinutes(today.getMinutes() + 5);
        if (associationadmin) {
          var payload = {
            id: associationadmin._id, // User ID from database
            email: emailAddress,
          };
          var secret = associationadmin.password.hash;
          var token = jwt.encode(payload, secret);
          emailer.sendAssocAdminPasswordLink(emailAddress, payload.id, token);
          res.sendStatus(200);
        } else {
          return res.status(403).send("No accounts with that email");
        }
      }
    );
  } else {
    return res.status(422).send("Email address is missing.");
  }
});

exports.verifyPasswordResetLink = asyncWrapper(async (req, res) => {
  const associationadmin = await AssociationAdmin.findById(req.params.id);
  var secret = associationadmin.password.hash;
  try {
    var payload = jwt.decode(req.params.token, secret);
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(403);
  }
});

exports.resetPassword = asyncWrapper(async (req, res) => {
  var newPassword = req.body.newPassword;
  // update password
  const associationadmin = await AssociationAdmin.findById(req.body.id);
  AssociationAdminService.setPassword(associationadmin, newPassword);
  associationadmin.save(function (err, result) {
    if (err) {
      return res.status(422).send(err);
    }
    res.sendStatus(200);
  });
});
