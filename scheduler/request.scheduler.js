var cron = require('node-cron');
const Pusher = require('pusher');
require('dotenv').config();
const emailer = require('../util/emailer')

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
});

const Requests = require('../models/request.model');
const Association = require('../models/association.model');
const Users = require('../models/user.model');
 
const RequestService = require('../services/request.service');

exports.request_scheduler = function() {
    console.log("scheduler");
    if (process.env.PROD) {
        cron.schedule("0 0 */1 * * *", async function() {
            console.log("unmatching");
            try {
                // Unmatch all pending volunteers who are still tied to a request
                await RequestService.unmatchPendingVolunteers(48);
            } catch(e) {
                console.log(e);
            }
        });
    
        cron.schedule("0 0 */12 * * *", async function() {
            console.log("reminding");
            try {
                // Remind all in_progress volunteers who are tied to a request to complete their request (who have not been notified in some hour range)
                // await RequestService.remindMatchedVolunteers(48);
            } catch(e) {
                console.log(e);
            }
        });
    }
};

// const remindPendingRequests = () => {
//     Requests.find({
//         $and: [
//             {
//                 "volunteer_status": "accepted"
//             },
//             {
//                 "pending_time": {
//                     $lte: new Date(Date.now() - 48 * 60 * 60 * 1000)
//                 }
//             }
//         ]
//     }, function(err, requests) {
//         if (err) console.log(err)
//         else {
//             requests.forEach(function(request) {
//                 if (request.status) {
//                     if (request.status.volunteer && request.status.volunteer.length > 0) {
//                         Users.findOne(
//                             {'_id': request.status.volunteer},
//                             function (err, volunteer) {
//                                 if (err) return next(err)
//                                 else {
//                                     var data = {
//                                         //sender's and receiver's email
//                                         sender: "Covaid@covaid.co",
//                                         receiver: volunteer.email,
//                                         templateName: "pending_notification",
//                                     };
//                                     console.log("sending an email to " + volunteer.email)
//                                     emailer.sendNotificationEmail(data)
//                                 }
//                             }
//                         )
//                         request.pending_time = new Date();
//                         request.save()
//                     }
//                 }
//             });
//         }
//     })
// }