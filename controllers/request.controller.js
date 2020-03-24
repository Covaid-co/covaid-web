var nodemailer = require('nodemailer');
var fs = require('fs')
var Hogan = require('hogan.js')

var template = fs.readFileSync('./email_views/request_email.hjs', 'utf-8')
var compiledTemplate = Hogan.compile(template)

exports.handleRequest = function (req, res) {
    const { 
        body: { 
            requester_email,
            requester_phone,
            offerer_email,
            details
        } 
    } = req;

    // console.log(email)
    // console.log(phone)
    // console.log(details)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'covaidco@gmail.com',
               pass: 'CMUJHU2020'
        }
    });

    const mailOptions = {
        from: 'covaidco@gmail.com', // sender address
        to: offerer_email, // list of receivers
        subject: 'Someone needs your help!', // Subject line
        html: compiledTemplate.render({email: requester_email, phone: requester_phone, details: details})
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            res.sendStatus(400);
        else
            res.sendStatus(200);
    });
    
};