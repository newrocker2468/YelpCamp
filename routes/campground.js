
const express = require("express");
const router = express.Router((mergeparams = true));
const { isloggedin } = require("../middlewares/loginverifier");
const catchAsync = require("../utils/catchasync");
const {
  validateCampground,
  validateReview,
} = require("../validators/validator");
const { getQuote } = require("../middlewares/RandomQuoteAPI");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {isAuthor} = require("../middlewares/isAuthor");
const {isReviewAuthor} = require("../middlewares/isReviewAuthor");
// const isloggedin = async(req, res, next) => {
//   console.log(req.user);
//  if (!req.isAuthenticated()) {
//    req.flash("error", "You must be signed in!");

//    return res.redirect("/login");
//  }
//  next();

// }
router.get(  "/",catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    const r = await getQuote();
    // console.log(r);

    res.render("campgrounds/index", { campgrounds, r });
  })
);

router.get("/new", isloggedin,(req, res) => {

  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const resultcampground = await Campground.findById(req.params.id).populate({path:"reviews",
    populate:{
      path:"Author"
    
    }}).populate("Author");
    if (!resultcampground) {
      req.flash("error", "Campground Not Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { resultcampground });
  })
);

router.post(
  "/",
  isloggedin,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if(!req.body.tittle) throw new ExpressError("Invalid Campground Data",400);

    const campground = new Campground(req.body);
    campground.Author = req.user._id; 
    await campground.save();
    req.flash("success", "Successfully made a new Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id/edit",
  isloggedin,isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground Not Found!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

router.post(
  "/:id/edit",
  isloggedin,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
   
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    req.flash("success", "Successfully Updated Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.post(
  "/:id/reviews",
  isloggedin,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.Author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// router.get("/:id/reviews/:reviewId/delete",isloggedin,isReviewAuthor, async (req, res) => {
//   const {id} = req.params;
//   const c = await Campground.findById({id});
//   res.redirect(`/campgrounds/${c.id}`)
// })
router.post("/:id/reviews/:reviewId/delete",isloggedin,isReviewAuthor,catchAsync( async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  console.log(campground);
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.post(
  "/:id/delete",
  isloggedin,
  isAuthor,
  catchAsync(async (req, res) => {

    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground Deleted Successfully!");
    res.redirect("/campgrounds");
  })
);

// router.get("/:id/reviews/:reviewId/delete",isloggedin,isReviewAuthor, async (req, res) => {
//   // const {id,reviewId} = req.params;
//   // const c = await Campground.findByIde({id});
//   res.redirect(`/campgrounds`)
// });
module.exports = router;
