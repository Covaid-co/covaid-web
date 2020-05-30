var cron = require('node-cron');

const Requests = require('../models/request.model');
const Association = require('../models/association.model')
const Users = require('../models/user.model')
 
exports.request_scheduler = function() {
    // cron.schedule("0 */30 * * * *", function() {
    //     updateAllExpiredRequests()
    // })

    // cron.schedule("0 0 */12 * * *", function() {
    //     console.log("reminding")
    //     remindPendingRequests()
    // })
};
