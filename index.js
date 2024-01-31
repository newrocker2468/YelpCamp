const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const morgan = require("morgan");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campground");
const catchAsync = require("./utils/catchasync");


app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use("/campgrounds",campgroundRoutes );

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/campground");
}


app.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    const r = await getQuote();
   console.log(r);

    res.render("campgrounds/index", { campgrounds,r});
    
  })
);


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
