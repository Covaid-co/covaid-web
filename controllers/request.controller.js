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

exports.handleRequest = function (req, res) {
    const { 
        body: {
            requester_email,
            requester_phone,
            offerer_email,
            details
        } 
    } = req;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'covaidco@gmail.com',
               pass: 'supportyourcity_covaid_1?'
        }
    }); 

    const request = new Requests(req.body);
    request.completed = false;
    console.log(request)

    request.save().then(result => {
        res.status(201).json({
            message: "Request Created", //
            result: result // the "result" object can be filtered or you can simply return the message
        });

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

        console.log(link);

        const mailOptions = {
            from: 'covaidco@gmail.com', // sender address
            to: offerer_email, // list of receivers
            subject: 'Someone needs your help!', // Subject line
            html: compiledTemplate.render({email: email, phone: phone, details: details, id: result._id, link: link})
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                res.sendStatus(400);
            else
                res.sendStatus(200);
        });
    }).catch(err => {
        res.status(500).json({
            error: err 
        });
    });

};