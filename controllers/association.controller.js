// const Association = require('../models/association.model');
// const AssociationResources = require('../models/association-resources.modal');
// const passport = require('passport');
const asyncWrapper = require('../util/asyncWrapper');
// var jwt = require('jwt-simple');
// const emailer =  require("../util/emailer");

const AssociationService = require('../services/association.service');

exports.handleCreateAssociation = asyncWrapper(async (req, res) => {
	const { body: { association } } = req;
    if (!association.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
	}
	association.email = association.email.toLowerCase();

    if (!association.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
	}
	
    try {
		const new_association = await AssociationService.createAssociation(association);
        return (new_association._id === null) ? res.sendStatus(500) : res.status(201).send({'_id': new_association._id});
    } catch (e) {
		return res.status(422).send(e);
    }
});

exports.handleLoginAssociation = asyncWrapper(async (req, res) => {
	const { body: { association } } = req;
    if(!association.email) {
		return res.status(422).json({
			errors: {
				email: 'is required',
			},
		});
    }
  
    if(!association.password) {
		return res.status(422).json({
			errors: {
				password: 'is required',
			},
		});
	}
	
	try {
		let result = await AssociationService.loginAssociation(association);
		res.status(200).json(result)
    } catch (e) {
		console.log(e);
        return res.status(422).send({
			error: e.message
		});
	}
});

exports.handleGetCurrentAssociation = function (req, res) {
	const id = req.token.id;
	return AssociationService.get_association_by_id(id)
		.then((association) => {
			if (association.length === 0) {
				return res.sendStatus(400);
			}
			return res.json(association[0]);
		})
};

exports.handleGetAssociations = asyncWrapper(async (req, res) => {
	const { body: { query, limit } } = req;
	try {
		let associations = await AssociationService.get_associations(query, limit);
		return res.json(associations);
	} catch (e) {
		return res.sendStatus(400);
	}
});

exports.handleGetAssociationsGivenLatitudeLongitude = asyncWrapper(async (req, res) => {
	const { body: { latitude, longitude } } = req;
	try {
		let associations = await AssociationService.get_associations_by_location(latitude, longitude);
		return res.json(associations);
	} catch (e) {
		return res.sendStatus(400);
	}
});

