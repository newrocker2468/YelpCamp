const express = require("express");
const router = express.Router((mergeparams = true));
const { isloggedin } = require("../middlewares/loginverifier");
const catchAsync = require("../utils/catchasync");
const {
  validateCampground,
  validateReview,
} = require("../validators/validator");
const { isAuthor } = require("../middlewares/isAuthor");
const { isReviewAuthor } = require("../middlewares/isReviewAuthor");
const campground = require("../controllers/campground");
const review = require("../controllers/review");

router.get("/", catchAsync(campground.index));

router.get("/new", isloggedin, campground.RenderNewForm);

router.get("/:id", catchAsync(campground.ShowAllCampgrounds));

router.post(
  "/",
  isloggedin,
  validateCampground,
  catchAsync(campground.CreateNewCampground)
);

router.post(
  "/:id/delete",
  isloggedin,
  isAuthor,
  catchAsync(campground.DeleteCampground)
);

router.get(
  "/:id/edit",
  isloggedin,
  isAuthor,
  catchAsync(campground.RenderEditForm)
);

router.post(
  "/:id/edit",
  isloggedin,
  isAuthor,
  validateCampground,
  catchAsync(campground.UpdateCampground)
);

router.post(
  "/:id/reviews",
  isloggedin,
  validateReview,
  catchAsync(review.CreateReviews)
);
router.get("/:id/reviews/:reviewId/delete",isloggedin,isReviewAuthor, async (req, res) => {
  const {id} = req.params;
  const c = await Campground.findById({id});
  res.redirect(`/campgrounds/${c.id}`)
})
router.post(
  "/:id/reviews/:reviewId/delete",
  isloggedin,
  isReviewAuthor,
  catchAsync(review.DeleteReview)
);

// router.get("/:id/reviews/:reviewId/delete",isloggedin,isReviewAuthor, async (req, res) => {
//   const {id,reviewId} = req.params;
//   const c = await Campground.findByIde({id});
//   res.redirect(`/campgrounds${c.id}`)
// });
module.exports = router;
