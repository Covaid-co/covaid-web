var nodemailer = require('nodemailer');
var fs = require('fs')
var Hogan = require('hogan.js')
const Requests = require('../models/request.model');
const Users = require('../models/user.model');
const asyncWrapper = require('../util/asyncWrapper');
const SPREADSHEET_ID = '1l2kVGLjnk-XDywbhqCut8xkGjaGccwK8netaP3cyJR0'
const creds = require('../client_secret.json')
const {GoogleSpreadsheet }= require('google-spreadsheet')

var template = fs.readFileSync('./email_views/request_email.hjs', 'utf-8')
var compiledTemplate = Hogan.compile(template)

async function addRequestToSpreadsheet(request, ID, volunteers) {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  
    await doc.loadInfo(); // loads document properties and worksheets
  
    // create a sheet and set the header row
    const requestSheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id]

    var volunteer_emails = []
    for (var i = 0; i < Math.min(volunteers.length, 3); i++) {
        volunteer_emails.push(volunteers[i].email)
    }
    
    // append rows 
    await requestSheet.addRow({ 
        Name: request.requester_first + " " + request.requester_last,
        Email: request.requester_email,
        Phone: request.requester_phone,
        NeedHelpWith: request.resource_request.join(", "),
        Languages: request.languages.join(", "),
        Details: request.details,
        When: request.time + " " + request.date,
        BestVolunteers: volunteer_emails.join(", ")
    });

  }

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

exports.getAllRequestsOfAnAssoc = asyncWrapper(async (req, res) => {
    const assoc = req.body.association
    var requests = await Requests.find({
        'association': assoc
    })
    res.send(requests)
})

exports.attachVolunteer = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id
    const volunteer_id = req.body.volunteer_id
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "status": "pending",
            "volunteer": volunteer_id
        }
    }, function (err, request) {
        if (err) return next(err);
        
        res.send('Request updated.');
    });

})

exports.removeVolunteer = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id
    const volunteer_id = req.body.volunteer_id
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "status": "incomplete",
            "volunteer": ""
        }
    }, function (err, request) {
        if (err) return next(err);
        
        res.send('Request updated.');
    });

})

exports.completeARequest = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "status": "complete",
        }
    }, function (err, request) {
        if (err) return next(err);
        
        res.send('Request updated.');
    });
})

exports.handle_old_request = asyncWrapper(async (req, res) => {
    const request = new Requests(req.body);
    request.completed = false;
    console.log(request)

    request.save().then(result => {
        res.status(201).json({
            message: "Request Created", //
            result: result // the "result" object can be filtered or you can simply return the message
        });
        sendEmail(req);
    });
});

exports.createARequest = asyncWrapper(async (req, res) => {
    const request = new Requests(req.body);
    request.status = "incomplete"
    var result = await request.save()
    var volunteers;
    if (!req.body.volunteer) {
        volunteers = await getBestVolunteers(request)
        console.log(volunteers)
    } else {
        volunteers = [req.body.volunteer]
    }
    console.log(volunteers)
    if (request.association == "5e7f9badc80c292245264ebe") {
        await addRequestToSpreadsheet(request, result._id, volunteers)
    }
    res.status(200).json({
        volunteers: volunteers 
    });
});

var rad = function(x) {
    return x * Math.PI / 180;
};

function calcDistance(latA, longA, latB, longB) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(latB - latA);
    var dLong = rad(longB - longA);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(latA)) * Math.cos(rad(latB)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }


async function getBestVolunteers(request) {
    console.log(request)
    var users = await Users.find({'availability': true,
                        'preVerified': true,
                        'association': request.association,
                        'offer.tasks': { $all: request.resource_request },
                })
    
    for (var i = 0; i < users.length; i++) {
        const coords = users[i].location.coordinates;
        const distance = calcDistance(request.latitude, request.longitude, coords[1], coords[0]);
        users[i]['distance'] = distance;
    }
    users.sort(function(a, b){return a['distance'] - b['distance']});
    return users;
}

function sendEmail(req, request, ID) {
    const { 
        body: {
            requester_email,
            requester_phone,
            details
        } 
    } = req;
    var offerer_email = req.body.volunteer.email;

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

    var link = 'http://' + mode + '/completeOffer?ID=' + ID;

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
        to: 'covaidco@gmail.com', // list of receivers
        subject: 'Someone needs your help!', // Subject line
        html: compiledTemplate.render({email: email, offer_email: offerer_email, phone: phone, details: details, id: ID, link: link, payment: paymentText})
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            res.sendStatus(400);
        else
            res.sendStatus(200);
    });
}