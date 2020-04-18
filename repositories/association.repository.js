const Association = require('../models/association.model'); 
const AssociationResourceLinks = require('../models/association-resources.model');
const AssociationAdmin = require('../models/association-admin.model');

exports.createAssociation = async function (association) {
    try {
        let new_association = new Association(association);
        let saveAssociation = await new_association.save();
        return saveAssociation;
    } catch (e) {
        throw e;
    }
}

exports.readAssociation = async function (query, limit) {
    try {
        var associations = await Association.find(query).limit(limit);
        return associations;
    } catch (e) {
        throw Error('Error while querying associations');
    }
}

exports.updateAssociation = async function(_id, updates) {
    try {
        await Association.updateOne({_id: _id}, {
            $set: updates
        });
    } catch (e) {
        throw Error('Error while updating associations')
    }
}

exports.deleteAssociation = async function(association_id) {
    try {

        
    } catch (e) {
        throw Error('Error while deleting association')
    }
}

exports.addAssociationResourceLink = async function (association_id, link) {
    try {
        let newLink = new AssociationResourceLinks(link);
        await Association.findByIdAndUpdate(association_id,
            {
                $push: {
                    'links': newLink
                }
            }, {safe: true, upsert: true}
        );
        return newLink;
    } catch (e) {
        throw e;
    }
}

exports.deleteAssociationResourceLink = async function (association_id, link_id) {
    try {
        await Association.update(
            {_id: association_id},
            {
                $pull: {
                    links: {
                        _id: link_id
                    }
                }
            }
        );
    } catch (e) {
        throw e;
    }
}

exports.createAssociationAdmin = async function (association_id, admin) {
    try {
        let newAdmin = new AssociationAdmin(admin);
        await Association.findByIdAndUpdate(association_id,
            {
                $push: {
                    'admins': newAdmin
                }
            }, {safe: true, upsert: true}
        );
        return newAdmin;
    } catch (e) {
        throw e;
    }
}

exports.readAssociationAdmin = async function (query, limit) {
    try {
        
    } catch (e) {
        throw Error('Error while querying associations');
    }
}

exports.updateAssociationAdmin = async function(_id, updates) {
    try {
       
    } catch (e) {
        throw Error('Error while updating associations')
    }
}

exports.deleteAssociationAdmin = async function(association_id) {
    try {

        
    } catch (e) {
        throw Error('Error while deleting association')
    }
}