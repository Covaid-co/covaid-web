const UserRepository = require('../repositories/user.repository');

// exports.registerUser = async function (user) {
//     try{
//         let valid = await validate_email_accessibility(user.email);
//         if (valid) {
//             setPassword(user, user.password);
//             var new_user = await AssociaitonAdminRepository.createAssociationAdmin(admin);
//             return new_user;
//         } else {
//             throw new Error('Email already exists');
//         }
//     } catch (e){
//         throw e;
//     }
// }

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

const validate_email_accessibility = async (email) => {
    let result = await AssociaitonAdminRepository.readAssociationAdmin({email: email});
    return result.length === 0;
}