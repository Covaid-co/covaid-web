const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const EmailService = require('./email.service');
// const Spreads
const UserRepository = require('../repositories/user.repository');

exports.register_user = async function (user) {
    try{
        let valid = await validate_email_accessibility(user.email);
        if (valid) {
            setPassword(user, user.password);
            user.created_on = Date.now();
            user.verified = false;
            var new_user = await UserRepository.createUser(user);
            // TO-DO 
            // Add to spreadsheet
            EmailService.sendWelcomeEmail(new_user);
            return new_user;
        } else {
            throw new Error('Email already exists');
        }
    } catch (e){
        throw e;
    }
}

exports.login_user = async function (user) {
    try {
        let email = user.email;
        let found_user = await UserRepository.readUser({ "email" : { $regex : new RegExp(email, "i") } });
        if (found_user.length === 0 || !validate_password(found_user[0], user.password)) {
            throw new Error('Email or password is invalid');
        } else if (!found_user[0].logistics.verified) {
            throw new Error('Unverified user');
        }
        else {
            return ({user: toAuthJSON(found_user[0])});
        }
    } catch (e) {
        throw e;
    }
}

exports.get_user_by_id = async function(id) {
    let query = {_id: id};
    try {
        return await UserRepository.readUser(query, 1);
    } catch (e) {
        throw e;
    }
}

exports.get_users = async function(query, limit) {
    try {
        return await UserRepository.readUser(query, limit);
    } catch (e) {
        throw e;
    }
}

exports.update_user = async function(_id, updates) {
    try {
        await UserRepository.updateUser(_id, updates);
    } catch (e) {
        throw e;
    }
}

const validate_password = (user, incomingPassword) => {
    const hash = getHash(incomingPassword, user.password.salt);
    crypto.pbkdf2Sync(incomingPassword, user.password.salt, 10000, 512, 'sha512').toString('hex');
    return user.password.hash === hash;
}

const validate_email_accessibility = async (email) => {
    let result = await UserRepository.readUser({email: email});
    return result.length === 0;
}

const setPassword = (user, plainTextPassword) => {
    var salty = getSalt();
    user.password = {
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

const toAuthJSON = (user) => {
    return {
        _id: user._id,
        email: user.email,
        token: generateJWT(user),
    };
}

const generateJWT = (user) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const secret = process.env.SECRET || "secret"
    return jwt.sign({
    email: user.email,
    id: user._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, secret);
}