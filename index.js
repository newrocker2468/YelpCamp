// if(process.env.NODE_ENV !== "production"){
//   require("dotenv").config();
// }
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campground");
const catchAsync = require("./utils/catchasync");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport"); 
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const mongosanitize = require("express-mongo-sanitize");
const { default: helmet } = require("helmet");
const MongoStore = require("connect-mongo");
const { MongoClient, ServerApiVersion } = require('mongodb');
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

// const dbUrl ="mongodb://127.0.0.1:27017/campground";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: `${secret}`
  }
});

store.on("error", function(e){
  console.log("Session Store Error", e);
}
);
const client = new MongoClient(dbUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);






// async function run() {
//   try {

//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);







app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongosanitize());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/ ",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'self'","'unsafe-inline'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          scriptSrcAttr: ["'self'", "'unsafe-inline'"],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dk3oikndv/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
              "https://source.unsplash.com/",
              "https://imgs.search.brave.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      }
      ,
  })
);










const sessionConfig = {
  store,
  name: "Session",
  secret:`${secret}` ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
   },
};
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("Thisismysecret"));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {
  console.log(req.query);
  res.locals.originalurl=req.originalUrl;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("", userRoutes);

app.get(
  "/",
  catchAsync(async (req, res) => {
    // const campgrounds = await Campground.find({});
    // const r = await getQuote();
    // console.log(r);

    res.render("home");
  })
);

// const hashpassword = async (pw) => {
//   const salt = await bcrypt.genSalt(12);
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
// };

// hashpassword("monkey");

// const login = async (pw, hpw) => {
//   const result = await bcrypt.compare(pw, hpw);
//   if (result) {
//     console.log("Logged in");
//   } else {
//     console.log("Try again");
//   }
// };
// login("monkey", "$2b$12$oiP70d20XKzRR9.2hjg4ROnQP5Xzn9IGgghXeeK3L/XZH/OHWghW.");

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
  if(err.message === "Page not found"){
    return res.redirect("/campgrounds");
  }

  const { statusCode = 500 } = err;
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Oh No, Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
