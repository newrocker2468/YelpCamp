const express = require('express');
const router = express.Router(mergeparams=true);
const catchAsync = require("../utils/catchasync");
const {validateCampground, validateReview } = require("../validators/validator");
const {getQuote} = require('../middlewares/RandomQuoteAPI');
const Campground = require('../models/campground');
const Review = require('../models/review');





  router.get(
    "/",
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      const r = await getQuote();
     console.log(r);
  
      res.render("campgrounds/index", { campgrounds,r});
      
    })
  );
  
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const resultcampground = await Campground.findById(req.params.id).populate("reviews");
      if (!resultcampground) {
        req.flash("error", "Campground Not Found!"); 
        return res.redirect("/campgrounds");}
      res.render("campgrounds/show", { resultcampground});
    })
  );
  
  router.post(
    "/",
    validateCampground,
    catchAsync(async (req, res, next) => {
      // if(!req.body.tittle) throw new ExpressError("Invalid Campground Data",400);
  
      const campground = new Campground(req.body);
      await campground.save();
      req.flash("success", "Successfully made a new Campground!");
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      if (!resultcampground) {
        req.flash("error", "Campground Not Found!"); 
        return res.redirect("/campgrounds");}
      res.render("campgrounds/edit", { campground });
    })
  );
  
  router.post(
    "/:id/edit",validateCampground,
    catchAsync(async (req, res) => {
      const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      req.flash("success", "Successfully Updated Campground!");
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );

  router.post('/:id/reviews', validateReview ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
  }));
  
  router.post("/:id/reviews/:reviewId/delete", async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}});
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/campgrounds/${campground.id}`);
  })
  
  
  router.post(
    "/:id/delete",
    catchAsync(async (req, res) => {
     await Campground.findByIdAndDelete(req.params.id);
     req.flash("success", "Campground Deleted Successfully!");
      res.redirect("/campgrounds");
    })
  );

module.exports = router;