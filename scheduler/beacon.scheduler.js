var cron = require("node-cron");
require("dotenv").config();
const Beacon = require("../models/beacon.model");
const BeaconStatusEnum = { active: 1, inactive: 2, complete: 3, delete: 4 };

exports.BeaconScheduler = function () {
  if (process.env.PROD) {
    cron.schedule("0 0 0 * * *", function () {
      expireAnyExpiringBeacons();
    });
  }
};

const expireAnyExpiringBeacons = async () => {
  try {
    console.log("Expiring beacons");
    const expiredBeacons = await Beacon.find({
      beaconEndDate: { $lte: new Date() },
    });
    expiredBeacons.forEach(function (beacon) {
      var id = beacon._id;
      Beacon.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            beaconStatus: BeaconStatusEnum.complete,
          },
        },
        function (err) {
          if (err) console.log(err);
        }
      );
    });
  } catch (e) {
    console.log(e);
  }
};
