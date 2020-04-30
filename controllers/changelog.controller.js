const ChangeLog = require('../models/changelog.model');
const asyncWrapper = require("../util/asyncWrapper");

exports.add_log = asyncWrapper(async (req, res) => {
    const newChangeLog = new ChangeLog(req.body);
    console.log(req.body);
    newChangeLog.save().then(result => {
        res.status(200).json({
            message: "Request Created",
            result: newChangeLog
        });
    });
});

exports.all = function (req, res) {
    ChangeLog.find({}).then(function (logs) {
        res.send(logs);
    });
};