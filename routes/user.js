const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/AsyncWrap.js");
const passport = require('passport');
const { saveredirectUrl } = require("../middleware.js");
const userCallbacks = require("../controller/user.js");


// Signup
router
    .route("/signup")
    .get(userCallbacks.signupForm)
    .post(asyncWrap(userCallbacks.signUp));



// Login
router
    .route("/login")
    .get(userCallbacks.loginForm)
    .post(saveredirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        userCallbacks.login
    );

// Logout
router.get('/logout', userCallbacks.logout);

module.exports = router;
