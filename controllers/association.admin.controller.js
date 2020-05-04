const asyncWrapper = require("../util/asyncWrapper")
const AssociaitonAdminService = require('../services/association.admin.service');

/**
 * Handle requests to register a user
 */
exports.handleRegisterRequest = asyncWrapper(async (req, res) => {
    const { body: { admin } } = req;
    if (!admin.association_id) {
        return res.status(422).json({
            errors: {
                association: 'is required',
            },
        });
    }
    
    if (!admin.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
	}
	admin.email = admin.email.toLowerCase();

    if (!admin.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    try {
		const new_admin = await AssociaitonAdminService.registerAdmin(admin);
        return (new_admin._id === null) ? res.sendStatus(500) : res.status(201).send({'_id': new_admin._id});
    } catch (e) {
		return res.status(422).send(e);
    }
});

/**
 * Handle requests to login
 */
exports.handleLoginRequest = asyncWrapper(async (req, res) => {
	const { body: { admin } } = req;
    if(!admin.email) {
		return res.status(422).json({
			errors: {
				email: 'is required',
			},
		});
    }
  
    if(!admin.password) {
		return res.status(422).json({
			errors: {
				password: 'is required',
			},
		});
	}
	
	try {
		let result = await AssociaitonAdminService.login_admin(admin);
		res.status(200).json(result)
    } catch (e) {
        console.log(e);
        return res.status(422).send({
			error: e.message
		});
	}
});

/**
 * Get current user who is logged in
 */
exports.handleGetCurrentAdmin = function (req, res) {
	const id = req.token.id;
	return AssociaitonAdminService.get_admin_by_id(id)
		.then((admin) => {
			if (admin.length === 0) {
				return res.sendStatus(400);
			}
			return res.json(admin[0]);
		})
};