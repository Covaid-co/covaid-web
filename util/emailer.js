require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

templates = {
  volunteer_notification: "d-0df61c70d30f407ea78c577d69ccd07e",
  org_notification: "d-f43176afdac34a18aaffee5d6945dbc1",
  verification: "d-454bd90ee0b74df19746bf2ec664cedc",
  admin_notification: "d-6c2dcfa1d8734e3293837804b1496ed5",
  pending_notification: "d-1a6056febc214315bb3c12e1da3674b9",
  beacon: "d-15d81c1063f2490aa94ba195448d8fac",
  help_match: "d-1cba047db5294fc196a1a9836bdad06e",
  requester_notification: "d-14331b04733a49d5a6c0b5ee819d3bea",
  reset_password: "d-ea90962559674c8ba732add9a4260cde",
};

exports.sendHelpMatchEmail = (data) => {
  const msg = {
    to: data.receiver,
    from: data.sender,
    templateId: templates[data.templateName],
    dynamic_template_data: {
      name: data.name,
      email: data.email,
      details: data.details,
    },
  };

  //send the email
  sgMail.send(msg, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent!");
    }
  });
};

exports.sendNotificationEmail = (data) => {
  const msg = {
    //extract the email details
    to: data.receiver,
    from: data.sender,
    templateId: templates[data.templateName],
    //extract the custom fields
    dynamic_template_data: {
      name: data.name,
      assoc: data.assoc,
      action: data.action,
    },
  };

  //send the email
  if (process.env.PROD || process.env.EMAILSANDBOX) {
    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent!");
      }
    });
  }
};

exports.sendBeaconEmail = (data) => {
  const msg = {
    //extract the email details
    to: data.receiver,
    from: data.sender,
    templateId: templates[data.templateName],
    //extract the custom fields
    dynamic_template_data: {
      beacon: data.beacon,
    },
  };

  //send the email
  sgMail.send(msg, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent!");
    }
  });
};

exports.sendVerificationEmail = (data) => {
  const msg = {
    //extract the email details
    to: data.receiver,
    from: data.sender,
    templateId: templates[data.templateName],
    //extract the custom fields
    dynamic_template_data: {
      link: data.link,
    },
  };

  //send the email
  sgMail.send(msg, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log("That's wassup!");
    }
  });
};

exports.sendPasswordLink = (email, userID, token) => {
  var test = "localhost:3000";
  var production = "covaid.co";
  var page = production;
  if (process.env.PORT) {
    page = production;
  } else {
    page = test;
  }
  var body =
    "http://" + page + "/resetPassword?ID=" + userID + "&Token=" + token;

  const msg = {
    //extract the email details
    to: email,
    from: "Covaid@covaid.co",
    templateId: templates["reset_password"],
    //extract the custom fields
    dynamic_template_data: {
      link: body,
    },
  };

  //send the email
  if (process.env.PROD || process.env.EMAILSANDBOX) {
    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent!");
      }
    });
  }
};

exports.sendBeaconEmail = (data) => {
  const msg = {
    //extract the email details
    to: data.receiver,
    from: data.sender,
    templateId: templates[data.templateName],
    //extract the custom fields
    dynamic_template_data: {
      beacon: data.beacon,
    },
  };

  //send the email
  sgMail.send(msg, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent!");
    }
  });
};

exports.sendAssocPasswordLink = (email, assocID, token) => {
  var test = "covaid.co";
  var production = "covaid.co";
  var page = production;
  if (process.env.PORT) {
    page = production;
  } else {
    page = test;
  }
  var body =
    "http://" +
    page +
    "/resetAssociationPassword?ID=" +
    assocID +
    "&Token=" +
    token;

  const msg = {
    //extract the email details
    to: email,
    from: "Covaid@covaid.co",
    templateId: templates["reset_password"],
    //extract the custom fields
    dynamic_template_data: {
      link: body,
    },
  };
  //send the email
  if (process.env.PROD) {
    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent!");
      }
    });
  }
};

exports.sendAssocAdminPasswordLink = (email, assocID, token) => {
  var test = "localhost:3000";
  var production = "covaid.co";
  var page = production;
  if (process.env.PORT) {
    page = production;
  } else {
    page = test;
  }
  var body =
    "http://" +
    page +
    "/resetOrgAdminPassword?ID=" +
    assocID +
    "&Token=" +
    token;

  const msg = {
    //extract the email details
    to: email,
    from: "Covaid@covaid.co",
    templateId: templates["reset_password"],
    //extract the custom fields
    dynamic_template_data: {
      link: body,
    },
  };

  //send the email
  if (process.env.PROD) {
    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent!");
      }
    });
  }
};

exports.sendRequestEmail = (request, recipient, assoc_email) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "covaidco@gmail.com",
      pass: "covaid_platform_2020!",
    },
  });

  var paymentText;
  if (request.payment == 0) {
    paymentText = "Call Ahead";
  } else if (request.payment == 1) {
    paymentText = "Reimburse Volunteer";
  } else {
    paymentText = "N/A";
  }

  var mode = "localhost:3000";
  if (process.env.PROD) {
    mode = "covaid.co";
  }

  // var link = 'http://' + mode + '/completeOffer?ID=' + ID;
  var link = "http://" + mode;

  var email = request.requester_email;
  var phone = request.requester_phone;

  if (!request.requester_email || request.requester_email.length == 0) {
    email = "N/A";
  }

  if (!request.requester_phone || request.requester_phone.length == 0) {
    phone = "N/A";
  }

  const mailOptions = {
    from: "covaidco@gmail.com", // sender address
    to: recipient, // list of receivers
    subject: "Someone needs your help!", // Subject line
    html: compiledTemplate.render({
      email: email,
      phone: phone,
      details: request.details,
      assoc_email: assoc_email,
    }),
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) res.sendStatus(400);
    else res.sendStatus(200);
  });
};
