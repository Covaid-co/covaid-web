require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = "+12513206732";
const client = require("twilio")(accountSid, authToken);

exports.sendNotificationSMS = async function (data) {
  if (data.phone === null || data.phone === "") {
    return "There is no recipient phone number specified. SMS notification failed.";
  }
  try {
    var template = "COVAID: Hi, " + data.name + "! ";
    if (data.templateName === "pending_notification") {
      template +=
        "Friendly reminder to mark any of your in-progress requests as completed once you fulfill the request. Thank you!";
    } else if (data.templateName === "volunteer_notification") {
      template +=
        "Someone needs your support! Check your volunteer portal here. https://www.covaid.co/volunteerPortal";
    } else {
      template +=
        "You have unread notifications! Check your volunteer portal here. https://www.covaid.co/volunteerPortal";
    }
    const msg = {
      body: template,
      from: twilioNumber,
      to: data.phone,
    };
    //send the sms
    if (process.env.PROD) {
      client.messages.create(msg, function (err, message) {
        if (err) {
          return err;
        } else {
          var log = "SMS notification sent! Message SID: " + message.sid;
          return log;
        }
      });
    }
  } catch (e) {
    throw e;
  }
};
