const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const morgan = require("morgan");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchasync");
const joi = require("joi");
const {campgroundSchema,reviewSchema} = require("./schemas");
const {getQuote} = require('./middlewares/RandomQuoteAPI');
const Campground = require('./models/campground');
const Review = require('./models/review');

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));


async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/campground");
}

const validateCampground = (req, res, next) => {

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// app.use((req, res, next) => {
//   req.requestTime = Date.now();
// console.log(req.method, req.path,req.httpVersion,req.stale);
// next();
// });

main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   console.log("RequestDate" + req.requestTime);
//   res.render("home");
// });

// app.get("/makecampground",async (req,res)=>{
//     const camp = new Campground({tittle:"My Backyard",description:"cheap camping!"});
//     await camp.save()
//     .then(data=>{
//         console.log(data);
//     })
//     .catch(err => console.log(err));
//     res.send(camp)
// })

app.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    const r = await getQuote();
   console.log(r);

    res.render("campgrounds/index", { campgrounds,r});
    
  })
);
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    const r = await getQuote();
   console.log(r);

    res.render("campgrounds/index", { campgrounds,r});
    
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const resultcampground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { resultcampground });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if(!req.body.tittle) throw new ExpressError("Invalid Campground Data",400);

    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.post(
  "/campgrounds/:id/edit",validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
app.post('/campgrounds/:id/reviews', validateReview ,async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.post("/campgrounds/:id/reviews/:reviewId/delete", async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}});
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/campgrounds/${campground.id}`);
})


app.post(
  "/campgrounds/:id/delete",
  catchAsync(async (req, res) => {
   await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);


app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.status = 400;
    res.send("Enter a valid Number");
  }
  next(err);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Oh No, Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
