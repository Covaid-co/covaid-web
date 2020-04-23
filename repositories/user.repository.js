const User = require('../models/user.model'); 

exports.readUsers = async function (query) {
    try {
        var users = await User.find(query);
        return users;
    } catch (e) {
        throw Error('Error while querying requests');
    }
}