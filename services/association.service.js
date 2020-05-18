const AssociationRepository = require('../repositories/association.repository');

exports.getAssociation = async function(query) {
    try {
        return await AssociationRepository.readAssociation(query);
    } catch (e) {
        throw e;
    }
}