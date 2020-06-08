require("dotenv").config();
var sid = process.env.TWILIO_ACCOUNT_SID;
var token = process.env.TWILIO_AUTH_TOKEN;
var from = "+12513206732";
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const validator = require("validator");

exports.sendVolunteerMatchText = async (data) => {
  // **for testing function if env/local variables are ever invalid or null**
  if (process.env.NODE_ENV === "test") {
    sid = data.sid;
    token = data.token;
    from = data.from;
  }

  // (1) validate twilio + sms info

  const response = validateSMSDetails(from, data.smsRecipient, sid, token);
  if (!response.isValid) {
    return response;
  }

  // (2) construct message text based on template

  var template = "COVAID: ";
  if (data.name && data.name !== "") {
    template += "Hi, " + data.name + "! ";
  }
  template +=
    "Someone needs your support! Check your volunteer portal at covaid.co/volunteerPortal.";
  /*
  // for future: based on template name, send diff sms
  if (data.templateName === "pending_notification") {
    template +=
      "Friendly reminder to mark any of your in-progress requests as completed once you fulfill the request. Thank you!";
  } else if (data.templateName === "volunteer_notification") {
    template +=
      "Someone needs your support! Check your volunteer portal here. https://www.covaid.co/volunteerPortal";
  } else {
    template +=
      "You have unread notifications! To view them, check your volunteer portal here. https://www.covaid.co/volunteerPortal";
  } 
  */

  const msg = {
    body: template,
    from: from,
    to: data.smsRecipient,
  };

  // (3) send the sms
  if (process.env.PROD) {
    try {
      const message = await client.messages.create(msg);
      response.desc =
        "SMS notification sent! Message recap: " +
        message.body +
        ". Sent to message recipient: " +
        message.to;
      return response;
    } catch (error) {
      console.log(error);
      response.desc = "SMS notification failed to send!";
      return response;
    }
  } else if (process.env.NODE_ENV === "test") {
    try {
      const messages = await require("twilio")(sid, token).messages.list({
        limit: 1,
      });
      response.desc =
        "**TESTING MODE** SMS notification sent! Message recap: " +
        messages[0].body +
        ".. Sent to message recipient: " +
        messages[0].to;
      return response;
    } catch (error) {
      console.log(error);
      response.desc = "**TESTING MODE** SMS notification failed to send!";
      return response;
    }
  } else {
    response.desc =
      "**SMS SENDING DISABLED -- NOT IN PRODUCTION MODE** " + response.desc;
    return response;
  }
};

const validateSMSDetails = (from, recipient, sid, token) => {
  let result = {
    desc: "SMS Details are valid!",
    sid: {
      exists: false,
      isValid: false,
    },
    token: {
      exists: false,
      isValid: false,
    },
    recipient: {
      exists: false,
      isValid: false,
    },
    from: {
      exists: false,
      isValid: false,
    },
    isValid: false,
  };
  // validate recipient phone number
  if (recipient && recipient !== "") {
    result.recipient.exists = true;
    if (validator.isMobilePhone(recipient, "en-US")) {
      result.recipient.isValid = true;
    } else {
      result.desc = "SMS Error: Invalid recipient phone number.";
    }
  } else {
    result.desc = "SMS Error: No recipient phone number has been specified.";
  }

  // validate twilio phone number
  if (from && from !== "") {
    result.from.exists = true;
    if (validator.isMobilePhone(from, "en-US")) {
      result.from.isValid = true;
    } else {
      result.desc = "SMS Error: Invalid Twilio phone number.";
    }
  } else {
    result.desc = "SMS Error: No Twilio phone number has been specified.";
  }

  // validate twilio auth token
  if (token && token !== "") {
    result.token.exists = true;
    if (token.length === 32 && validator.isAlphanumeric(token, "en-US")) {
      result.token.isValid = true;
    } else {
      result.desc = "SMS Error: Bad Twilio auth token";
    }
  } else {
    result.desc = "SMS Error: No Twilio auth token has been specified";
  }

  // validate twilio account SID
  if (sid && sid !== "") {
    result.sid.exists = true;
    if (sid.length === 34 && validator.isAlphanumeric(sid, "en-US")) {
      result.sid.isValid = true;
    } else {
      result.desc = "SMS Error: Bad Twilio account SID";
    }
  } else {
    result.desc = "SMS Error: No Twilio account SID has been specified";
  }

  // only if all four attributes are valid
  if (result.desc === "SMS Details are valid!") {
    result.isValid = true;
  }
  return result;
};
