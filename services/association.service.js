const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const EmailService = require('./email.service');
const AssociationRepository = require('../repositories/association.repository');

exports.createAssociation = async function (association) {
    try {
        let valid = await validate_email_accessibility(association.email);
        if (valid) {
            setPassword(association, association.password);
            console.log()
            association.created_on = Date.now();
            var new_association = await AssociationRepository.createAssociation(association);
            return new_association;
        } else {
            throw new Error('Email already exists');
        }
    } catch (e){
        throw e;
    }
}

exports.loginAssociation = async function (association) {
    try {
        let email = association.email;
        let found_association = await AssociationRepository.readAssociation({ "email" : { $regex : new RegExp(email, "i") } });
        if (found_association.length === 0 || !validate_password(found_association[0], association.password)) {
            throw new Error('Email or password is invalid');
        } else {
            return ({association: toAuthJSON(found_association[0])});
        }
    } catch (e) {
        throw e;
    }
}

exports.get_association_by_id = async function(id) {
    let query = {_id: id};
    try {
        return await AssociationRepository.readAssociation(query, 1);
    } catch (e) {
        throw e;
    }
}

exports.get_associations = async function(query, limit) {
    try {
        return await AssociationRepository.readAssociation(query, limit);
    } catch (e) {
        throw e;
    }
}

exports.get_associations_by_location = async function(latitude, longitude) {
    try {
        let allAssociations =  await AssociationRepository.readAssociation({});
        var relevantAssociations = []
        for (var i = 0; i < allAssociations.length; i++) {
            var currentAssociation = allAssociations[i]
            if (currentAssociation.name !== "Covaid") {
                var rad = currentAssociation.locationInfo.radius;
                var currentAssociationLat = currentAssociation.locationInfo.location.coordinates[0]
                var currentAssociationLong = currentAssociation.locationInfo.location.coordinates[1]
                var distance = calcDistance(latitude, longitude, currentAssociationLat, currentAssociationLong) / 1609.34
                if (distance <= rad) {
                    relevantAssociations.push(currentAssociation)
                }
            }
        }
        return relevantAssociations;
    } catch (e) {
        throw e;
    }
}

exports.update_association = async function(association_id, updates) {
    try {
        await AssociationRepository.updateAssociation(association_id, updates);
    } catch (e) {
        throw e;
    }
}

exports.addLink = async function(association_id, link) {
    try {
        return await AssociationRepository.addAssociationResourceLink(association_id, link);
    } catch (e) {
        throw e;
    }
}

exports.deleteLink = async function(association_id, link_id) {
    try {
        await AssociationRepository.deleteAssociationResourceLink(association_id, link_id);
    } catch (e) {
        throw e;
    }
}

exports.addAdmin = async function(association_id, admin) {
    try {
        return await AssociationRepository.createAssociationAdmin(association_id, admin);
    } catch (e) {
        throw e;
    }
}

const validate_password = (association, incomingPassword) => {
    const hash = getHash(incomingPassword, association.password.salt);
    crypto.pbkdf2Sync(incomingPassword, association.password.salt, 10000, 512, 'sha512').toString('hex');
    return association.password.hash === hash;
}

const validate_email_accessibility = async (email) => {
    let result = await AssociationRepository.readAssociation({email: email});
    return result.length === 0;
}

const setPassword = (association, plainTextPassword) => {
    var salty = getSalt();
    association.password = {
        salt: salty,
        hash: getHash(plainTextPassword, salty)
    }
};
    
const getSalt = () => {
    return crypto.randomBytes(16).toString('hex');
}

const getHash = (plainTextPassword, salt) => {
    return crypto.pbkdf2Sync(plainTextPassword, salt, 10000, 512, 'sha512').toString('hex');
}

const toAuthJSON = (association) => {
    return {
        _id: association._id,
        email: association.email,
        token: generateJWT(association),
    };
}

const generateJWT = (association) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const secret = process.env.SECRET || "secret"
    return jwt.sign({
    email: association.email,
    id: association._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, secret);
}

const rad = (x) => {
  return x * Math.PI / 180;
};

const calcDistance = (latA, longA, latB, longB) => {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(latB - latA);
  var dLong = rad(longB - longA);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(latA)) * Math.cos(rad(latB)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}