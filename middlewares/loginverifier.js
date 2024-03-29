
    module.exports.isloggedin = (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl; // add this line
            req.flash('error', 'You must be signed in first!');
            return res.redirect('/login');
        }
        next();
    }
