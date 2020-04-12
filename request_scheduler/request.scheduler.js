var cron = require('node-cron');
const Pusher = require('pusher');
require('dotenv').config();

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true
});

const Requests = require('../models/request.model');
 
exports.request_scheduler = function() {
        cron.schedule("0 0 */6 * * *", function() {
            updateAllExpiredRequests()
    })
};

const updateAllExpiredRequests = () => {
    Requests.find({
        $and: [
            {
                "volunteer_status": "pending"
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
                var id = request._id;
                var volunteer_id = request.status.volunteer
                Requests.findOneAndUpdate({"_id": id}, {
                    $set: {
                        "status": {
                            "current_status": "incomplete",
                            "volunteer": ""
                        },
                        "volunteer_status": "",
                        "last_modified": new Date()
                    }
                }, function(err, post) {
                    if (err) console.log(err)
                    else {
                        pusher.trigger(request.association, 'general', 'A matched request has expired!')
                        pusher.trigger(volunteer_id, 'direct-match', 'A request has expired!')
                    }
                })
            });
        }
    })
}