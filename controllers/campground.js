const { getQuote } = require("../middlewares/RandomQuoteAPI");
const Campground = require("../models/campground");
const express = require("express");


module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  const r = await getQuote();
  res.render("campgrounds/index", { campgrounds, r });
};

module.exports.RenderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.ShowAllCampgrounds = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "Author",
      },
    })
    .populate("Author");
    console.log(campground);
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.CreateNewCampground = async (req, res, next) => {
  // if(!req.body.tittle) throw new ExpressError("Invalid Campground Data",400);

  const campground = new Campground(req.body);
  campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.Author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.RenderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.UpdateCampground = async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.images.push(...imgs);
  await campground.save();
  req.flash("success", "Successfully Updated Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.DeleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  await Campground.save();
  req.flash("success", "Campground Deleted Successfully!");
  res.redirect("/campgrounds");
};

