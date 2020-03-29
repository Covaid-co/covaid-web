var nodemailer = require('nodemailer');
var fs = require('fs')
var Hogan = require('hogan.js')
const Requests = require('../models/request.model');
const Users = require('../models/user.model');
const asyncWrapper = require('../util/asyncWrapper');

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

exports.createARequest = asyncWrapper(async (req, res) => {
    const request = new Requests(req.body);
    request.status = "incomplete"
    await request.save()
    var volunteers = await getBestVolunteers(request)
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
    var users = await Users.find({'availability': true,
                        'preVerified': true,
                        'association': request.association,
                        'offer.tasks': { $in: request.resource_request },
                        'languages': { $in: request.languages },
                })

    for (var i = 0; i < users.length; i++) {
        const coords = users[i].location.coordinates;
        const distance = calcDistance(request.latitude, request.longitude, coords[1], coords[0]);
        users[i]['distance'] = distance;
    }
    users.sort(function(a, b){return a['distance'] - b['distance']});
    return users;
}