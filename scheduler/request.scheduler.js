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

const remindPendingRequests = () => {
    Requests.find({
        $and: [
            {
                "volunteer_status": "accepted"
            },
            {
                "pending_time": {
                    $lte: new Date(Date.now() - 48 * 60 * 60 * 1000)
                }
            }
        ]
    }, function(err, requests) {
        if (err) console.log(err)
        else {
            requests.forEach(function(request) {
                if (request.status) {
                    if (request.status.volunteer && request.status.volunteer.length > 0) {
                        Users.findOne(
                            {'_id': request.status.volunteer},
                            function (err, volunteer) {
                                if (err) return next(err)
                                else {
                                    var data = {
                                        //sender's and receiver's email
                                        sender: "Covaid@covaid.co",
                                        receiver: volunteer.email,
                                        templateName: "pending_notification",
                                    };
                                    console.log("sending an email to " + volunteer.email)
                                    emailer.sendNotificationEmail(data)
                                }
                            }
                        )
                        request.pending_time = new Date();
                        request.save()
                    }
                }
            });
        }
    })
}

const updateAllExpiredRequests = () => {
    Requests.find({
        $and: [
            {
                "volunteer_status": "pending"
            },
            {
                "pending_time": {
                    $lte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    // $lte: new Date(Date.now() - 20 * 1000)
                }
            }
        ]
    }, function(err, requests) {
        if (err) console.log(err)
        else {
            requests.forEach(function(request) {
                var id = request._id;
                var volunteer_id = request.status.volunteer
                var updateQuery = {
                    '$set': {
                        "status": {
                            "current_status": "incomplete",
                            "volunteer": ""
                        },
                        "adminMessage": "",
                        "volunteer_status": "",
                        "last_modified": new Date()
                    }
                }
            
                if (volunteer_id) {
                    updateQuery['$push'] = {'prev_matched': volunteer_id};
                }

                Requests.findOneAndUpdate({"_id": id}, updateQuery, function(err, post) {
                    if (err) console.log(err)
                    else {
                        Association.findOne({
                            '_id': request.association
                        }, function (err, assoc) {
                            if (err) return next(err)
                            var foundAdmin = false
                            for (var i = 0; i < assoc.admins.length; i++) {
                                var admin = assoc.admins[i];
                                if (admin.name === request.assignee) {
                                    var data = {
                                        //sender's and receiver's email
                                        sender: "Covaid@covaid.co",
                                        receiver: admin.email,
                                        name: request.requester_first,
                                        action: 'rejected',
                                        templateName: "admin_notification",
                                    };
                                    emailer.sendNotificationEmail(data)
                                    foundAdmin = true
                                    break;
                                }
                            }
                            if (!foundAdmin) {
                                var data = {
                                    //sender's and receiver's email
                                    sender: "Covaid@covaid.co",
                                    receiver: assoc.email,
                                    name: request.requester_first,
                                    assoc: assoc.name,
                                    templateName: "org_notification",
                                 };
                        
                                emailer.sendNotificationEmail(data)
                            }
                        });
                        pusher.trigger(request.association, 'general', 'A matched request has expired!')
                        pusher.trigger(volunteer_id, 'direct-match', 'A request has expired!')
                    }
                })
            });
        }
    })
}