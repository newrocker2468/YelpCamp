const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchasync");
const passport = require("passport");
const {storeReturnTo} = require("../middlewares/storeReturnto");
const users = require("../controllers/users");

router.route("/register")
.get(users.RenderRegister)
.post(catchAsync(users.RegisterUser))
router.route("/register/seed")
.post(catchAsync(users.RegisterUserSeeder));
router.route("/login")
.get(users.RenderLogin)
.post(storeReturnTo,passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",}),
 users.LoginUser
);


router.get('/logout', users.LogoutUser); 

module.exports = router;
