const Campground = require("../models/campground");
const Review = require("../models/review"); 


module.exports.CreateReviews = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.Author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
  };
  module.exports.DeleteReview = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    console.log(campground);
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
  };
  