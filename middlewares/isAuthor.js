const Campground = require("../models/campground");
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.Author.equals(req.user._id)){
       req.flash("error", "You don't have permission to do that!");
       return res.redirect(`/campgrounds/${campground._id}`);
    };
    next();
}