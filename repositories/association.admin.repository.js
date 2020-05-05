const AssociationAdmin = require('../models/association.admin.model'); 

exports.createAssociationAdmin = async function (associationAdmin) {
    try {
        let new_AssociationAdmin = new AssociationAdmin(associationAdmin);
        let saveAssociationAdmin = await new_AssociationAdmin.save();
        return saveAssociationAdmin;
    } catch (e) {
        throw e;
    }
}

exports.readAssociationAdmin = async function (query, limit) {
    try {
        var associationAdmins = await AssociationAdmin.find(query).limit(limit);
        return associationAdmins;
    } catch (e) {
        throw Error('Error while querying AssociationAdmins');
    }
}

exports.updateAssociationAdmin = async function(_id, updates) {
    try {
        await AssociationAdmin.updateOne({_id: _id}, {
            $set: updates
        });
    } catch (e) {
        throw Error('Error while updating AssociationAdmins')
    }
}

exports.deleteAssociationAdmin = async function(associationAdmin_id) {
    try {
        await AssociationAdmin.findByIdAndRemove(associationAdmin_id);
    } catch (e) {
        throw Error('Error while deleting AssociationAdmin')
    }
}