const { getQuote } = require("../middlewares/RandomQuoteAPI");
const Campground = require("../models/campground");
const express = require("express");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken:mapBoxToken})

module.exports.index = async (req, res) => {
  try {
    const campgrounds = await Campground.find({});

    // Array of quotes
    const quotes = [
      "The best way to get started is to quit talking and begin doing. – Walt Disney",
      "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty. – Winston Churchill",
      "Don’t let yesterday take up too much of today. – Will Rogers",
      "You learn more from failure than from success. Don’t let it stop you. Failure builds character. – Unknown",
      "It’s not whether you get knocked down, it’s whether you get up. – Vince Lombardi",
    ];

    // Select a random quote
    const r = quotes[Math.floor(Math.random() * quotes.length)];

    res.render("campgrounds/index", { campgrounds, r });
  } catch (err) {
    console.error("Error fetching campgrounds:", err);
    res.status(500).send("Internal Server Error");
  }
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
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.CreateNewCampground = async (req, res, next) => {
  // if(!req.body.tittle) throw new ExpressError("Invalid Campground Data",400);
  const geodata = await geocoder.forwardGeocode({
    query:req.body.location,
    limit:1
  }).send()

  const campground = new Campground(req.body);
  campground.geometry = geodata.body.features[0].geometry;
  campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.Author = req.user._id;
  await campground.save();
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

// module.exports.UpdateCampground = async (req, res) => {
//   console.log(req.body);
//   const campground = await Campground.findByIdAndUpdate(
//     req.params.id,
//     req.body
//   );
//   const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
//   campground.images.push(...imgs);
//   await campground.save();
// if(req.body.deleteImages){
//   await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//   for(let filename of req.body.deleteImages){
//     await cloudinary.uploader.destroy(filename);
//   }
//  console.log(campground);
// }
//   req.flash("success", "Successfully Updated Campground!");
//   res.redirect(`/campgrounds/${campground._id}`);
// };

module.exports.UpdateCampground = async (req, res, next) => {
  try {
    
    const geodata = await geocoder.forwardGeocode({
      query:req.body.location,
      limit:1
    }).send()
    req.body.geometry = geodata.body.features[0].geometry;
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
      await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
    }
    req.flash("success", "Successfully Updated Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    next(err); // Pass the error to your error handling middleware
  }
};










module.exports.DeleteCampground = async (req, res) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground Deleted Successfully!");
  res.redirect("/campgrounds");
};

