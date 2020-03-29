var nodemailer = require('nodemailer');
var fs = require('fs')
var Hogan = require('hogan.js')
const Requests = require('../models/request.model');

var template = fs.readFileSync('./email_views/request_email.hjs', 'utf-8')
var compiledTemplate = Hogan.compile(template)

exports.update_completed = function (req, res) {
    Requests.findByIdAndUpdate(req.params.id, 
            {"completed": true}, function(err, result){
        if (err){
            console.log("ERROR");
            res.sendStatus(500);
        }
        else {
            console.log("Success");
            res.sendStatus(200);
        }
    });
};

function sendMail(request, requester_email,
    requester_phone,
    offerer_email,
    details, result) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'covaidco@gmail.com',
               pass: 'supportyourcity_covaid_1?'
        }
    }); 

    var paymentText;
    if (request.payment == 0) {
        paymentText = "Call Ahead"
    } else if (request.payment == 1) {
        paymentText = "Reimburse Volunteer"
    } else {
        paymentText = "N/A"
    }

    var mode = "localhost:3000";
    if (process.env.PROD) {
        mode = "covaid.co"
    }


    var link = 'http://' + mode + '/completeOffer?ID=' + result._id;

    var email = requester_email;
    var phone = requester_phone;



    if (!requester_email || requester_email.length == 0) {
        email = "N/A"
    }

    if (!requester_phone || requester_phone.length == 0) {
        phone = "N/A"
    }


    const mailOptions = {
        from: 'covaidco@gmail.com', // sender address
        to: 'covaidco@gmail.com', // list of receivers
        subject: 'Someone needs your help!', // Subject line
        html: compiledTemplate.render({email: email, offer_email: offerer_email, phone: phone, details: details, id: result._id, link: link, payment: paymentText})
    };

    transporter.sendMail(mailOptions)
}

exports.handleRequest = function (req, res) {
    const request = new Requests(req.body);

    request.save().then(result => {
        // Find optimal users

        // sendMail(request, requester_email,
        //     requester_phone,
        //     offerer_email,
        //     details, result)

        var bestVolunteers = getBestVolunteers(request)

        res.status(201).json({
            message: "Request Created", //
            result: result // the "result" object can be filtered or you can simply return the message
        });
    }).catch(err => {
        res.status(500).json({
            error: err 
        });
    });

};

function getBestVolunteers(request) {
    // Match on assoc
    // Match on task
    // 3 closest
    
    
}