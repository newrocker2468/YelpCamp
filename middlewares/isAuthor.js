const Campground = require("../models/campground");
module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground.equals(req.user._id)){
       req.flash("error", "You don't have permission to do that!");
       return res.redirect(`/campgrounds/${campground._id}`);
    };
}