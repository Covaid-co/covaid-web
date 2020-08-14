const router = require("express").Router();
const auth = require("../auth");
const user_controller = require("../../controllers/user.controller");
const mobile_controller = require("../../controllers/mobile.controller");

// POST
router.post("/", auth.optional, user_controller.register);
router.post("/login", auth.optional, user_controller.login);
router.post("/loginMobile", mobile_controller.loginMobile);
router.post("/resetpassword", user_controller.resetPassword);
router.post("/emailpasswordresetlink", user_controller.emailPasswordResetLink);
router.post("/verify", user_controller.verify);

// GET
router.get("/current", auth.required, user_controller.current);
router.post("/refresh", mobile_controller.refresh);
router.get(
  "/currentMobile",
  auth.authenticate,
  mobile_controller.currentMobile
);
router.get("/all", user_controller.all_users);
router.get("/actual_all", user_controller.actual_all_users);
router.get("/user", user_controller.find_user);
router.get("/userIDs", user_controller.getUsersByIds);
router.get(
  "/allFromAssoc",
  auth.optional,
  user_controller.all_users_of_an_association
);
router.get("/totalUsers", auth.optional, user_controller.total_users);
router.get(
  "/verifyresetlink/:id/:token",
  user_controller.verifyPasswordResetLink
);

// PUT
router.put("/update", auth.required, user_controller.update);
router.put("/set_notes", user_controller.set_notes);
router.put("/update_verify", user_controller.update_verify);

// DELETE
router.delete("/logoutMobile", mobile_controller.logoutMobile);
router.delete("/delete", auth.required, user_controller.delete);

module.exports = router;
