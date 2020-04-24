const OrgSignup = require('../models/orgsignup.model');
const asyncWrapper = require("../util/asyncWrapper");

exports.SignUp = asyncWrapper(async (req, res) => {
    const signup = new OrgSignup(req.body);
    console.log(req.body)
    signup.save().then(result => {
        res.status(200).json({
            message: "Request Created",
            result: signup
        });
    });
});