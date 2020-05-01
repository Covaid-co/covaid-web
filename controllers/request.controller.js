var nodemailer = require('nodemailer');
var fs = require('fs')
var Hogan = require('hogan.js')
const Requests = require('../models/request.model');
const Users = require('../models/user.model');
const Association = require('../models/association.model')
const asyncWrapper = require('../util/asyncWrapper');
var template = fs.readFileSync('./email_views/request_email.hjs', 'utf-8')
var compiledTemplate = Hogan.compile(template)
require('dotenv').config();


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

exports.getAllRequestsOfAnAssoc = asyncWrapper(async (req, res) => {
    const assoc = req.query.association

    var requests = await Requests.find({
        'association': assoc,
        '$or': [{'delete': false}, {'delete': {"$exists": false}}]
    });
    res.send(requests);
})

exports.getAllRequestsInVolunteer = asyncWrapper(async (req, res) => {
    const id = req.query.volunteerID
    var requests = await Requests.find({
        'status.volunteer': id
    })
    res.send(requests)
})

exports.getAllPendingRequestsInVolunteer = asyncWrapper(async (req, res) => {
    const id = req.query.volunteerID
    var requests = await Requests.find({
        'status.volunteer': id,
        'volunteer_status': 'pending',
    })
    res.send(requests)
})

exports.getAllAcceptedRequestsInVolunteer = asyncWrapper(async (req, res) => {
    const id = req.query.volunteerID
    var requests = await Requests.find({
        'status.volunteer': id,
        'volunteer_status': 'accepted'
    })
    res.send(requests)
})

exports.getAllCompletedRequestsInVolunteer = asyncWrapper(async (req, res) => {
    const id = req.query.volunteerID
    var requests = await Requests.find({
        'status.volunteer': id,
        'volunteer_status': 'completed'
    })
    res.send(requests)
})

exports.acceptRequest = asyncWrapper(async (req, res) => {
    const req_id = req.query.ID
    var request = await Requests.findByIdAndUpdate(req_id, 
        {
            $set: {
                volunteer_status: 'accepted',
                'pending_time': new Date()
            }
        })
    if (request) {

        var assoc = await Association.findOne({
            '_id': request.association
        });

        for (var i = 0; i < assoc.admins.length; i++) {
            var admin = assoc.admins[i];
            if (admin.name === request.assignee) {
                console.log(admin.email)
                break;
            }
        }
        res.sendStatus(200)
        return
    } else {
        res.sendStatus(404)
        return
    }

})

exports.attachVolunteer = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id
    const volunteer_id = req.body.volunteer_id
    const assoc_id = req.body.association
    const volunteer_email = req.body.volunteer_email
    const volunteer_name = req.body.volunteer_name
    const adminMessage = req.body.adminDetails
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "status": {
                "current_status": "in_progress",
                "volunteer": volunteer_id
            }, 
            "volunteer_status": 'pending',
            "adminMessage": adminMessage,
            "pending_time": new Date(),
            "last_modified": new Date()
        }
    }, function (err, request) {
        if (err) return next(err);
        if (request.association){
            Association.findById(request.association, function (err, assoc) {
                if (err) res.sendStatus(403)
                var associationEmail = assoc.email;

                }
            )
        }
        res.send('Request updated.');
    });
})

exports.removeVolunteer = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id;
    const assoc_id = req.body.assoc_id;
    const volunteer_id = req.body.volunteer_id;
    var updateQuery = {'$set': {
        "status": {
            "current_status": "incomplete",
            "volunteer": ""
        },
        "adminMessage": "",
        "volunteer_status": "",
        "last_modified": new Date()}}

    if (volunteer_id) {
        updateQuery['$push'] = {'prev_matched': volunteer_id};
    }

    Requests.findByIdAndUpdate(request_id, updateQuery, function (err, request) {
        if (err) return next(err);
        Association.findOne({
            '_id': request.association
        }, function (err, assoc) {
            if (err) return next(err)
            var foundAdmin = false
            for (var i = 0; i < assoc.admins.length; i++) {
                var admin = assoc.admins[i];
                if (admin.name === request.assignee) {
                    
                    foundAdmin = true
                    break;
                }
            }
        });
        res.send('Request updated.');
    });

})

