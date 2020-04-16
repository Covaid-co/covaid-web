const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 

exports.createUser = async function (user) {
    try {
        var new_user = new User(user);
        new_user.password_components = generatePassword(user.password);
        new_user.save();
        return new_user;
    } catch (e) {
        console.log(e);
    }
}

generatePassword = (password) => {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: hash,
    };
}

exports.getUsers = async function (query) {
    try {
        var users = await User.find(query);
        return users;
    } catch (e) {
        throw Error('Error while querying Users')
    }
}

exports.updateUser = async function(user_id, updated_user) {
    try {

    } catch (e) {
        throw Error('Error while updating users')
    }
}

exports.deleteUser = async function(user_id) {
    try {
        
    } catch (e) {
        throw Error('Error while deleting user')
    }
}