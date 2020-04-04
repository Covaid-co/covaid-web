const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const user_controller = require('../../controllers/user.controller');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, user_controller.register);

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, user_controller.login);

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, user_controller.current);

router.get('/all', user_controller.all_users);
router.get('/user', user_controller.find_user);
router.get('/allFromAssoc', auth.optional, user_controller.all_users_of_an_association);

router.put('/update', auth.required, user_controller.update);

router.get('/totalUsers', auth.optional, user_controller.total_users);

router.post('/verify', user_controller.verify);

router.post('/emailpasswordresetlink', user_controller.emailPasswordResetLink)
router.get('/verifyresetlink/:id/:token', user_controller.verifyPasswordResetLink)
router.post('/resetpassword', user_controller.resetPassword)

module.exports = router;