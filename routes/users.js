const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchasync");
const passport = require("passport");
const {storeReturnTo} = require("../middlewares/storeReturnto");
const users = require("../controllers/users");

router.get("/register", users.RenderRegister);

router.post(
  "/register",
  catchAsync(users.RegisterUser)
);

router.get("/login", users.RenderLogin);

router.post("/login",storeReturnTo,passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",}),
 users.LoginUser
);


router.get('/logout', users.LogoutUser); 
module.exports = router;
