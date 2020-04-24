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

// /**
//  * Get all users given a query and a limit
//  */
// exports.handleGetUsers = asyncWrapper(async (req, res) => {

// 	const query = req.query;
// 	const limit = null;

// 	try {
// 		let users = await UserService.get_users(query, limit);
// 		return res.json(users);
// 	} catch (e) {
// 		return res.sendStatus(400);
// 	}
// });

// /**
//  * Get all users given a latitude, longitude, and radius
//  */
// exports.handleGetUsersGivenLocation = asyncWrapper(async (req, res) => {
// 	const latitude = req.query.latitude;
// 	const longitude = req.query.longitude;
// 	const radius = req.query.radius;
// 	const limit = req.query.limit;
// 	try {
// 		let users = await UserService.get_users_with_location(latitude, longitude, radius, limit);
// 		return res.json(users);
// 	} catch (e) {
// 		return res.sendStatus(400);
// 	}
// });

// /**
//  * Update any user-related information
//  */
// exports.handleUpdateInfo = asyncWrapper(async (req, res) => {
// 	const { body: { _id, updates } } = req;
// 	try {
// 		await UserService.update_user(_id, updates);
// 		return res.sendStatus(200);
// 	} catch (e) {
// 		console.log(e);
// 		return res.sendStatus(400);
// 	}
// });