const User = require('../models/user.model'); 

exports.createUser = async function (user) {
    try {
        let new_user = new User(user);
        let saveUser = await new_user.save();
        return saveUser;
    } catch (e) {
        throw e;
    }
}

exports.readUser = async function (query, limit) {
    try {
        var users = await User.find(query).limit(limit);
        return users;
    } catch (e) {
        throw Error('Error while querying Users');
    }
}

exports.findUsersInLocationRange = async function (latitude, longitude, radius, limit) {
    try {
        var users = await User.find({'offer.availability': true,
                      'logistics.verified': true,
                      'location_info.location': 
                        { 
                          $geoWithin: 
                            { $centerSphere: 
                                [[ latitude, longitude], 
                                radius / 3963.2] 
                            }
                        }
                    }).limit(20)

        return users;
    } catch (e) {
        throw Error('Error while querying Users');
    }
}

exports.updateUser = async function(_id, updates) {
    try {
        await User.updateOne({_id: _id}, {
            $set: updates
        });
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