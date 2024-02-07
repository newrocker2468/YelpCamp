
const User = require("../models/user");




module.exports.RenderRegister = (req, res) => {
    res.render("users/register");
  }

module.exports.RegisterUser = async (req, res,next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, async (err) => {
        if (err) return next(err);
        req.flash('success', `Welcome ${username}!`)
        return res.redirect('/campgrounds')
      });
 
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  }



  module.exports.RenderLogin = (req, res) => {
    res.render("users/login");
  }

  module.exports.LoginUser =  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl);
  }

  module.exports.LogoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}