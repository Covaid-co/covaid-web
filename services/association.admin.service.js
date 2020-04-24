const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const AssociaitonAdminRepository = require('../repositories/association.admin.repository');

exports.registerAdmin = async function (admin) {
    try{
        let valid = await validate_email_accessibility(admin.email);
        if (valid) {
            setPassword(admin, admin.password);
            var new_admin = await AssociaitonAdminRepository.createAssociationAdmin(admin);

            return new_admin;
        } else {
            throw new Error('Email already exists');
        }
    } catch (e){
        throw e;
    }
}

exports.login_admin = async function (admin) {
    try {
        let email = admin.email;
        let found_admin = await AssociaitonAdminRepository.readAssociationAdmin({ "email" : { $regex : new RegExp(email, "i") } });
        if (found_admin.length === 0 || !validate_password(found_admin[0], admin.password)) {
            throw new Error('Email or password is invalid');
        }
        else {
            return ({admin: toAuthJSON(found_admin[0])});
        }
    } catch (e) {
        throw e;
    }
}

exports.get_admin_by_id = async function(id) {
    let query = {_id: id};
    try {
        return await AssociaitonAdminRepository.readAssociationAdmin(query, 1);
    } catch (e) {
        throw e;
    }
}

exports.get_admins = async function(query, limit) {
    try {
        return await AssociaitonAdminRepository.readAssociationAdmin(query, limit);
    } catch (e) {
        throw e;
    }
}

exports.update_admin = async function(_id, updates) {
    try {
        await AssociaitonAdminRepository.updateAssociationAdmin(_id, updates);
    } catch (e) {
        throw e;
    }
}

const validate_password = (admin, incomingPassword) => {
    const hash = getHash(incomingPassword, admin.password.salt);
    crypto.pbkdf2Sync(incomingPassword, admin.password.salt, 10000, 512, 'sha512').toString('hex');
    return admin.password.hash === hash;
}

const validate_email_accessibility = async (email) => {
    let result = await AssociaitonAdminRepository.readAssociationAdmin({email: email});
    return result.length === 0;
}

const setPassword = (admin, plainTextPassword) => {
    var salty = getSalt();
    admin.password = {
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

const toAuthJSON = (admin) => {
    return {
        _id: admin._id,
        email: admin.email,
        token: generateJWT(admin),
    };
}

const generateJWT = (admin) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const secret = process.env.SECRET || "secret"
    return jwt.sign({
    email: admin.email,
    id: admin._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, secret);
}