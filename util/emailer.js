exports.sendPasswordLink = (email, userID, token) => {
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
              user: 'covaidco@gmail.com',
              pass: 'supportyourcity_covaid_1?'
        }
    });

    var test = "localhost:3000";
    var production = "covaid.co";
    var page = production
    if (process.env.PORT) {
        page = production
    } else {
        page = test
    }
    var body = "Click here to reset your password: " + "http://" + page + '/resetPassword?ID=' + userID + '&Token=' + token

    var mailOptions = {
        from: 'covaidco@gmail.com',
        to: email,
        subject: 'Covaid -- Reset your password',
        text: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}