exports.handleUpdateInfo = asyncWrapper(async (req, res) => {
	const association_id = req.token.id;
	const { body: { updates } } = req;
	try {
		await AssociationService.update_association(association_id, updates);
		return res.sendStatus(200);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});

exports.handleAddAdmin = asyncWrapper(async (req, res) => {
	const association_id = req.token.id;
	const { body: { admin } } = req;
	try {
		const newAdmin = await AssociationService.addAdmin(association_id, admin);
		return (newAdmin._id === null) ? res.sendStatus(500) : res.status(201).send({'_id': newAdmin._id});
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});

exports.handleAddLink = asyncWrapper(async (req, res) => {
	const association_id = req.token.id;
	const { body: { link } } = req;
	try {
		const newLink = await AssociationService.addLink(association_id, link);
		return (newLink === null) ? res.sendStatus(500) : res.status(201).send({'newLink': newLink});
	} catch (e) {
		return res.sendStatus(400);
	}
});

exports.handleDeleteLink = asyncWrapper(async (req, res) => {
	const association_id = req.token.id;
	var link_id = req.params.id;
	try {
		await AssociationService.deleteLink(association_id, link_id);
		return res.sendStatus(200);
	} catch (e) {
		console.log(e)
		return res.sendStatus(400);
	}
});


































// exports.add_resource_link = function (req, res) {
//   const id = req.body.associationID;
//   var link = req.body.link;
//   var name = req.body.name;
//   console.log(req.body);
//   let newResources = new AssociationResources({'link': link, 'name': name});
//   Association.findByIdAndUpdate(id, {$push: {'links': newResources}}, {safe: true, upsert: true},
//     function (err, doc) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       res.send(newResources._id);
//     }
//   )
// }

// exports.delete_resource_link = function(req, res) {
//   var resource_id = req.params.id;
//   var association_id = req.body.id;

//   Association.update(
//     {_id: association_id},
//     {
//       $pull: {
//         links: {
//           _id: resource_id
//         }
//       }
//     }, function(err, result) {
//       if (err) return res.send(err)
//       res.send(result)
//     }
//   )
// }

// exports.association_details = function (req, res) {
//     Association.findById(req.query.associationID, function (err, association) {
//         if (err) return res.send(err);
//         res.send(association);
//     })
// };

// exports.all = function (req, res) {
//     Association.find({}).then(function (offers) {
//         res.send(offers);
//     });
// };

// exports.update_association = function (req, res) {
//   const id = req.query.associationID;
//   const { body: { association } } = req
//   Association.findByIdAndUpdate(id, {$set: association}, function (err, offer) {
//     if (err) return next(err);
//     res.send('Association updated.');
//   });
// };

// exports.add_admin = function (req, res) {
//   const id = req.body.associationID;
//   const email = req.body.email;
//   const name = req.body.name;
//   Association.findByIdAndUpdate(id, 
//     {$push: {'admins': {'email': email, 'name': name}}}, function (err) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send('Admin added');
//       }
//     }
//   );
// };

// function validateEmailAccessibility(email){
//   return Association.findOne({email: email}).then(function(result){
//     return result === null;
//   });
// }

// exports.create_association = function (req, res) {
//     const { body: { association } } = req;
//     console.log(req.body);

//     if(!association.email) {
//         return res.status(422).json({
//             errors: {
//                 email: 'is required',
//             },
//         });
//     }

//     validateEmailAccessibility(association.email).then(function(valid) {
//       if (valid) {
//           if(!association.password) {
//             return res.status(422).json({
//               errors: {
//                   password: 'is required',
//               },
//           });
//         }

//         let newAssociation = new Association(association)
//         newAssociation.setPassword(association.password);
//         newAssociation.save(function (err) {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.send('Association created successfully')
//             }
//         })
//       } else {
//         return res.status(403).json({
//           errors: {
//               email: 'Already Exists',
//           },
//         });
//       }
//     });
// };

// exports.emailPasswordResetLink = asyncWrapper(async (req, res) => {
//   if (req.body.email !== undefined) {
//     var emailAddress = req.body.email;
//     Association.findOne({email: emailAddress}, function (err, association) {
//       if (err) {
//         return res.sendStatus(403)
//       }
//       const today = new Date();
//       const expirationDate = new Date(today);
//       expirationDate.setMinutes(today.getMinutes() + 5);
//       if (association) {
//         var payload = {
//           id: association._id,        // User ID from database
//           email: emailAddress,
//         };
//         var secret = association.hash;
//         var token = jwt.encode(payload, secret);
//         emailer.sendAssocPasswordLink(emailAddress, payload.id, token);
//         res.sendStatus(200)
//       } else {
//         return res.status(403).send('No accounts with that email')
//       }
//     })
//   } else {
//     return res.status(422).send('Email address is missing.')
//   }
// });

// exports.verifyPasswordResetLink = asyncWrapper(async (req, res) => {
//   const association = await Association.findById(req.params.id)
//   var secret = association.hash;
//   try{
//     var payload = jwt.decode(req.params.token, secret);   
//     res.sendStatus(200)      
//   }catch(error){
//     console.log(error.message);
//     res.sendStatus(403);
//   }
// });

// exports.resetPassword = asyncWrapper(async (req, res) => {
//   var newPassword = req.body.newPassword
//   // update password
//   const association = await Association.findById(req.body.id)
//   association.setPassword(newPassword)
//   association.save(function(err, result) {
//     if (err) {    
//       return res.status(422).send(err);
//     } 
//     res.sendStatus(200)
//   })
// });

// var rad = function(x) {
//   return x * Math.PI / 180;
// };

// function calcDistance(latA, longA, latB, longB) {
//   var R = 6378137; // Earth’s mean radius in meter
//   var dLat = rad(latB - latA);
//   var dLong = rad(longB - longA);
//   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(rad(latA)) * Math.cos(rad(latB)) *
//       Math.sin(dLong / 2) * Math.sin(dLong / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = R * c;
//   return d;
// }

// exports.assoc_by_lat_long = asyncWrapper(async (req, res) => {
//     var latitude = req.query.latitude
//     var longitude = req.query.longitude

//     var associations = await Association.find({});
//     var relevantAssociations = []

//     for (var i = 0; i < associations.length; i++) {
//         var currentAssociation = associations[i]
//         if (currentAssociation.name !== "Covaid") {
//           var rad = currentAssociation.radius
//           var currentAssociationLat = currentAssociation.location.coordinates[0]
//           var currentAssociationLong = currentAssociation.location.coordinates[1]
//           var distance = calcDistance(latitude, longitude, currentAssociationLat, currentAssociationLong) / 1609.34
//           if (distance <= rad) {
//             relevantAssociations.push(currentAssociation)
//           }
//         }
//     }
//     res.send(relevantAssociations)
// });

// exports.current = function (req, res) {
//   const id = req.token.id;

//   return Association.findById(id)
//     .then((association) => {
//       if(!association) {
//         return res.sendStatus(400);
//       }
//       return res.json(association);
//   });
// };

// exports.login = function (req, res, next) {
//     const { body: { association } } = req;
//     if(!association.email) {
//       return res.status(422).json({
//         errors: {
//           email: 'is required',
//         },
//       });
//     }
  
//     if(!association.password) {
//       return res.status(422).json({
//         errors: {
//           password: 'is required',
//         },
//       });
//     }
  
//     return passport.authenticate('associationLocal', { session: false }, (err, passportAssociation, info) => {
//       if(err) {
//         return next(err);
//       }
//       if(passportAssociation) {
//         const association = passportAssociation;
//         association.token = passportAssociation.generateJWT();
//         return res.json({ user: association.toAuthJSON() });
//       } else {
//         return res.status(400).json({
//           errors: {
//             password: "incorrect",
//           },
//         });
//       }
//     })(req, res, next);
// };