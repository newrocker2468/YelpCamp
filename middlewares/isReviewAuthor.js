const Review = require("../models/review");
const campground = require("../models/campground");
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.Author.equals(req.user._id)){
       req.flash("error", "You don't have permission to do that!");
       return res.redirect(`/campgrounds/${id}`);
    };
    next();
}