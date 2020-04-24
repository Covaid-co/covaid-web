var cron = require('node-cron');
const Pusher = require('pusher');
require('dotenv').config();
const emailer = require('../util/emailer')
const Beacon = require('../models/beacon.model');
const BeaconStatusEnum = {"active":1, "inactive":2, "complete":3, "delete": 4};
 
exports.BeaconScheduler = function() {
    cron.schedule('0 0 0 * * *', function() {
        expireAnyExpiringBeacons()
    })
};

const expireAnyExpiringBeacons = async () => {
    try {
        console.log("Expiring beacons")
        const expiredBeacons = await Beacon.find({
            beaconEndDate: { $lte: new Date() } 
        })
        expiredBeacons.forEach(function(beacon) {
            var id = beacon._id;
            Beacon.findOneAndUpdate({"_id": id}, {
                $set: {
                    beaconStatus: BeaconStatusEnum.complete
                }
            }, function(err) {
                if (err) console.log(err)
            });
        });
    } catch (e) {
        console.log(e);
    }
}