exports.completeARequest = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id;
    const reason = req.body.reason;
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "status.current_status": "complete",
            "status.reason": reason,
            "volunteer_status": "completed",
            "volunteer_comment": req.body.volunteer_comment,
            "last_modified": new Date(),
            "completed_date": new Date()
        }
    }, function (err, request) {
        if (err) return next(err);
        res.send('Request updated.');
    });
})

exports.setAssignee = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id;
    const assignee = req.body.assignee;
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "assignee": assignee,
            "last_modified": new Date()
        }
    }, function (err, request) {
        if (err) return next(err);
        res.send('Request updated.');
    });
});

exports.setNotes = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id;
    const note = req.body.note;
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "note": note,
            "last_modified": new Date()
        }
    }, function (err, request) {
        if (err) return next(err);
        res.send('Request updated.');
    });
});


exports.setDelete = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id;
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "delete": true,
            "last_modified": new Date()
        }
    }, function (err, request) {
        if (err) return next(err);
        res.send('Request updated.');
    });
});

exports.setManualVolunteer = asyncWrapper(async (req, res) => {
    const request_id = req.body.request_id;
    Requests.findByIdAndUpdate(request_id, 
        {$set: {
            "last_modified": new Date(),
            'manual_match': {
                "name": req.body.name,
                "email": req.body.email,
                "phone": req.body.phone,
                "details": req.body.details
            },
            "status": {
                "current_status": "in_progress",
                "volunteer": "manual"
            }
        }
    }, function (err, request) {
        if (err) return next(err);
        res.send('Request updated.');
    });
});

exports.handle_old_request = asyncWrapper(async (req, res) => {
    const request = new Requests(req.body);
    request.completed = false;
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
    request.time_posted = new Date(); 
    var volunteers;
    var associationEmail = 'covaidco@gmail.com'
    var assocName = 'Covaid'
    if (request.association){
        var assoc = await Association.findById(request.association)
        associationEmail = assoc.email;
        assocName = assoc.name
    }
    if (!req.body.volunteer) {
        // General requests
        volunteers = await getBestVolunteers(request)
        var volunteer_emails = []
        for (var i = 0; i < Math.min(volunteers.length, 3); i++) {
            volunteer_emails.push(volunteers[i].email)
        }

        var dbResult = await request.save()

        res.status(200).json({
            volunteers: volunteers 
        });
        return
    } else {
        // Direct Matches
        volunteers = [req.body.volunteer]
        request.status = {
            "current_status": "in_progress",
            "volunteer": req.body.volunteer._id
        }
        request.volunteer_status = "pending"
        request.pending_time = new Date()

        await request.save();

        var first_name = req.body.volunteer.first_name;
        first_name = first_name.toLowerCase();
        first_name = first_name[0].toUpperCase() + first_name.slice(1);
            // sendEmail(request, req.body.volunteer.email, associationEmail)
        res.status(200).json({
            volunteers: volunteers 
        });
        return
    }
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

function sendEmail(request, recipient, assoc_email) {
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

    // var link = 'http://' + mode + '/completeOffer?ID=' + ID;
    var link = 'http://' + mode;

    var email = request.requester_email
    var phone = request.requester_phone;

    if (!request.requester_email || request.requester_email.length == 0) {
        email = "N/A"
    }

    if (!request.requester_phone || request.requester_phone.length == 0) {
        phone = "N/A"
    }


    const mailOptions = {
        from: 'covaidco@gmail.com', // sender address
        to: recipient, // list of receivers
        subject: 'Someone needs your help!', // Subject line
        html: compiledTemplate.render({email: email, phone: phone, details: request.details, assoc_email: assoc_email})
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            res.sendStatus(400);
        else
            res.sendStatus(200);
    });
}