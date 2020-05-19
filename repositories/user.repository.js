const User = require('../models/user.model'); 

exports.readUsers = async function (query) {
    try {
        var users = await User.find(query);
        return users;
    } catch (e) {
        console.log("is this shit working???")
        throw Error('Error while querying requests');
    }
}