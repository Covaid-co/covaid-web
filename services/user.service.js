const UserRepository = require('../repositories/user.repository');

exports.getUsersByUserIDs = async function(_ids) {
    try {
        const query = {
            _id: { 
                $in: _ids
            } 
        }
        const users = await UserRepository.readUsers(query);
        return users;

    } catch (e) {
        throw e;
    }
}

exports.getUser = async function(query) {
    try {
        const users = await UserRepository.readUsers(query);
        return users;

    } catch (e) {
        throw e;
    }
}

// TODO