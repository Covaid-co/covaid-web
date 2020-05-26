var cron = require("node-cron");
require("dotenv").config();

const RequestService = require("../services/request.service");

exports.request_scheduler = function () {
  console.log("scheduler");
  if (process.env.PROD) {
    cron.schedule("0 0 */1 * * *", async function () {
      console.log("unmatching");
      try {
        // Unmatch all pending volunteers who are still tied to a request
        await RequestService.unmatchPendingVolunteers(24);
      } catch (e) {
        console.log(e);
      }
    });

    cron.schedule("0 0 */12 * * *", async function () {
      console.log("reminding");
      try {
        // Remind all in_progress volunteers who are tied to a request to complete their request (who have not been notified in some hour range)
        await RequestService.remindMatchedVolunteers(48);
      } catch (e) {
        console.log(e);
      }
    });
  }
};
