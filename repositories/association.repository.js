const Association = '../models/association.model';

exports.createAssociation = async function (association) {
    try {
        let new_association = new Association(association);
        let save_association = await new_association.save();
        return save_association;
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
        await Association.findByIdAndRemove(association_id);
    } catch (e) {
        throw Error('Error while deleting AssociationAdmin')
    }
}