const express = require("express");
const wrapAsnc = require("../utils/wrapAsnc");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsnc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
  .route("signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );

// log out route
router.get("/logout", userController.logout);

module.exports = router;
