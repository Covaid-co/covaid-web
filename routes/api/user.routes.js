const router = require('express').Router();
const auth = require('../auth');

const user_controller = require('../../controllers/user.controller');

// Authentication
router.post('/register', auth.optional, user_controller.handleRegisterRequest);
router.post('/login', auth.optional, user_controller.handleLoginRequest);

// Get current user
router.get('/current', auth.required, user_controller.handleGetCurrentUser);
router.get('/', user_controller.handleGetUsers);

// Update user info
router.put('/update', user_controller.handleUpdateInfo);


// To-Do 
// Password Reset 
// emailPasswordResetLink
// verifyPasswordResetLink
// resetPassword (should already be done)



// router.post('/', auth.optional, user_controller.register);
// router.post('/resetpassword', user_controller.resetPassword);
// router.post('/emailpasswordresetlink', user_controller.emailPasswordResetLink);
// router.post('/verify', user_controller.verify);
// router.post('/verify', user_controller.verify);

// //POST login route (optional, everyone has access)
// router.post('/login', auth.optional, user_controller.login);

// //GET current route (required, only authenticated users have access)
// router.get('/current', auth.required, user_controller.current);
// router.get('/all', user_controller.all_users);
// router.get('/user', user_controller.find_user);
// router.get('/allFromAssoc', auth.optional, user_controller.all_users_of_an_association);
// router.get('/totalUsers', auth.optional, user_controller.total_users);
// router.get('/verifyresetlink/:id/:token', user_controller.verifyPasswordResetLink);
// router.get('/:id/delete', user_controller.delete);

// router.put('/update', auth.required, user_controller.update);
// router.put('/set_notes', user_controller.set_notes);
// router.put('/update_verify', user_controller.update_verify);

module.exports = router;